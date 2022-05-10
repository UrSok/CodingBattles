import { FormInstance, Space, Typography } from 'antd';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import { Language } from 'app/types/global';
import React, { MutableRefObject, useEffect } from 'react';
import monaco from 'monaco-editor';
import { SaveFields } from '../../../../types';
import { stubInputLanguage } from 'config/monaco';
import { useWatch } from 'antd/lib/form/Form';
import { StubGeneratorModel } from 'app/api/types/stubGenerator';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { stubGeneratorApi } from 'app/api/stubGenerator';
import { getLanguageKeyName } from 'app/utils/enumHelpers';
import ErrorAlert from './components/ErrorAlert';

type StubGeneratorProps = {
  stubCodeEditorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  readOnly?: boolean;
  initialValue?: string;
  onStubInputChangedDecorator?: (value: string | undefined) => void;
  onResultChanged?: (stub: string, isValid: boolean) => void;
};

export default function StubGenerator(props: StubGeneratorProps) {
  const {
    stubCodeEditorRef,
    readOnly,
    initialValue,
    onStubInputChangedDecorator,
    onResultChanged,
  } = props;

  const stubLanguage: Language = useWatch(SaveFields.stubLanguage);

  const getStubQueryValue = (
    language: Language,
    generatorInput: string | undefined,
  ): StubGeneratorModel | typeof skipToken => {
    if (!generatorInput || generatorInput.length === 0) return skipToken;
    return {
      language: language,
      input: generatorInput,
    };
  };

  const { refetch, data: generatorResult } =
    stubGeneratorApi.useGenerateStubQuery(
      getStubQueryValue(
        stubLanguage ?? getLanguageKeyName(Language.javascript),
        stubCodeEditorRef?.current?.getValue() ?? initialValue,
      ),
    );

  const triggerStubGeneration = async (input: string | undefined) => {
    if (input?.length === 0 || !input) return;
    refetch();
  };

  const handleStubInputChanged = async (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    //setEmptyStubInput(!value || value?.length === 0);
    triggerStubGeneration(value);
    if (onStubInputChangedDecorator) {
      onStubInputChangedDecorator(value);
    }
  };

  useEffect(() => {
    if (generatorResult) {
      const isEmpty =
        !generatorResult.value ||
        (generatorResult.value && !generatorResult.value.stub) ||
        (generatorResult.value && generatorResult.value.stub?.length === 0);

      const isValid =
        !isEmpty ||
        (generatorResult.isSuccess && !generatorResult.value?.error);

      if (onResultChanged) {
        onResultChanged(generatorResult.value?.stub ?? '', isValid);
      }
    }
  }, [generatorResult]);

  return (
    <>
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <CodeEditor
          editorRef={stubCodeEditorRef}
          defaultValue={initialValue}
          language={stubInputLanguage}
          readOnly={readOnly}
          onModelChange={handleStubInputChanged}
        />

        {generatorResult &&
        !generatorResult.isSuccess &&
        generatorResult.value &&
        generatorResult.value.error ? (
          <ErrorAlert error={generatorResult.value.error!} />
        ) : null}
      </Space>
      <Typography.Text strong>Result</Typography.Text>
      <LanguageSelect
        antdFieldName={SaveFields.stubLanguage}
        placeholder="Generation language"
        width="sm"
        defaultLanguage={Language.javascript}
        style={{
          marginBottom: '5px',
        }}
      />
      <CodeEditor
        language={stubLanguage}
        defaultValue="// update the stub input to get the result"
        value={generatorResult?.value?.stub}
        readOnly
      />
    </>
  );
}

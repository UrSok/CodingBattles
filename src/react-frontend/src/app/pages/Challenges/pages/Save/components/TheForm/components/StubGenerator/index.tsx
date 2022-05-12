import { Space, Typography } from 'antd';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import { Language } from 'app/types/global';
import React, { MutableRefObject, useEffect } from 'react';
import monaco from 'monaco-editor';
import { stubInputLanguage } from 'config/monaco';
import { useWatch } from 'antd/lib/form/Form';
import { StubGeneratorModel } from 'app/api/types/stubGenerator';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { stubGeneratorApi } from 'app/api/stubGenerator';
import { getLanguageKeyName } from 'app/utils/enumHelpers';
import ErrorAlert from './components/ErrorAlert';
import { FormFields } from '../../types';

type StubGeneratorProps = {
  stubCodeEditorRef: MutableRefObject<
    monaco.editor.IStandaloneCodeEditor | undefined
  >;
  disabled?: boolean;
  initialValue?: string;
  onStubInputChangedDecorator?: (value: string | undefined) => void;
  onResultChanged?: (
    stubInput: string | undefined,
    generatedStub: string | undefined,
    isValid: boolean,
  ) => void;
};

export default function StubGenerator(props: StubGeneratorProps) {
  const {
    stubCodeEditorRef,
    disabled,
    initialValue,
    onStubInputChangedDecorator,
    onResultChanged,
  } = props;

  const stubLanguage: Language = useWatch(FormFields.stubLanguage);

  const getStubQueryValue = (
    language: Language,
    generatorInput: string | undefined,
  ): StubGeneratorModel | typeof skipToken => {
    //if (!generatorInput || generatorInput.length === 0) return skipToken;
    return {
      language: language,
      input: generatorInput ?? '',
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
        onResultChanged(
          stubCodeEditorRef.current?.getValue() ?? initialValue,
          generatorResult.value?.stub,
          isValid,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          readOnly={disabled}
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
        antdFieldName={FormFields.stubLanguage}
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

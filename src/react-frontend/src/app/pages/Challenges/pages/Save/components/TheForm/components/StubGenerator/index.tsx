import { Space, Typography } from 'antd';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import { Language } from 'app/types/enums/language';
import React, { MutableRefObject, useEffect, useState } from 'react';
import monaco from 'monaco-editor';
import { stubInputLanguage } from 'config/monaco';
import { useWatch } from 'antd/lib/form/Form';
import { stubGeneratorApi } from 'app/api/stubGenerator';
import ErrorAlert from './components/ErrorAlert';
import { FormFields } from '../../types';
import { skipToken } from '@reduxjs/toolkit/dist/query';

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

  const [input, setInput] = useState(initialValue);
  const language: Language = useWatch(FormFields.stubLanguage);

  const { data: generatorResult } = stubGeneratorApi.useGenerateStubQuery(
    language
      ? {
          language,
          input,
        }
      : skipToken,
  );

  const handleOnStubInputChange = async (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setInput(value);
    onStubInputChangedDecorator && onStubInputChangedDecorator(value);
  };

  const handleOnStubResultChange = async (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    if (!generatorResult) return;

    const isEmpty =
      !generatorResult.value ||
      (generatorResult.value && !generatorResult.value.stub) ||
      (generatorResult.value && generatorResult.value.stub?.length === 0);

    const isValid =
      !isEmpty || (generatorResult.isSuccess && !generatorResult.value?.error);

    onResultChanged &&
      onResultChanged(input, generatorResult.value?.stub, isValid);
  };

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
          onModelChange={handleOnStubInputChange}
        />

        {generatorResult &&
          !generatorResult.isSuccess &&
          generatorResult.value &&
          generatorResult.value.error && (
            <ErrorAlert error={generatorResult.value.error!} />
          )}
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
        language={language}
        defaultValue="// update the stub input to get the result"
        value={generatorResult?.value?.stub}
        onModelChange={handleOnStubResultChange}
        readOnly
      />
    </>
  );
}

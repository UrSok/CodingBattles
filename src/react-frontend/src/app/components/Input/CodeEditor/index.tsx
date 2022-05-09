import Editor, { Monaco, OnChange } from '@monaco-editor/react';
import monaco from 'monaco-editor';
import React, { MutableRefObject } from 'react';

import LoadingSpinner from '../../LoadingSpinner';

type CodeEditorProps = {
  editorRef?: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  language: string;
  height?: number;
  defaultValue?: string;
  value?: string;
  readOnly?: boolean;
  onModelChange?: OnChange;
};

export default function CodeEditor(props: CodeEditorProps) {
  const {
    editorRef,
    language,
    height,
    defaultValue,
    value,
    readOnly,
    onModelChange,
  } = props;

  const onMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    if (editorRef) {
      editorRef.current = editor;
    }
  };

  return (
    <Editor
      className="bordered-editor"
      loading={<LoadingSpinner />}
      theme="vs-dark"
      height={height ?? 300}
      language={language}
      defaultValue={defaultValue}
      value={value}
      options={{
        readOnly: readOnly,
      }}
      onMount={onMount}
      onChange={onModelChange}
    />
  );
}

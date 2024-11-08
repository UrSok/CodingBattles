import Editor, { Monaco, OnChange } from '@monaco-editor/react';
import monaco from 'monaco-editor';
import React, { MutableRefObject } from 'react';
import styled from 'styled-components';

import LoadingSpinner from '../../LoadingSpinner';

type CodeEditorProps = {
  editorRef?: MutableRefObject<monaco.editor.IStandaloneCodeEditor | undefined>;
  language: string;
  width?: string | number;
  height?: string | number;
  defaultValue?: string;
  value?: string;
  readOnly?: boolean;
  onModelChange?: OnChange;
};

export default function CodeEditor(props: CodeEditorProps) {
  const {
    editorRef,
    language,
    width,
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
    if (!editorRef) return;
    editorRef.current = editor;
  };

  return (
    <EditorWrapper>
      <Editor
        loading={<LoadingSpinner />}
        height={height ?? 300}
        width={width}
        language={language}
        defaultValue={defaultValue}
        value={value}
        options={{
          readOnly: readOnly,
        }}
        onMount={onMount}
        onChange={onModelChange}
      />
    </EditorWrapper>
  );
}

const EditorWrapper = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  section {
    resize: vertical;
    overflow: auto;
  }
`;

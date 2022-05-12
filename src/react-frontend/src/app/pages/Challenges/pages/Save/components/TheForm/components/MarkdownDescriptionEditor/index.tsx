import MDEditor from '@uiw/react-md-editor';
import React, { MutableRefObject, useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';

export type MarkdownEditorRef = {
  value?: string;
};

type MarkdownDescriptionEditorProps = {
  initialValue?: string;
  editorRef?: MutableRefObject<MarkdownEditorRef | undefined>;
  inputChanged?: (value: string | undefined) => void;
};

export default function MarkdownDescriptionEditor(
  props: MarkdownDescriptionEditorProps,
) {
  const { initialValue, editorRef, inputChanged } = props;
  const [descriptionMarkdown, setDescriptionMarkdown] = useState(initialValue);
  if (editorRef) {
    editorRef.current = {
      value: descriptionMarkdown,
    };
  }

  return (
    <div data-color-mode="light">
      <MDEditor
        value={descriptionMarkdown}
        highlightEnable={false}
        defaultValue={initialValue}
        onChange={value => {
          if (inputChanged) {
            inputChanged(value);
          }
          setDescriptionMarkdown(value ?? '');
        }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  )
}

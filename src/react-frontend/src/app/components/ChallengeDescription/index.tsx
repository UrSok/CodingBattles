import MDEditor from '@uiw/react-md-editor';
import React from 'react';
import rehypeSanitize from 'rehype-sanitize';

type ChallengeDescriptionProps = {
  value?: string;
};

export default function ChallengeDescription(props: ChallengeDescriptionProps) {
  const { value } = props;

  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={value} rehypePlugins={[[rehypeSanitize]]} />
    </div>
  );
}

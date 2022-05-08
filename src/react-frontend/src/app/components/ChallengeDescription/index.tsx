import React from 'react';
import ReactMarkdown from 'react-markdown';

type ChallengeDescriptionProps = {
  descriptionMarkdown: string;
};

export default function ChallengeDescription(props: ChallengeDescriptionProps) {
  return <ReactMarkdown children={props.descriptionMarkdown} />;
}

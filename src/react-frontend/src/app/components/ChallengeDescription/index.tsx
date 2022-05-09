import React from 'react';

type ChallengeDescriptionProps = {
  descriptionMarkdown: string;
};

export default function ChallengeDescription(props: ChallengeDescriptionProps) {
  return <p>{props.descriptionMarkdown}</p>;
}

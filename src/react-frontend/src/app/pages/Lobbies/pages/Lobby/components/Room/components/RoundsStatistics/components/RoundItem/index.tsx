import ProCard from '@ant-design/pro-card';
import { Round } from 'app/types/models/game/round';
import * as React from 'react';
import RoundSummaryItem from './components/RoundSummaryItem';

type RoundItemProps = {
  round: Round;
  gameId: string;
  defaultNotCollapsed?: boolean;
  isCurrent?: boolean;
};

export default function RoundItem(props: RoundItemProps) {
  const { round, defaultNotCollapsed, gameId, isCurrent } = props;

  const title = isCurrent ? 'Current Round' : `Round ${round.number}`;

  return (
    <ProCard
      title={title}
      collapsible
      defaultCollapsed={!isCurrent || !defaultNotCollapsed}
    >
      <ProCard split="horizontal" ghost>
        {round.roundSummaries.map((roundSummary, index) => (
          <ProCard ghost>
            <RoundSummaryItem
              key={roundSummary.user.id}
              roundNumer={round.number}
              gameId={gameId}
              summary={roundSummary}
              place={index + 1}
            />
          </ProCard>
        ))}
      </ProCard>
    </ProCard>
  );
}

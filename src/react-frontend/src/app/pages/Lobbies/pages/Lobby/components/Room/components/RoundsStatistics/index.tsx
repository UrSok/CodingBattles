import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import NoData from 'app/components/NoData';
import { Game } from 'app/types/models/game/game';
import { Round } from 'app/types/models/game/round';
import * as React from 'react';
import RoundItem from './components/RoundItem';

type RoundsStatiscticsProps = {
  gameInfo: Game;
};

export default function RoundsStatistics(props: RoundsStatiscticsProps) {
  const { gameInfo } = props;
  const rounds = gameInfo.currentRound
    ? [gameInfo.currentRound, ...gameInfo.previousRounds]
    : gameInfo.previousRounds;

  return (
    <ProList<Round>
      ghost
      split
      rowKey={(record, _) => record.number}
      locale={{
        emptyText: <NoData />,
      }}
      dataSource={rounds.filter(x => x.roundSummaries?.length > 0)}
      renderItem={(round, index) => {
        return (
          <ProCard
            ghost
            style={{
              marginBottom: 8,
            }}
          >
            <RoundItem
              round={round}
              gameId={gameInfo.id}
              defaultNotCollapsed={index === 0}
              isCurrent={gameInfo.currentRound?.number === round.number}
            />
          </ProCard>
        );
      }}
    />
  );
}

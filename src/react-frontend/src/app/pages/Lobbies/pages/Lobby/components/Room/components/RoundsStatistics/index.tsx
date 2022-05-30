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
      rowKey={(record, _) => record.number}
      locale={{
        emptyText: <NoData />,
      }}
      dataSource={rounds.some(x => x.roundSummaries?.length > 0) ? rounds : []}
      renderItem={(round, index) => {
        return (
          <RoundItem
            round={round}
            gameId={gameInfo.id}
            isCurrent={gameInfo.currentRound?.number === round.number}
          />
        );
      }}
    />
  );
}

import { gameApi } from 'app/api';
import Page from 'app/components/Layout/Page';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { selectAuth } from 'app/slices/auth/selectors';
import { GameStatus } from 'app/types/enums/gameStatus';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Ide from './components/Ide';
import Room from './components/Room';

export default function Lobby() {
  const { id } = useParams();
  const { user } = useSelector(selectAuth);

  const { data } = gameApi.useGetByIdQuery(id!, {
    pollingInterval: 1000,
  });

  if (!data || !data.value)
    return (
      <Page>
        <LoadingSpinner centered />
      </Page>
    );

  const { value: gameInfo } = data;

  if (
    !gameInfo.currentRound ||
    gameInfo.status !== GameStatus.InProgress ||
    gameInfo.currentRound.roundSummaries.some(x => x.user.id === user?.id)
  ) {
    return <Room gameInfo={gameInfo} />;
  }

  return <Ide gameInfo={gameInfo} />;
}

import { gameApi } from 'app/api';
import { GameStatus } from 'app/api/types/games';
import Page from 'app/components/Layout/Page';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { selectAuth } from 'app/slices/auth/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Ide from './pages/Ide';
import Room from './pages/Room';
import { addMinutesToDate } from './pages/utils/date';

export default function Lobby() {
  const { id } = useParams();
  const user = useSelector(selectAuth);

  const { data } = gameApi.useGetByIdQuery(id!, {
    pollingInterval: 1000,
  });

  if (!data)
    return (
      <Page>
        <LoadingSpinner centered />
      </Page>
    );

  const { value: gameInfo } = data;


  //console.log(getActiveRounds);
  //if (gameInfo?.rounds && gameInfo.r)
  //console.log(game)
  if (!gameInfo?.currentRound || gameInfo?.status !== GameStatus.InProgress) {
    return <Room gameInfo={gameInfo} />;
  }

  return <Ide gameInfo={gameInfo} />;
}

import { gameApi } from 'app/api';
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
    pollingInterval: 2000,
  });

  if (!data)
    return (
      <Page>
        <LoadingSpinner centered />
      </Page>
    );

  const { value: gameInfo } = data;

  const getActiveRounds = gameInfo?.rounds.filter(x => {
    //console.log(addMinutesToDate(x.startTime, x.durationMinutes).getTime);
    //console.log(Date.now);
    //addMinutesToDate(x.startTime, x.durationMinutes).getTime
  });

  //console.log(getActiveRounds);
  //if (gameInfo?.rounds && gameInfo.r)
  //console.log(game)
  if (!gameInfo?.rounds || gameInfo.rounds.length === 0) {
    return <Room gameInfo={gameInfo} />;
  }

  return <Ide gameInfo={gameInfo} />;
}

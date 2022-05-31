import { gameApi } from 'app/api';
import Page from 'app/components/Page';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { selectAuth, selectUser } from 'app/slices/auth/selectors';
import { RoundStatus } from 'app/types/enums/roundStatus';
import { RoundSummaryStatus } from 'app/types/enums/roundSummaryStatus';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Ide from './components/Ide';
import Room from './components/Room';

export default function Lobby() {
  const { id } = useParams();
  const authUser = useSelector(selectUser);

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
    gameInfo.currentRound?.status !== RoundStatus.InProgress ||
    gameInfo.currentRound?.roundSummaries.some(
      x =>
        x.user.id === authUser?.id &&
        (x.status === RoundSummaryStatus.Submitted ||
          x.status === RoundSummaryStatus.Submitting),
    ) ||
    !gameInfo.users.some(x => x.id === authUser?.id)
  ) {
    return <Room gameInfo={gameInfo} />;
  }

  return <Ide gameInfo={gameInfo} />;
}

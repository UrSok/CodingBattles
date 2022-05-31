import { blue } from '@ant-design/colors';
import ProCard from '@ant-design/pro-card';
import { selectUser } from 'app/slices/auth/selectors';
import { RoundSummaryStatus } from 'app/types/enums/roundSummaryStatus';
import { RoundSummary } from 'app/types/models/game/roundSummary';
import * as React from 'react';
import { useSelector } from 'react-redux';
import RoundSummaryContent from './components/RoundSummaryContent';
import RoundSummaryExtra from './components/RoundSummaryExtra';
import RoundSummaryTitle from './components/RoundSummaryTitle';

type RoundSummaryItemProps = {
  summary: RoundSummary;
  roundNumer: number;
  gameId: string;
  place: number;
};

export default function RoundSummaryItem(props: RoundSummaryItemProps) {
  const { summary, roundNumer, gameId, place } = props;
  const authUser = useSelector(selectUser);

  const shouldShowContent =
    (authUser?.id === summary.user.id || summary.solutionShared) &&
    summary.status === RoundSummaryStatus.Submitted;

  return (
    <ProCard
      ghost
      collapsible={shouldShowContent}
      defaultCollapsed={authUser?.id !== summary.user.id}
      title={<RoundSummaryTitle roundSummary={summary} place={place} />}
      extra={<RoundSummaryExtra roundSummary={summary} />}
      style={{
        backgroundColor: summary.user.id === authUser?.id ? blue[2] : undefined,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
      }}
    >
      {shouldShowContent && (
        <RoundSummaryContent
          solution={summary.solution!}
          roundNumber={roundNumer}
          wasSolutionShared={summary.solutionShared}
          gameId={gameId}
          testSummaries={summary.testSummaries}
        />
      )}
    </ProCard>
  );
}

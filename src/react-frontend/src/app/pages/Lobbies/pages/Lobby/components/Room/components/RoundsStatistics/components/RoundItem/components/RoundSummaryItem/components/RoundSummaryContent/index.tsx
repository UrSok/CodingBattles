import * as React from 'react';
import ProCard from '@ant-design/pro-card';
import { Button } from 'antd';
import CodeEditor from 'app/components/Input/CodeEditor';
import { TestSummary } from 'app/types/models/game/testSummary';
import { Solution } from 'app/types/models/general/solution';
import TestSummaryItem from './components/TestSummaryItem';
import { gameApi } from 'app/api';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/slices/auth/selectors';

type RoundSummaryContentProps = {
  solution: Solution;
  wasSolutionShared: boolean;
  roundNumber: number;
  gameId: string;
  testSummaries: TestSummary[];
};

export default function RoundSummaryContent(props: RoundSummaryContentProps) {
  const { solution, wasSolutionShared, roundNumber, gameId, testSummaries } =
    props;
  const authUser = useSelector(selectUser);

  const [triggerShareSolution] = gameApi.useShareSolutionMutation();

  const handleOnShareResult = () => {
    if (!authUser) return;
    console.log(gameId);
    triggerShareSolution({
      gameId: gameId,
      userId: authUser.id,
      roundNumber: roundNumber,
    });
  };

  return (
    <ProCard ghost direction="column" gutter={[8, 8]}>
      <ProCard
        title="Solution"
        extra={
          !wasSolutionShared && (
            <Button type="primary" onClick={handleOnShareResult}>
              Share Result
            </Button>
          )
        }
      >
        <CodeEditor
          height={300}
          language={solution.language}
          defaultValue={solution.sourceCode}
          readOnly
        />
      </ProCard>
      <ProCard title="Tests" split="horizontal">
        {testSummaries.map((summary, index) => (
          <ProCard
            ghost
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 10,
            }}
          >
            <TestSummaryItem
              key={index}
              status={summary.status}
              reason={summary.reason}
              testPair={summary.testPair}
            />
          </ProCard>
        ))}
      </ProCard>
    </ProCard>
  );
}

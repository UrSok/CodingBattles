import ProCard from '@ant-design/pro-card';
import { Avatar, Button, Space } from 'antd';
import { RoundStatus } from 'app/types/enums/roundStatus';
import { Round } from 'app/types/models/game/round';
import * as React from 'react';
import RoundSummaryItem from './components/RoundSummaryItem';
import TimerSand from '@2fd/ant-design-icons/lib/TimerSand';
import Countdown from 'antd/lib/statistic/Countdown';
import FeedbackModalForm from 'app/components/FeedbackModalForm';

type RoundItemProps = {
  round: Round;
  gameId: string;
  defaultNotCollapsed?: boolean;
  isCurrent?: boolean;
};

export default function RoundItem(props: RoundItemProps) {
  const { round, defaultNotCollapsed, gameId, isCurrent } = props;

  const title = isCurrent ? 'Current Round' : `Round ${round.number}`;

  const deadLine = round.startTime
    ? new Date(round.startTime).getTime() + 1800000
    : 0;

  return (
    <ProCard
      title={title}
      collapsible={!isCurrent || !defaultNotCollapsed}
      defaultCollapsed={!isCurrent || !defaultNotCollapsed}
      extra={
        <Space size="large">
          {round.status === RoundStatus.InProgress && (
            <Space size={4}>
              <Countdown
                valueStyle={{
                  fontSize: 20,
                }}
                value={deadLine}
              />
              <Avatar
                style={{
                  backgroundColor: 'darkgray',
                }}
              >
                <TimerSand />
              </Avatar>
            </Space>
          )}
          {<FeedbackModalForm challenge={round.challenge} />}
        </Space>
      }
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

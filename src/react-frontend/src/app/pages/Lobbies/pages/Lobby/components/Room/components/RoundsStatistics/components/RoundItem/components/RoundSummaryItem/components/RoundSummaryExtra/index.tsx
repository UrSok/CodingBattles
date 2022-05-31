import { Avatar, Space, Tag, Typography } from 'antd';
import { RoundSummaryStatus } from 'app/types/enums/roundSummaryStatus';
import { RoundSummary } from 'app/types/models/game/roundSummary';
import * as React from 'react';
import ClockTimeThree from '@2fd/ant-design-icons/lib/ClockTimeThree';
import CodeJson from '@2fd/ant-design-icons/lib/CodeJson';
import Percent from '@2fd/ant-design-icons/lib/Percent';
import { Language } from 'app/types/enums/language';
import { SyncOutlined } from '@ant-design/icons';

type RoundSummaryExtraProps = {
  roundSummary: RoundSummary;
};

export default function RoundSummaryExtra(props: RoundSummaryExtraProps) {
  const {
    score,
    timePassed: timePassedMs,
    solution,
    status,
  } = props.roundSummary;

  if (status === RoundSummaryStatus.NotSubmitted) {
    return (
      <Space size={5} align="center">
        <Tag color="warning">In Progress</Tag>
      </Space>
    );
  }

  if (status === RoundSummaryStatus.Submitting) {
    return (
      <Space size={5} align="center">
        <Tag color="success" icon={<SyncOutlined spin />}>
          Processing
        </Tag>
      </Space>
    );
  }

  var time = new Date(timePassedMs);

  return (
    <Space size="large" align="center">
      <Space size={5}>
        <Typography.Text
          strong
          style={{
            fontSize: 20,
          }}
        >
          {score}%
        </Typography.Text>
        <Avatar
          size="small"
          style={{
            backgroundColor: 'darkgray',
          }}
        >
          <Percent
            style={{
              fontSize: 12,
            }}
          />
        </Avatar>
      </Space>
      <Space size={5}>
        <Typography.Text
          strong
          style={{
            fontSize: 20,
          }}
        >
          {time.getUTCHours().toString().padStart(2, '0')}:
          {time.getUTCMinutes().toString().padStart(2, '0')}:
          {time.getUTCSeconds().toString().padStart(2, '0')}:
          {time.getUTCMilliseconds().toString().padStart(3, '0')}
        </Typography.Text>
        <Avatar
          size="small"
          style={{
            backgroundColor: 'darkgray',
          }}
        >
          <ClockTimeThree
            style={{
              fontSize: 12,
            }}
          />
        </Avatar>
      </Space>
      <Space size={5}>
        <Typography.Text
          strong
          style={{
            fontSize: 20,
          }}
        >
          {Language[solution!.language]}
        </Typography.Text>
        <Avatar
          size="small"
          style={{
            backgroundColor: 'darkgray',
          }}
        >
          <CodeJson
            style={{
              fontSize: 12,
            }}
          />
        </Avatar>
      </Space>
    </Space>
  );
}

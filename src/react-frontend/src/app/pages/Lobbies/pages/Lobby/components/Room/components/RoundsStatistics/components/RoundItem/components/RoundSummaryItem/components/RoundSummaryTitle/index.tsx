import { Avatar, Space, Typography } from 'antd';
import UserAvatar from 'app/components/Auth/UserAvatar';
import { RoundSummaryStatus } from 'app/types/enums/roundSummaryStatus';
import { RoundSummary } from 'app/types/models/game/roundSummary';
import * as React from 'react';

type RoundSummaryTitleProps = {
  roundSummary: RoundSummary;
  place: number;
};

export default function RoundSummaryTitle(props: RoundSummaryTitleProps) {
  const { roundSummary, place } = props;
  const { user, status } = roundSummary;

  return (
    <Space>
      <Space>
        <Avatar
          style={{
            backgroundColor: 'darkgray',
          }}
        >
          {status === RoundSummaryStatus.Submitted ? place : '?'}
        </Avatar>
      </Space>
      <Space>
        <UserAvatar userName={user.username} size="large" />
        <Typography.Text>{user.username}</Typography.Text>
      </Space>
    </Space>
  );
}

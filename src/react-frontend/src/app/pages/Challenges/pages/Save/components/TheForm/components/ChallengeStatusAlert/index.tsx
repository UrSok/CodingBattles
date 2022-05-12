import { Alert, Typography } from 'antd';
import { Challenge, ChallengeStatus } from 'app/api/types/challenge';
import React from 'react';

type ChallengeStatusAlertProps = {
  status?: ChallengeStatus;
  statusReason?: string;
}

export default function ChallengeStatusAlert(props: ChallengeStatusAlertProps) {
  const { status, statusReason } = props;

  if (status === ChallengeStatus.Published) {
    return (
      <Alert
        showIcon
        type="success"
        message="This challenge is already published!"
        description="You won't be able to modify the tests, stub input or solution."
      />
    );
  }

  if (status === ChallengeStatus.Unpublished) {
    return (
      <Alert
        showIcon
        type="warning"
        message="This challenge was unpublished!"
        description={
          <>
            <Typography.Text strong>Reason: </Typography.Text>
            {statusReason}
          </>
        }
      />
    );
  }

  return (
    <Alert
      showIcon
      closable
      type="info"
      message="Please ensure that everything is validated!"
      description="You won't be able to modify the tests, stub input or solution after you publish the challenge."
    />
  );
}

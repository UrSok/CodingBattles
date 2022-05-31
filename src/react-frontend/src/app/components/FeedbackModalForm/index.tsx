import { ModalForm, ProFormRate, ProFormTextArea } from '@ant-design/pro-form';
import { Button, notification, Result, Tooltip } from 'antd';
import { challengeApi } from 'app/api';
import { PATH_CHALLENGES } from 'app/routes/paths';
import { selectUser } from 'app/slices/auth/selectors';
import { Role } from 'app/types/enums/role';
import { Challenge } from 'app/types/models/challenge/challenge';
import { Feedback } from 'app/types/models/challenge/feedback';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export type FeedbackModalFormProps = {
  challenge: Challenge;
};

export default function FeedbackModalForm(props: FeedbackModalFormProps) {
  const { challenge } = props;
  const authUser = useSelector(selectUser);

  const [triggerSendFeedbak, sendFeedbackResult] =
    challengeApi.useSendFeedbackMutation();

  const handleOnSubmit = async values => {
    const result = await triggerSendFeedbak({
      challengeId: challenge.id,
      feedback: {
        ...values,
        userId: authUser?.id,
      },
    }).unwrap();

    if (result.isSuccess) {
      notification['success']({
        message: 'Feedback has been sent!',
        duration: 5,
      });
    }
  };

  return (
    <ModalForm<Feedback>
      title="Challenge feedback"
      trigger={
        challenge.user.id !== authUser?.id &&
        (authUser?.role === Role.Member || authUser?.role === Role.Admin) ? (
          <Button type="primary">Feedback</Button>
        ) : undefined
      }
      modalProps={{
        okText: 'Send',
        cancelText: 'Cancel',
        width: '400px',
        destroyOnClose: true,
      }}
      onFinish={handleOnSubmit}
    >
      <Link to={`${PATH_CHALLENGES.root}/${challenge.id}`}>
        Click to open the challenge
      </Link>
      <ProFormRate
        label="Difficulty"
        tooltip="How difficult the challenge was? This value will be used in difficulty calculation."
        name="difficulty"
        fieldProps={{
          allowHalf: true,
        }}
      />
      <ProFormRate
        label="Fun"
        tooltip="How fun the challenge was?"
        name="fun"
        fieldProps={{
          allowHalf: true,
        }}
      />
      <ProFormRate
        label="Test Cases Relvancy"
        tooltip="How relevant the test cases were?"
        name="testCasesRelvancy"
        fieldProps={{
          allowHalf: true,
        }}
      />
      <ProFormTextArea
        placeholder="Describe the experience"
        label="Text"
        name="text"
      />
    </ModalForm>
  );
}

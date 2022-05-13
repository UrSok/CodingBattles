import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';
import { gameApi } from 'app/api';
import { PATH_LOBBY } from 'app/routes/paths';
import React from 'react'
import { useNavigate } from 'react-router-dom';

type JoinLobbyModalProps = {
  userId: string;
};

type ModalProps = {
  code: string;
};

export default function JoinLobbyModal(props: JoinLobbyModalProps) {
  const { userId } = props;
  const navigate = useNavigate();

  const [triggerJoinLobby] = gameApi.useJoinGameMutation();

  const handleSubmit = async (values: ModalProps) => {
    const result = await triggerJoinLobby({
      userId: userId,
      code: values.code,
    }).unwrap();

    if (result.isSuccess) {
      navigate(PATH_LOBBY.root + `/${result.value}`);
    }
  };

  return (
    <ModalForm
      trigger={<Button type="primary">Join lobby</Button>}
      initialValues={{
        isPrivate: false,
      }}
      title="Create new lobby"
      onFinish={handleSubmit}
      modalProps={{
        okText: 'Join',
        destroyOnClose: true,
        cancelText: 'Cancel',
      }}
      width={400}
    >
      <ProFormText
        name="code"
        placeholder="Lobby code"
        rules={[
          {
            required: true,
            message: 'Lobby code is required',
          },
          {
            len: 8,
            message: 'Lobby code should be 8 characters long',
          },
        ]}
      />
    </ModalForm>
  );
}

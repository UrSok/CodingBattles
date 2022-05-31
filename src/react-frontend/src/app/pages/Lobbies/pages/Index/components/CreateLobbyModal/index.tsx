import { ModalForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Button, Result } from 'antd';
import { gameApi } from 'app/api';
import { PATH_LOBBY } from 'app/routes/paths';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type CreateLobbyModalProps = {
  userId: string;
};

type ModalFormProps = {
  name: string;
  isPrivate: boolean;
};

export default function CreateLobbyModal(props: CreateLobbyModalProps) {
  const { userId } = props;
  const navigate = useNavigate();

  const [triggerCreateLobby] = gameApi.useCreateGameMutation();

  const handleSubmit = async (values: ModalFormProps) => {
    const result = await triggerCreateLobby({
      userId: userId,
      name: values.name,
      isPrivate: values.isPrivate,
    }).unwrap();

    if (result.isSuccess) {
      navigate(PATH_LOBBY.root + `/${result.value}`);
    }
  };

  return (
    <ModalForm
      trigger={<Button type="ghost">Create</Button>}
      initialValues={{
        isPrivate: false,
      }}
      title="Create new lobby"
      onFinish={handleSubmit}
      modalProps={{
        okText: 'Create',
        destroyOnClose: true,
        cancelText: 'Cancel',
      }}
      width={400}
    >
      <ProFormText
        name="name"
        placeholder="Lobby name"
        rules={[
          {
            required: true,
            message: 'Name is required',
          },
        ]}
      />
      <ProFormCheckbox name="isPrivate" noStyle>
        Private
      </ProFormCheckbox>
    </ModalForm>
  );
}

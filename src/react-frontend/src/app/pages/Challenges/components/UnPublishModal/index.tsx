import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Result } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { challengeApi } from 'app/api';
import React from 'react';
import { useEffectOnce } from 'usehooks-ts';

type UnPublishModalProps = {
  challengeId: string;
};

type ModalFormProps = {
  statusReason: string;
};

export default function UnPublishModal(props: UnPublishModalProps) {
  const { challengeId } = props;
  const [form] = useForm<ModalFormProps>();

  const [triggerUpublishChallenge, { isLoading, data }] =
    challengeApi.useUnpublishChallengeMutation();

  useEffectOnce(() => {
    form.validateFields();
  });

  const handleSubmit = async (values: ModalFormProps) => {
    const result = await triggerUpublishChallenge({
      challengeId: challengeId,
      statusReason: values.statusReason,
    }).unwrap();

    if (result.isSuccess) {
      return true;
    }
    return false;
  };

  return (
    <ModalForm<ModalFormProps>
      form={form}
      trigger={<Button danger>Upublish</Button>}
      title="UnPublish challenge"
      onFinish={handleSubmit}
      submitter={{
        submitButtonProps: {
          danger: true,
        },
      }}
      modalProps={{
        okText: 'Send',
        destroyOnClose: true,
        cancelText: 'Cancel',
      }}
      width={400}
    >
      <ProFormTextArea
        name="statusReason"
        placeholder="The reason you want to unpublish the challenge"
        rules={[
          {
            required: true,
            message: 'Status reason is required',
          },
        ]}
      />
    </ModalForm>
  );
}

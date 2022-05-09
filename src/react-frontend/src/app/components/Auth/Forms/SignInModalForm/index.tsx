import React, { useState } from 'react';

import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import ProForm, {
  ModalForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-form';
import { Alert, Button, Form, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { FieldData } from 'rc-field-form/es/interface';
import styled from 'styled-components';

import { SignInModel } from 'app/api/types/auth';
import { translations } from 'locales/translations';
import { EMAIL_REGEX } from 'app/utils/constants';
import { authApi } from 'app/api/auth';

export default function SingInModalForm() {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [triggerSignIn, { data }] = authApi.useSignInMutation();

  const onSubmit = async (values: SignInModel) => {
    const result = await triggerSignIn(values).unwrap();

    if (result.isSuccess) {
      notification['success']({
        message: t(translations.SignInModalForm.SuccessNotification.message),
        description: (
          <p>
            {t(translations.SignInModalForm.SuccessNotification.description)}
          </p>
        ),
        duration: 5,
      });
    }
  };

  const validateFields = (
    _changedFields: FieldData[],
    allFields: FieldData[],
  ) => {
    const anyFieldNotTouched = !form.isFieldsTouched(
      ['email', 'password'],
      true,
    );
    const anyFieldInvalid = form
      .getFieldsError(['email', 'password'])
      .some(field => field.errors.some(error => true));

    setSubmitDisabled(anyFieldInvalid || anyFieldNotTouched);
  };

  return (
    <ModalForm<SignInModel>
      form={form}
      initialValues={{
        remember: true,
      }}
      title={t(translations.SignInModalForm.title)}
      modalProps={{
        okText: t(translations.SignInModalForm.signInButton),
        cancelText: t(translations.cancel),
        width: '400px',
        destroyOnClose: true,
        afterClose: () => setSubmitDisabled(true),
      }}
      trigger={<LoginOutlined style={{ fontSize: '20px' }} />}
      onFieldsChange={validateFields}
      onFinish={onSubmit}
      submitter={{
        submitButtonProps: {
          disabled: submitDisabled,
        },
      }}
    >
      {data && !data.isSuccess ? (
        <Alert
          type="error"
          message={t(translations.SignInModalForm.InvalidLoginAlert.message)}
          closable
          style={{ marginBottom: '10px' }}
        />
      ) : null}

      <ProForm.Group>
        <ProFormText
          width="lg"
          name="email"
          fieldProps={{
            prefix: <MailOutlined />,
          }}
          placeholder={t(translations.SignInModalForm.email)}
          rules={[
            {
              required: true,
              message: t(translations.SignInModalForm.validationEmailRequired),
            },
            {
              pattern: EMAIL_REGEX,
              message: t(translations.SignInModalForm.validationInvalidEmail),
            },
          ]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText.Password
          width="lg"
          name="password"
          fieldProps={{
            prefix: <LockOutlined />,
          }}
          placeholder={t(translations.SignInModalForm.password)}
          rules={[
            {
              required: true,
              message: t(
                translations.SignInModalForm.validationPasswordRequired,
              ),
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Item style={{ margin: 0 }}>
        <FixAlignment>
          <ProFormCheckbox noStyle name="remember">
            {t(translations.SignInModalForm.rememberMe)}
          </ProFormCheckbox>
          <Button type="link" style={{ padding: 0 }}>
            {t(translations.SignInModalForm.forgotPassword)}
          </Button>
        </FixAlignment>
      </ProForm.Item>
    </ModalForm>
  );
}

const FixAlignment = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

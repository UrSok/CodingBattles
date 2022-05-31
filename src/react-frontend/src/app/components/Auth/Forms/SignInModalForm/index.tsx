import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import ProForm, {
  ModalForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-form';
import { Alert, Button, Form, notification } from 'antd';
import { authApi } from 'app/api/auth';
import { AuthUserRequest } from 'app/api/auth/types/authUser';
import { EMAIL_REGEX } from 'app/utils/constants';
import { translations } from 'locales/translations';
import { FieldData } from 'rc-field-form/es/interface';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type SingInModalFormProps = {
  textButton?: boolean;
};

export default function SingInModalForm(props: SingInModalFormProps) {
  const { textButton } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [triggerSignIn, { data }] = authApi.useSignInMutation();

  const onSubmit = async (values: AuthUserRequest) => {
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
      return true;
    }
    return false;
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
    <ModalForm<AuthUserRequest>
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
      trigger={
        textButton ? (
          <Button type="ghost" size="large" icon={<LoginOutlined />}>
            Sign In
          </Button>
        ) : (
          <LoginOutlined style={{ fontSize: '20px' }} />
        )
      }
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
              type: 'email',
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

import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ProForm, {
  ModalForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-form';
import { Alert, Form, notification, Space } from 'antd';
import { authApi } from 'app/api/auth';
import { SignInModel } from 'app/api/types/auth';
import { EMAIL_REGEX } from 'app/utils/constants';
import { translations } from 'locales/translations';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldData } from 'rc-field-form/es/interface';

export default function SingInModalForm(props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [triggerSignIn, { data }] = authApi.useSignInMutation();
  const [submitDisabled, setSubmitDisabled] = useState(true);

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
  }

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
      {...props}
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

      <ProForm.Group {...props}>
        <ProFormText
          width="lg"
          name="email"
          fieldProps={{
            prefix: <MailOutlined />,
          }}
          placeholder={t(translations.SignInModalForm.email)}
          //hasFeedback
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

      <ProForm.Group {...props}>
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

      <ProForm.Group {...props}>
        <ProForm.Item name="remember" valuePropName="checked" noStyle>
          <ProFormCheckbox width="sm" noStyle>
            {t(translations.SignInModalForm.rememberMe)}
          </ProFormCheckbox>
        </ProForm.Item>
        <a href="">{t(translations.SignInModalForm.forgotPassword)}</a>
      </ProForm.Group>
    </ModalForm>
  );
}

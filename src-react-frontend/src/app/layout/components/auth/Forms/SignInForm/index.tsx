import * as React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { SignInModel } from 'app/api/types/auth';
import { translations } from 'locales/translations';
import { EMAIL_REGEX } from 'app/utils/constants';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { authApi } from 'app/api/auth';

export default function SignInForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [triggerSignIn, { isLoading }] = authApi.useSignInMutation();

  const onSubmit = (values: SignInModel) => {
    triggerSignIn(values);
  };

  //TODO: Fix someday sign in about appearing as clickable even when validation failed

  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <Form
      form={form}
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="email"
        hasFeedback
        rules={[
          {
            required: true,
            message: t(
              translations.AuthBadge.SignInForm.validationEmailRequired,
            ),
          },
          {
            pattern: EMAIL_REGEX,
            message: t(
              translations.AuthBadge.SignInForm.validationInvalidEmail,
            ),
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder={t(translations.AuthBadge.SignInForm.email)}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: t(
              translations.AuthBadge.SignInForm.validationPasswordRequired,
            ),
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={t(translations.AuthBadge.SignInForm.password)}
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{t(translations.AuthBadge.SignInForm.rememberMe)}</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="" style={{ float: 'right' }}>
          {t(translations.AuthBadge.SignInForm.forgotPassword)}
        </a>
      </Form.Item>

      <Form.Item
        style={{
          textAlign: 'center',
          marginLeft: '20%',
          marginRight: '20%',
        }}
        shouldUpdate
      >
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
            size="large"
            loading={isLoading}
            disabled={
              !form.isFieldsTouched(['email', 'password']) ||
              !!form
                .getFieldsError(['email', 'password'])
                .filter(({ errors }) => errors.length).length
            }
          >
            {t(translations.AuthBadge.signInButton)}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}

import React, { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { emailRegex } from 'app/utils/constants';
import { useAuthSlice } from 'app/slices/auth';
import { useDispatch } from 'react-redux';
import { SignInModel } from 'app/slices/auth/types';

export default function SignInForm() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const { t } = useTranslation();
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();

  const onFinish = (values: SignInModel) => {
    setButtonLoading(true);
    dispatch(actions.tryAuthenticate(values));
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
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
            pattern: emailRegex,
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
      >
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          block
          size="large"
          loading={buttonLoading}
        >
          {t(translations.AuthBadge.signInButton)}
        </Button>
      </Form.Item>
    </Form>
  );
}

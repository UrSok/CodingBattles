import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { emailRegex } from 'app/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { FieldData } from 'rc-field-form/es/interface';
import { useSignUpSlice } from './slice';
import { selectSignUp } from './slice/selectors';
import { SignUpModel } from './slice/types';

export default function SignUpForm() {
  const [form] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);
  const { t } = useTranslation();
  const { actions: signUpActions } = useSignUpSlice();
  const dispatch = useDispatch();
  const {
    isUniqueEmail,
    isUniqueEmailValidating,
    passwordMatch,
    signUpResult,
  } = useSelector(selectSignUp);

  if (signUpResult) {
    notification['success']({
      message: 'Sign up successful!',
      description: <p>A mail confirmation was sent to the indicated email!</p>,
      duration: 10,
    });
    dispatch(signUpActions.reset());
  }

  const showIsUniqueEmail = (isUniqueEmail: string) => {
    if (isUniqueEmailValidating === true) {
      form.setFields([
        {
          name: 'email',
          validating: true,
        },
      ]);
    }

    if (isUniqueEmail === 'no') {
      form.setFields([
        {
          name: 'email',
          validating: false,
          errors: [
            t(translations.AuthBadge.SignUpForm.validationEmailNotUnique),
          ],
        },
      ]);
    } else if (isUniqueEmail === 'yes') {
      form.setFields([
        {
          name: 'email',
          validating: false,
          errors: [],
        },
      ]);
    }
  };

  const showPasswordMatch = (passwordMatch: string) => {
    if (passwordMatch === 'no') {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [
            t(translations.AuthBadge.SignUpForm.validationPasswordDontMatch),
          ],
        },
      ]);
    } else if (passwordMatch === 'yes') {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [],
        },
      ]);
    }
  };

  const signUpValidation = (
    changedFields: FieldData[],
    allFields: FieldData[],
  ) => {
    if (changedFields.some(x => x.name.toString() === 'email')) {
      const emailField = allFields.find(x => x.name.toString() === 'email');
      dispatch(signUpActions.checkUniquieEmail(emailField!));
    }

    if (
      changedFields.some(
        x =>
          x.name.toString() === 'password' ||
          x.name.toString() === 'confirmPassword',
      )
    ) {
      const passwordField = allFields.find(
        x => x.name.toString() === 'password',
      );
      const confirmPasswordField = allFields.find(
        x => x.name.toString() === 'confirmPassword',
      );
      dispatch(
        signUpActions.checkPasswordsMatch({
          password: passwordField,
          confirmPassword: confirmPasswordField,
        }),
      );
    }
  };

  const onFinish = (values: SignUpModel) => {
    setButtonLoading(true);
    dispatch(signUpActions.trySignUp(values));
  };

  showIsUniqueEmail(isUniqueEmail);
  showPasswordMatch(passwordMatch);

  // To disable submit button at the beginning.
  const [, forceUpdate] = useState({});
  useEffect(() => {
    dispatch(signUpActions.reset());
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (signUpResult) {
      notification['success']({
        message: 'Sign up successful!',
        description: (
          <p>A mail confirmation was sent to the indicated email!</p>
        ),
        duration: 10,
      });
    }
  }, [signUpResult]);

  return (
    <Form
      form={form}
      name="normal_sign_up"
      className="sign-up-form"
      onFinish={onFinish}
      onFieldsChange={signUpValidation}
    >
      <Form.Item
        name="email"
        hasFeedback
        rules={[
          {
            required: true,
            message: t(
              translations.AuthBadge.SignUpForm.validationEmailRequired,
            ),
          },
          {
            pattern: emailRegex,
            message: t(
              translations.AuthBadge.SignUpForm.validationInvalidEmail,
            ),
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder={t(translations.AuthBadge.SignUpForm.email)}
        />
      </Form.Item>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: t(
              translations.AuthBadge.SignUpForm.validationUsernameRequired,
            ),
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={t(translations.AuthBadge.SignUpForm.username)}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: t(
              translations.AuthBadge.SignUpForm.validationPasswordRequired,
            ),
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={t(translations.AuthBadge.SignUpForm.password)}
        />
      </Form.Item>
      <Form.Item name="confirmPassword">
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={t(translations.AuthBadge.SignUpForm.passwordConfimation)}
        />
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
            className="sign-up-form-button"
            block
            size="large"
            loading={buttonLoading}
            disabled={
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length
            }
          >
            {t(translations.AuthBadge.signUpButton)}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}

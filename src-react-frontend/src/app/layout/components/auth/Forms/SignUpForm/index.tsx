import { Button, Form, Input, notification } from 'antd';
import { authApi } from 'app/api/auth';
import { SignUpModel } from 'app/api/types/auth';
import { translations } from 'locales/translations';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { FieldData } from 'rc-field-form/es/interface';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EMAIL_REGEX } from 'app/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { useSignUpFormSlice } from './slice';
import { selectSignUpForm } from './slice/selectors';

export default function SignUpForm() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [signUpRequest, { isLoading: isSignUpLoading, data: signUpData }] =
    authApi.useSignUpMutation();
  const [triggerIsUniqueEmail, { isLoading: isUniqueEmailLoading }] =
    authApi.useLazyIsUniqueEmailQuery();

  const { passwordMatch, isUniqueEmail } = useSelector(selectSignUpForm);
  const { actions: signUpActions } = useSignUpFormSlice();
  const dispatch = useDispatch();

  let firstInput = true;
  const checkEmail = async (emailField: FieldData) => {
    if (
      !emailField ||
      !emailField?.touched ||
      emailField?.value?.length < 5 ||
      (emailField.errors && emailField.errors.length > 0) ||
      (firstInput && !EMAIL_REGEX.test(emailField.value))
    ) {
      if (firstInput) {
        firstInput = false;
      }

      return;
    }

    await triggerIsUniqueEmail(emailField.value);
  };

  const signUpValidation = (
    changedFields: FieldData[],
    allFields: FieldData[],
  ) => {
    if (changedFields.some(x => x.name.toString() === 'email')) {
      const emailField = allFields.find(x => x.name.toString() === 'email');
      checkEmail(emailField!);
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

  const onSubmit = (values: SignUpModel) => {
    signUpRequest(values);
  };

  useEffect(() => {
    if (isUniqueEmailLoading) {
      form.setFields([
        {
          name: 'email',
          validating: true,
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUniqueEmailLoading]);

  useEffect(() => {
    if (isUniqueEmail === false) {
      form.setFields([
        {
          name: 'email',
          validating: false,
          errors: [
            t(translations.AuthBadge.SignUpForm.validationEmailNotUnique),
          ],
        },
      ]);
    } else if (isUniqueEmail === true || isUniqueEmail == null) {
      form.setFields([
        {
          name: 'email',
          validating: false,
          errors: [],
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUniqueEmail]);

  useEffect(() => {
    if (passwordMatch === false) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [
            t(translations.AuthBadge.SignUpForm.validationPasswordDontMatch),
          ],
        },
      ]);
    } else if (passwordMatch || passwordMatch == null) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [],
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordMatch]);

  useEffect(() => {
    if (signUpData?.isSuccess) {
      notification['success']({
        message: t(translations.AuthBadge.SignUpForm.Notification.message),
        description: (
          <p>{t(translations.AuthBadge.SignUpForm.Notification.description)}</p>
        ),
        duration: 10,
      });
      form.resetFields();
    }
  }, [signUpData]);

  // To disable submit button at the beginning.
  const [, forceUpdate] = useState({});
  useEffect(() => {
    dispatch(signUpActions.reset());
    forceUpdate({});
  }, []);

  return (
    <Form
      form={form}
      name="normal_sign_up"
      className="sign-up-form"
      onFinish={onSubmit}
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
            pattern: EMAIL_REGEX,
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
            loading={isSignUpLoading}
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

import { blue } from '@ant-design/colors';
import {
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Alert, Button, Form, notification, Typography } from 'antd';
import { authApi } from 'app/api/auth';
import { RegisterUserRequest } from 'app/api/auth/types/registerUser';
import { EMAIL_REGEX } from 'app/utils/constants';
import { translations } from 'locales/translations';
import { FieldData } from 'rc-field-form/es/interface';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type SignUpModalFormProps = {
  textButton?: boolean;
};

export default function SingUpModalForm(props: SignUpModalFormProps) {
  const { textButton } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const navigate = useNavigate();

  const [triggerSignUp] = authApi.useSignUpMutation();
  const [triggerIsUniqueEmail] = authApi.useLazyIsUniqueEmailQuery();

  const checkEmail = async (emailField: FieldData) => {
    if (
      !emailField?.touched ||
      emailField?.value?.length < 5 ||
      (emailField.errors && emailField.errors.length > 0) ||
      !EMAIL_REGEX.test(emailField.value)
    ) {
      return;
    }

    form.setFields([
      {
        name: 'email',
        validating: true,
      },
    ]);

    const result = await triggerIsUniqueEmail(emailField.value).unwrap();

    form.setFields([
      {
        name: 'email',
        validating: false,
        errors:
          result.isSuccess === false
            ? [t(translations.AuthBadge.SignUpForm.validationEmailNotUnique)]
            : undefined,
      },
    ]);
  };

  const checkPasswords = (
    passwordField?: FieldData,
    confirmPasswordField?: FieldData,
  ) => {
    if (passwordField?.value !== confirmPasswordField?.value) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [
            t(translations.AuthBadge.SignUpForm.validationPasswordDontMatch),
          ],
        },
      ]);
      return;
    }

    form.setFields([
      {
        name: 'confirmPassword',
        errors: [],
      },
    ]);
  };

  const fieldsChanged = async (
    changedFields: FieldData[],
    allFields: FieldData[],
  ) => {
    if (changedFields.some(field => field.name.toString() === 'email')) {
      const emailField = allFields.find(
        field => field.name.toString() === 'email',
      );
      await checkEmail(emailField!);
    }

    if (
      changedFields.some(
        field =>
          field.name.toString() === 'password' ||
          field.name.toString() === 'confirmPassword',
      )
    ) {
      const passwordField = allFields.find(
        field => field.name.toString() === 'password',
      );
      const confirmPasswordField = allFields.find(
        field => field.name.toString() === 'confirmPassword',
      );
      checkPasswords(passwordField, confirmPasswordField);
    }

    const anyFieldNotTouched = !form.isFieldsTouched(true);
    const anyFieldInvalid = form
      .getFieldsError(['email', 'username', 'password', 'confirmPassword'])
      .some(field => field.errors.some(error => true));

    setSubmitDisabled(anyFieldInvalid || anyFieldNotTouched);
  };

  const onSubmit = async (values: RegisterUserRequest) => {
    const result = await triggerSignUp(values).unwrap();

    if (result.isSuccess) {
      notification['success']({
        message: t(translations.SignUpModalForm.SuccessNotification.message),
        description: (
          <p>
            {t(translations.SignUpModalForm.SuccessNotification.description)}
          </p>
        ),
        duration: 5,
      });
      return true;
    }
    return false;
  };

  return (
    <ModalForm<RegisterUserRequest>
      form={form}
      title={t(translations.SignUpModalForm.title)}
      modalProps={{
        okText: t(translations.SignUpModalForm.signUpButton),
        cancelText: t(translations.cancel),
        width: '400px',
        destroyOnClose: true,
        afterClose: () => setSubmitDisabled(true),
      }}
      trigger={
        textButton ? (
          <Button type="primary" size="large" icon={<UserAddOutlined />}>
            Sign Up
          </Button>
        ) : (
          <UserAddOutlined style={{ fontSize: '20px', color: blue.primary }} />
        )
      }
      submitter={{
        submitButtonProps: {
          disabled: submitDisabled,
        },
      }}
      onFieldsChange={fieldsChanged}
      onFinish={onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          width="lg"
          name="email"
          fieldProps={{
            prefix: <MailOutlined />,
          }}
          placeholder={t(translations.SignUpModalForm.email)}
          hasFeedback
          rules={[
            {
              required: true,
              message: t(translations.SignUpModalForm.validationEmailRequired),
            },
            {
              type: 'email',
              message: t(translations.SignUpModalForm.validationInvalidEmail),
            },
          ]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText
          width="lg"
          name="username"
          fieldProps={{
            prefix: <UserOutlined />,
          }}
          placeholder={t(translations.SignUpModalForm.username)}
          rules={[
            {
              required: true,
              message: t(
                translations.SignUpModalForm.validationUsernameRequired,
              ),
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
          placeholder={t(translations.SignUpModalForm.password)}
          rules={[
            {
              required: true,
              message: t(
                translations.SignUpModalForm.validationPasswordRequired,
              ),
            },
          ]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText.Password
          width="lg"
          name="confirmPassword"
          fieldProps={{
            prefix: <LockOutlined />,
          }}
          placeholder={t(translations.SignUpModalForm.password)}
          rules={[
            {
              required: true,
              message: t(
                translations.SignUpModalForm.validationPasswordDontMatch,
              ),
            },
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
}

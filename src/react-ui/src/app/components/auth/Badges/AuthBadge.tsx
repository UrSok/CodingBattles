import React, { useEffect, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { SignInForm, SignUpForm } from '../Forms';
import { useSelector } from 'react-redux';
import { selectSignUp } from '../Forms/SignUpForm/slice/selectors';

export default function AuthBadge(props) {
  const { t } = useTranslation();
  const [signInVisible, setSignInVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);

  const { signUpResult } = useSelector(selectSignUp);

  const showSignInModal = () => {
    setSignInVisible(true);
  };

  const showSignUpModal = () => {
    setSignUpVisible(true);
  };

  const handleCancel = () => {
    if (signInVisible) {
      setSignInVisible(false);
    }
    if (signUpVisible) {
      setSignUpVisible(false);
    }
  };

  useEffect(() => {
    setSignUpVisible(false);
  }, [signUpResult]);

  return (
    <>
      <Space>
        <Button type="primary" onClick={showSignUpModal}>
          {t(translations.AuthBadge.signUpButton)}
        </Button>
        <Button
          type="default"
          icon={<LoginOutlined />}
          onClick={showSignInModal}
        />
      </Space>
      <Modal
        title={t(translations.AuthBadge.SignInForm.tile)}
        okText={t(translations.ok)}
        cancelText={t(translations.cancel)}
        visible={signInVisible}
        onCancel={handleCancel}
        centered
        width={400}
        footer={null}
        destroyOnClose
        {...props}
      >
        <SignInForm />
      </Modal>
      <Modal
        title={t(translations.AuthBadge.SignUpForm.tile)}
        okText={t(translations.ok)}
        cancelText={t(translations.cancel)}
        visible={signUpVisible}
        onCancel={handleCancel}
        centered
        width={400}
        footer={null}
        destroyOnClose
        {...props}
      >
        <SignUpForm />
      </Modal>
    </>
  );
}

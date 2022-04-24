import { Button, Modal, Space } from 'antd';
import React, { useState } from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export default function NotAuthBadge(props) {
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const { t } = useTranslation();

  const showSignUpModal = () => {
    setSignUpVisible(true);
  };

  const showSignInModal = () => {
    setSignInVisible(true);
  };

  const handleCancel = () => {
    if (signInVisible) {
      setSignInVisible(false);
    }
    if (signUpVisible) {
      setSignUpVisible(false);
    }
  };

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
        title={t(translations.AuthBadge.SignUpForm.title)}
        visible={signUpVisible}
        onCancel={handleCancel}
        centered
        width={400}
        footer={null}
        destroyOnClose
        {...props}
      >
        <p>Sign Up</p>
      </Modal>
      <Modal
        title={t(translations.AuthBadge.SignInForm.title)}
        visible={signInVisible}
        onCancel={handleCancel}
        centered
        width={400}
        footer={null}
        destroyOnClose
        {...props}
      >
        <p>Sign In</p>
      </Modal>
    </>
  );
}

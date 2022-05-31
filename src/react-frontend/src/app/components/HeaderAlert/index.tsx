import { Alert, Button, message, notification } from 'antd';
import { authApi } from 'app/api';
import { Role } from 'app/types/enums/role';
import { UserDto } from 'app/types/models/user/userDto';
import { translations } from 'locales/translations';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StickedToHeaderAlert = styled.div`
  margin: 0 -24px;
  margin-top: -24px;
`;

/*const ShowRolesAlertsIfNeeded = () => {

  if (user.role === Role.UnverifiedMember) {
    return (
      <Alert
        message={t(translations.Alerts.UnverifiedMember.message)}
        banner
        closable
        action={
          <Button size="small" type="primary">
            {t(translations.Alerts.UnverifiedMember.resendButton)}
          </Button>
        }
      />
    );
  } else if (user.role === Role.Guest) {
    return (
      <Alert
        message={t(translations.Alerts.Guest.message)}
        banner
        closable
        action={
          <Button size="small" type="primary">
            {t(translations.Alerts.Guest.claimButton)}
          </Button>
        }
      />
    );
  }

  return null;
};*/

type HeaderAlertProps = {
  user?: UserDto;
};

export default function HeaderAlert(props: HeaderAlertProps) {
  const { t } = useTranslation();
  const { user } = props;

  let alert: React.ReactNode;
  
  const [triggerResend] = authApi.useResendActivationCodeMutation();

  const handleOnResendClick = async () => {
    if (!user) return;
    await triggerResend(user.id);

    notification['success']({
      message: 'The email was sent!',
      description: 'Please check your inbox',
      duration: 10,
    });
  }

  if (user?.role === Role.UnverifiedMember) {
    alert = (
      <Alert
        message={t(translations.Alerts.UnverifiedMember.message)}
        banner
        closable
        action={
          <Button size="small" type="primary" onClick={handleOnResendClick}>
            {t(translations.Alerts.UnverifiedMember.resendButton)}
          </Button>
        }
      />
    );
  } else if (user?.role === Role.Guest) {
    alert = (
      <Alert
        message={t(translations.Alerts.Guest.message)}
        banner
        closable
        action={
          <Button size="small" type="primary">
            {t(translations.Alerts.Guest.claimButton)}
          </Button>
        }
      />
    );
  }

  return alert ? <StickedToHeaderAlert>{alert}</StickedToHeaderAlert> : null;
}

import { Alert, Button } from 'antd';
import { Role } from 'app/api/types/auth';
import { selectAuth } from 'app/slices/auth/selectors';
import { translations } from 'locales/translations';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const StickedToHeaderAlert = styled.div`
  margin: 0 -24px;
  margin-top: -24px;
`;

const ShowRolesAlertsIfNeeded = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector(selectAuth);

  if (!isAuthenticated || !user) return null;

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
};

export default function HeaderAlerts() {
  return (
    <>
      <StickedToHeaderAlert>
        <ShowRolesAlertsIfNeeded />
      </StickedToHeaderAlert>
    </>
  );
}

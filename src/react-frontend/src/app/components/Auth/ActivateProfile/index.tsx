import { message, notification } from 'antd';
import { authApi } from 'app/api';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { PATH_PAGE } from 'app/routes/paths';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

export default function AcivateProfile() {
  const { userId, code } = useParams();
  const [triggerActivate, { data }] = authApi.useActivateUserMutation();

  const navigate = useNavigate();

  useEffectOnce(() => {
    if (!userId || !code) {
      navigate('/', { replace: true });
      console.log(userId)

      return;
    }

    triggerActivate({
      userId,
      verificationCode: code,
    });
  });

  useUpdateEffect(() => {
    if (data?.isSuccess) {
      notification['success']({
        message: 'The account was activated!',
        description: 'Please reauthenticate for the changes to take effect.',
        duration: 10,
      });
    } else {
      notification['error']({
        message: 'An error ocurred!',
        description: 'Make sure the link is correct.',
        duration: 10,
      });
    }

    navigate('/', { state: {}, replace: true });
  }, [data]);

  return <LoadingSpinner centered />;
}

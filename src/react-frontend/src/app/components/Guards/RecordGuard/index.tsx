import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectUser } from 'app/slices/auth/selectors';
import { Button, Result } from 'antd';
import ErrorResult from 'app/components/ErrorResult';

type RecordGuardProps = {
  createdByUserId?: string;
  children: React.ReactNode;
};

export default function RecordGuard(props: RecordGuardProps) {
  const { createdByUserId, children } = props;

  const user = useSelector(selectUser);

  if (createdByUserId && user?.id !== createdByUserId) {
    return (
      <ErrorResult
        status="403"
        title="Cannot edit foreign record!"
        subTitle="You can only edit your records."
      />
    );
  }

  return <>{children}</>;
}

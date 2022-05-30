import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from 'app/slices/auth/selectors';
import ErrorResult from 'app/components/ErrorResult';

type RecordGuardProps = {
  found?: any;
  createdByUserId?: string;
  children: React.ReactNode;
};

export default function RecordGuard(props: RecordGuardProps) {
  const { found, createdByUserId, children } = props;
  const user = useSelector(selectUser);

  if (!found) {
    return <ErrorResult status="404" title="Record not found" />;
  }

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

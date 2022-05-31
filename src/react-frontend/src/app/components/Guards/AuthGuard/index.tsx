import ErrorResult from 'app/components/ErrorResult';
import { selectAuth } from 'app/slices/auth/selectors';
import { Role } from 'app/types/enums/role';
import React from 'react';
import { useSelector } from 'react-redux';

type AuthGuardProps = {
  memberRoleNeeded?: boolean;
  children: React.ReactNode;
};

export default function AuthGuard(props: AuthGuardProps) {
  const { memberRoleNeeded, children } = props;

  const { isAuthenticated, user } = useSelector(selectAuth);

  if (!isAuthenticated) {
    return (
      <ErrorResult
        title="This page is available only for authenticated users!"
        subTitle="Use the buttons from the side menu to Sign Up/Sign In."
        status="403"
      />
    );
  }

  if (
    memberRoleNeeded &&
    user?.role !== Role.Member &&
    user?.role !== Role.Admin
  ) {
    return (
      <ErrorResult
        title="This page is available for verified users!"
        subTitle="Use the Header Alert buttons to verify your account."
        status="403"
      />
    );
  }

  return <>{children}</>;
}

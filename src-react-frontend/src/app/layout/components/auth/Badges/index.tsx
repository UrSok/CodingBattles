import { selectAuth } from 'app/auth/selectors';
import * as React from 'react';
import { useSelector } from 'react-redux';
import NotAuthBadge from './NotAuthBadge';
import ProfileBadge from './ProfileBadge';

export default function AuthBadges() {
  const { isAuthenticated } = useSelector(selectAuth);

  if (isAuthenticated) return <ProfileBadge />;

  return <NotAuthBadge />;
}

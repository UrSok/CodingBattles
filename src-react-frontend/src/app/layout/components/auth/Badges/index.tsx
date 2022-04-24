import * as React from 'react';
import NotAuthBadge from './NotAuthBadge';
import ProfileBadge from './ProfileBadge';

export default function AuthBadges() {
  const isAuthenticated: boolean = true;

  if (isAuthenticated) return <ProfileBadge />;

  return <NotAuthBadge />;
}

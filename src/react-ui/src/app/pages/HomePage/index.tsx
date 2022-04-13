import { selectAuth } from 'app/slices/auth/selectors';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

export function HomePage() {
  const { isAuthenticated, user  } = useSelector(selectAuth)

  return (
    <>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="" />
      </Helmet>
      {isAuthenticated ? (
        <span>Hello, {user?.username}</span>
      ) : (
        <span>Not authenticated</span>
      )}
    </>
  );
}

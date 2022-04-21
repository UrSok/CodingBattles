import { PageLoading } from '@ant-design/pro-layout';
import React from 'react';
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

const Loadable = Component => props => {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component {...props} />
    </Suspense>
  );
};

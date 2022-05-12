import React, { useEffect } from 'react';

import Page from 'app/components/Layout/Page';
import { Guard } from 'app/components/Guards';
import { useParams } from 'react-router-dom';
import { challengeApi } from 'app/api/challenge';
import ErrorResult, { ErrorResult500 } from 'app/components/ErrorResult';
import TheForm from './components/TheForm';

import { ApiException } from 'app/api/config/axios';
import { ErrorCode } from 'app/api/types';
import { skipToken } from '@reduxjs/toolkit/dist/query';

export default function Save() {
  const { id: paramId } = useParams();

  const { isLoading, data, error } = challengeApi.useGetChallengeQuery(
    paramId ?? skipToken,
  );

  let pageContent: React.ReactNode = '';

  if (!paramId) {
    pageContent = <TheForm />;
  } else if (data && data.value && data.isSuccess) {
    pageContent = (
      <Guard.Mine createdById={data.value.user.id}>
        <TheForm challenge={data.value} />
      </Guard.Mine>
    );
  } else if (
    !isLoading &&
    !data?.isSuccess &&
    data?.errors?.some(x => x.name === ErrorCode.ChallengeNotFound)
  ) {
    pageContent = <ErrorResult status="404" title="Challenge not found" />;
  } else if (error === ApiException.Status500) {
    pageContent = ErrorResult500;
  }

  return (
    <Page ghost loading={isLoading}>
      {pageContent}
    </Page>
  );
}

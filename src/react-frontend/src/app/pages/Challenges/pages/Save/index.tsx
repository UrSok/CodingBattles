import { skipToken } from '@reduxjs/toolkit/dist/query';
import { challengeApi } from 'app/api/challenge';
import ErrorResult, { ErrorResult500 } from 'app/components/ErrorResult';
import { Guard } from 'app/components/Guards';
import Page from 'app/components/Page';
import { ApiException } from 'app/config/api/axios';
import { selectUser } from 'app/slices/auth/selectors';
import { ErrorCode } from 'app/types/enums/errorCode';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TheForm from './components/TheForm';

export default function Save() {
  const { id: paramId } = useParams();

  const { isLoading, data } = challengeApi.useGetChallengeQuery(
    paramId ?? skipToken,
  );

  return (
    <Page ghost loading={isLoading}>
      <Guard.Record
        createdByUserId={data?.value?.user.id}
        found={paramId ? data?.value : true}
      >
        <TheForm challenge={data?.value} />
      </Guard.Record>
    </Page>
  );
}

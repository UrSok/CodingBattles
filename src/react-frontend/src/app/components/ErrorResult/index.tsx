import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type ErrorResultProps = {
  status: '404' | '403' | '500';
  title?: string;
  subTitle?: string;
  noExtra?: boolean;
};

export default function ErrorResult(props: ErrorResultProps) {
  const { status, title, subTitle, noExtra } = props;

  const navigate = useNavigate();

  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={
        !noExtra ? (
          <Button type="primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
        ) : (
          ''
        )
      }
    />
  );
}

export const ErrorResult500 = (
  <ErrorResult
    status="500"
    title="Internal Server Error"
    subTitle="An unexcepted error happened, we'll fix it someday!"
  />
);

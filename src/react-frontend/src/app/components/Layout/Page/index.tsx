import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { CardProps } from 'antd';
import LoadingSpinner from 'app/components/LoadingSpinner';
import React from 'react';

type PageProps = {
  ghost?: boolean;
  title?: string;
  loading?: boolean;
  children: React.ReactNode;
};

export default function Page(props: PageProps) {
  const { title, ghost, children, loading } = props;

  return (
    <PageContainer
      ghost={ghost}
      loading={loading ? <LoadingSpinner centered /> : false}
      header={{
        title: title,
      }}
    >
      {children}
    </PageContainer>
  );
}

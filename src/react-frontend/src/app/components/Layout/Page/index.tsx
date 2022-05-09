import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { CardProps } from 'antd';
import LoadingSpinner from 'app/components/LoadingSpinner';
import React from 'react';

type PageProps = {
  ghost?: boolean;
  title?: string;
  loading?: boolean;
  extra?: React.ReactNode;
  footer?: React.ReactNode[];
  children: React.ReactNode;
};

export default function Page(props: PageProps) {
  const { title, ghost, loading, extra, footer, children } = props;

  return (
    <PageContainer
      ghost={ghost}
      loading={loading ? <LoadingSpinner centered /> : false}
      header={{
        title: title,
      }}
      footer={footer}
      extra={extra}
    >
      {children}
    </PageContainer>
  );
}

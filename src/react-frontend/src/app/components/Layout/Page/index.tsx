import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { PageHeaderTabConfig } from '@ant-design/pro-layout/lib/components/PageContainer';
import { CardProps, PageHeaderProps } from 'antd';
import LoadingSpinner from 'app/components/LoadingSpinner';
import React from 'react';

type PageProps = {
  ghost?: boolean;
  title?: React.ReactNode;
  loading?: boolean;
  tabConfig?: PageHeaderTabConfig;
  headerStyle?: React.CSSProperties;
  extra?: React.ReactNode;
  subTitle?: React.ReactNode;
  footer?: React.ReactNode[];
  children: React.ReactNode;
};

export default function Page(props: PageProps) {
  const {
    title,
    ghost,
    loading,
    tabConfig,
    headerStyle,
    extra,
    subTitle,
    footer,
    children,
  } = props;

  return (
    <PageContainer
      ghost={ghost}
      loading={loading ? <LoadingSpinner centered /> : false}
      header={{
        title: title,
        style: headerStyle,
      }}
      footer={footer}
      extra={extra}
      subTitle={subTitle}
      {...tabConfig}
    >
      {children}
    </PageContainer>
  );
}

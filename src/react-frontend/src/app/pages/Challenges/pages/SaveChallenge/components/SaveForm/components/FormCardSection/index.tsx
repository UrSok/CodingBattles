import React from 'react';
import Title from 'antd/lib/typography/Title';
import ProCard from '@ant-design/pro-card';

type FormSectionProps = {
  title?: string;
  ghost?: boolean;
  children: React.ReactNode;
};

export default function FormSection(props: FormSectionProps) {
  const { title, ghost, children } = props;

  const titleNode = title ? (
    <Title level={4} style={{ margin: 0 }}>
      {title}
    </Title>
  ) : null;

  return (
    <ProCard ghost title={titleNode}>
      <ProCard ghost={ghost}>{children}</ProCard>
    </ProCard>
  );
}

import React from 'react';
import Title from 'antd/lib/typography/Title';
import ProCard from '@ant-design/pro-card';
import { Breakpoint, ColSpanType } from '@ant-design/pro-card/lib/type';

type CardSectionProps = {
  title?: string;
  ghost?: boolean;
  colSpan?: ColSpanType | Partial<Record<Breakpoint, ColSpanType>>;
  children: React.ReactNode;
};

export default function  CardSection(props: CardSectionProps) {
  const { title, ghost, colSpan, children } = props;

  const titleNode = title ? (
    <Title level={4} style={{ margin: 0 }}>
      {title}
    </Title>
  ) : null;

  return (
    <ProCard ghost title={titleNode} colSpan={colSpan}>
      <ProCard ghost={ghost}>{children}</ProCard>
    </ProCard>
  );
}

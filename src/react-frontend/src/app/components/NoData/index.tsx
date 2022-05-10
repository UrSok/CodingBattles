import { Space, Typography } from 'antd';
import React from 'react';
import EmoticonSad from '@2fd/ant-design-icons/lib/EmoticonSad';

type NoDataProps = {
  text?: string;
};

export default function NoData(props: NoDataProps) {
  const { text } = props;

  return (
    <Space direction="vertical" size={0}>
      <EmoticonSad
        style={{
          fontSize: '30px',
        }}
      />
      <Typography.Text>{text ?? 'No Data'}</Typography.Text>
    </Space>
  );
}

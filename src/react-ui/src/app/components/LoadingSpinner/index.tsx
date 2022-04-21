import React from 'react';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const alternativeIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

export default function LoadingSpinner() {
  return (
    <Space>
      <Spin
        tip="Loading, probably.."
        indicator={alternativeIcon}
        style={{ color: 'red' }}
      />
    </Space>
  );
}

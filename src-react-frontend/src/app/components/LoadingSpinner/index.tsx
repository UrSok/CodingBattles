import React from 'react';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function LoadingSpinner() {
  return (
    <Space>
      <Spin
        tip="Loading, probably.."
        indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
      />
    </Space>
  );
}

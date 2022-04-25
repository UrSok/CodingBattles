import React from 'react';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export default function LoadingSpinner() {
  const { t } = useTranslation();
  return (
    <Space>
      <Spin
        tip={t(translations.loadingProbably)}
        indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
      />
    </Space>
  );
}

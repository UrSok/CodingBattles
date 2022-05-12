import React from 'react';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import styled from 'styled-components';

const Centered = styled.div`
  height: 90vh;
  display: flex;
  justify-content: center;
  align-content: center;
`;

type LoadingSpinnerProps = {
  centered?: boolean;
  size?: 'tiny';
  noTip?: boolean;
};

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  const { centered, size, noTip } = props;
  const { t } = useTranslation();

  let fontSize = 30;

  if (size === 'tiny') {
    fontSize = 10;
  }

  const spinner = (
    <Space>
      <Spin
        tip={!noTip ? t(translations.loadingProbably) : ''}
        indicator={<LoadingOutlined style={{ fontSize: fontSize }} spin />}
      />
    </Space>
  );

  if (centered) {
    return <Centered>{spinner}</Centered>;
  }

  return spinner;
}

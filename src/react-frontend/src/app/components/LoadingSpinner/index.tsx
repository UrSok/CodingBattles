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

const HorizontallyCentered = styled.div`
  display: flex;
  justify-content: center;
`;

type LoadingSpinnerProps = {
  horizontallyCentered?: boolean;
  centered?: boolean;
  size?: 'tiny';
  noTip?: boolean;
};

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  const { horizontallyCentered, centered, size, noTip } = props;
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

  if (horizontallyCentered) {
    return <HorizontallyCentered>{spinner}</HorizontallyCentered>;
  }

  if (centered) {
    return <Centered>{spinner}</Centered>;
  }

  return spinner;
}

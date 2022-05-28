import React from 'react';
import { ProFormSelect } from '@ant-design/pro-form';

import { Language } from 'app/types/enums/language';
import { getLanguageKeyName } from 'app/utils/enumHelpers';

type LanguageSelectProps = {
  antdFieldName: string;
  placeholder?: string;
  disabled?: boolean;
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg';
  defaultLanguage: Language;
  style?: React.CSSProperties;
};

export default function LanguageSelect(props: LanguageSelectProps) {
  const {
    antdFieldName,
    placeholder,
    disabled,
    width,
    defaultLanguage,
    style,
  } = props;

  return (
    <ProFormSelect
      name={antdFieldName}
      placeholder={placeholder}
      disabled={disabled}
      width={width}
      allowClear={false}
      initialValue={getLanguageKeyName(defaultLanguage)}
      valueEnum={Language}
      formItemProps={{
        style: {
          marginBottom: '0',
        },
      }}
      style={style}
    />
  );
}

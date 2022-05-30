import React from 'react';
import { ProFormSelect } from '@ant-design/pro-form';

import { Language } from 'app/types/enums/language';
import { getLanguageKeyName } from 'app/utils/enumHelpers';

type LanguageSelectProps = {
  antdFieldName: string;
  label?: string;
  multi?: boolean;
  placeholder?: string;
  disabled?: boolean;
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg';
  defaultLanguage?: Language;
  style?: React.CSSProperties;
};

export default function LanguageSelect(props: LanguageSelectProps) {
  const {
    multi,
    label,
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
      label={label}
      mode={multi ? 'multiple' : 'single'}
      placeholder={placeholder}
      disabled={disabled}
      width={width}
      allowClear={false}
      initialValue={
        defaultLanguage ? getLanguageKeyName(defaultLanguage) : undefined
      }
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

import { ProFormSelect } from '@ant-design/pro-form';
import { FormInstance, Select } from 'antd';
import { challengeTagApi } from 'app/api/challengeTag';
import { ChallengeTag } from 'app/api/types/challenge';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';

type MultiTagSelectProp = {
  name: string;
}

export default function MultiTagSelect(props: MultiTagSelectProp) {
  const { data: challengeTags, isLoading: isLoadingTags } =
    challengeTagApi.useGetTagsQuery();
  const { t } = useTranslation();

  return (
    <ProFormSelect
      name={props.name}
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={t(translations.Challenges.Search.Form.tags)}
      fieldProps={{
        loading: isLoadingTags,
      }}
      allowClear
      options={challengeTags?.value?.map((tag: ChallengeTag) => ({
        value: tag.id,
        label: tag.name,
      }))}
    />
  );
}

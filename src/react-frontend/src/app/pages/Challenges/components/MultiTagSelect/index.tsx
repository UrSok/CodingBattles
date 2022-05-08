import React from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';

import { ChallengeTag } from 'app/api/types/challenge';
import { challengeTagApi } from 'app/api/challengeTag';

type MultiTagSelectProps = {
  name: string;
};

export default function MultiTagSelect(props: MultiTagSelectProps) {
  const { t } = useTranslation();

  const { data: challengeTags, isLoading: isLoadingTags } =
    challengeTagApi.useGetTagsQuery();

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

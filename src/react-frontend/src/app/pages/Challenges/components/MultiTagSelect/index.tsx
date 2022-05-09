import React from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';

import { ChallengeTag } from 'app/api/types/challenge';
import { challengeTagApi } from 'app/api/challengeTag';
import { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import { DefaultOptionType } from 'antd/lib/select';
import { RequestOptionsType } from '@ant-design/pro-utils';

type MultiTagSelectProps = {
  name: string;
  loading?: boolean;
  readOnly?: boolean;
  tags?: ChallengeTag[];
};

export default function MultiTagSelect(props: MultiTagSelectProps) {
  const { name, loading: loadingOutsideTags, readOnly, tags } = props;

  const { t } = useTranslation();

  const [triggerGetTags] = challengeTagApi.useLazyGetTagsQuery();

  const commonProps: ProFormSelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    placeholder: t(translations.Challenges.Search.Form.tags),
    allowClear: true,
    readonly: readOnly,
  };

  const mapTags = (
    challengeTags: ChallengeTag[] | undefined,
  ): DefaultOptionType[] | undefined => {
    if (!challengeTags) return;

    return challengeTags.map(
      (tag: ChallengeTag): DefaultOptionType => ({
        value: tag.id,
        label: tag.name,
      }),
    );
  };

  if (loadingOutsideTags || tags) {
    return (
      <ProFormSelect
        {...commonProps}
        name={name}
        fieldProps={{
          loading: loadingOutsideTags,
        }}
        options={mapTags(tags)}
      />
    );
  }

  return (
    <ProFormSelect
      {...commonProps}
      name={name}
      request={async () => {
        const result = await triggerGetTags().unwrap();

        return mapTags(result?.value) as RequestOptionsType[];
      }}
    />
  );
}

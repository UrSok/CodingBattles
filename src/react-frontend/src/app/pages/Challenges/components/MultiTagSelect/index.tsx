import { ProFormSelect } from '@ant-design/pro-form';
import { DefaultOptionType } from 'antd/lib/select';
import { challengeTagApi } from 'app/api/challengeTag';
import NoData from 'app/components/NoData';
import { ChallengeTag } from 'app/types/models/challenge/challengeTag';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';

type MultiTagSelectProps = {
  name: string;
  readOnly?: boolean;
  requiredRule?: boolean;
};

export default function MultiTagSelect(props: MultiTagSelectProps) {
  const { name, readOnly, requiredRule } = props;

  const { t } = useTranslation();

  const { isLoading, data } = challengeTagApi.useGetTagsQuery();

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

  return (
    <ProFormSelect<ChallengeTag>
      name={name}
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={t(translations.Challenges.Search.Form.tags)}
      allowClear={true}
      readonly={readOnly}
      proFieldProps={{
        emptyText: <NoData />,
      }}
      rules={
        requiredRule
          ? [
              {
                required: true,
                message: 'Tags are required',
              },
            ]
          : []
      }
      fieldProps={{
        loading: isLoading,
        showArrow: true,
      }}
      options={mapTags(data?.value)}
      showSearch
    />
  );
};

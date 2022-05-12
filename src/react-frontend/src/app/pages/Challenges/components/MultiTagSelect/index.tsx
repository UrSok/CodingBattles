import React from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';

import { ChallengeTag } from 'app/api/types/challenge';
import { challengeTagApi } from 'app/api/challengeTag';
import { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import { DefaultOptionType } from 'antd/lib/select';
import NoData from 'app/components/NoData';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { Form } from 'antd';

type MultiTagSelectProps = {
  name: string;
  loading?: boolean;
  readOnly?: boolean;
  requiredRule?: boolean;
  tags?: ChallengeTag[];
};

export default function MultiTagSelect(props: MultiTagSelectProps) {
  const {
    name,
    loading: loadingOutsideTags,
    readOnly,
    requiredRule,
    tags,
  } = props;

  const { t } = useTranslation();

  const { isLoading, data } = challengeTagApi.useGetTagsQuery(
    !tags ? undefined : skipToken,
  );

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

  if (!tags && !data?.value) {
    return (
      <Form.Item>
        <LoadingSpinner size="tiny" noTip />
      </Form.Item>
    );
  }

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
        loading: loadingOutsideTags || isLoading,
        showArrow: true,
      }}
      options={mapTags(tags || data?.value)}
      showSearch
    />
  );
}

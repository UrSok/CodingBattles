import * as React from 'react';
import { challengeApi } from 'app/api/challenge';
import { challengeTagApi } from 'app/api/challengeTag';
import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Rate,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import {
  ChallengeSearchRequest,
  ChallengeSearchResultItem,
  ChallengeTag,
  SortBy,
} from 'app/api/types/challenge';

import { useSelector } from 'react-redux';
import { selectAuth } from 'app/slices/auth/selectors';
import { Role } from 'app/api/types/auth';
import { useWatch } from 'antd/lib/form/Form';
import ProForm, {
  ProFormCheckbox,
  ProFormRate,
  ProFormSelect,
  ProFormSlider,
} from '@ant-design/pro-form';
import { useNavigate } from 'react-router-dom';
import { PATH_CHALLENGES } from 'app/routes/paths';
import MultiTagSelect from '../../components/MultiTagSelect';
import Page from 'app/components/Layout/Page';
import { ChallengeSearchFields } from './types';
import { OrderStyle } from 'app/api/types';
import { EditFilled, PlusOutlined } from '@ant-design/icons';

export default function ChallengeSearch() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { data: challengeTags, isLoading: isLoadingTags } =
    challengeTagApi.useGetTagsQuery();

  const [
    triggerGetChallenges,
    { data: challenges, isLoading: isLoadingChallenges },
  ] = challengeApi.useLazyGetChallengesQuery();

  const { user, isAuthenticated } = useSelector(selectAuth);

  const [difficultyRange, setDifficultyRange] = useState([1, 5]);

  const search: string = useWatch(ChallengeSearchFields.searchText, form);
  const sortBy: SortBy = useWatch(ChallengeSearchFields.sortBy, form);
  const sortOrder: OrderStyle = useWatch(ChallengeSearchFields.sortOrder, form);
  const tagIds: string[] = useWatch(ChallengeSearchFields.tags, form);
  const includeNoDifficulty = useWatch(
    ChallengeSearchFields.includeNoDifficulty,
    form,
  );

  useEffect(() => {
    const searchQuery: ChallengeSearchRequest = {
      text: search,
      sortBy: sortBy,
      orderStyle: sortOrder,
      tagIds: tagIds,
      includeNoDifficulty: includeNoDifficulty,
    };

    if (difficultyRange !== undefined) {
      searchQuery.minimumDifficulty = difficultyRange[0];
      searchQuery.maximumDifficulty = difficultyRange[1];
    } else {
      searchQuery.minimumDifficulty = 0;
      searchQuery.maximumDifficulty = 5;
    }

    triggerGetChallenges(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortBy, sortOrder, tagIds, includeNoDifficulty, difficultyRange]);

  const difficultySliderChanged = (values: [number, number]) => {
    setDifficultyRange(values);
  };

  return (
    <Page ghost>
      <ProCard ghost gutter={16}>
        <ProCard colSpan="30%" ghost>
          <ProForm
            layout="vertical"
            form={form}
            initialValues={{
              [`${ChallengeSearchFields.searchText}`]: undefined,
              [`${ChallengeSearchFields.sortBy}`]: SortBy.Name,
              [`${ChallengeSearchFields.sortOrder}`]: OrderStyle.None,
              [`${ChallengeSearchFields.tags}`]: [],
              [`${ChallengeSearchFields.difficulty}`]: [1, 5],
              [`${ChallengeSearchFields.includeNoDifficulty}`]: true,
            }}
            submitter={false}
          >
            <ProCard ghost split="horizontal" gutter={[16, 16]}>
              <ProCard title="General">
                <Form.Item name={ChallengeSearchFields.searchText}>
                  <Input.Search
                    placeholder={t(
                      translations.Challenges.Search.Form.searchInput,
                    )}
                    loading={isLoadingChallenges}
                    enterButton
                    allowClear
                  />
                </Form.Item>

                <ProFormSelect
                  name={ChallengeSearchFields.sortBy}
                  label={t(translations.Challenges.Search.Form.sortBy)}
                  placeholder={t(translations.Challenges.Search.Form.sortBy)}
                  valueEnum={SortBy}
                  allowClear={false}
                />

                <ProFormSelect
                  name={ChallengeSearchFields.sortOrder}
                  label={t(translations.Challenges.Search.Form.sortOrder)}
                  placeholder={t(translations.Challenges.Search.Form.sortOrder)}
                  options={[
                    {
                      label: 'None',
                      value: OrderStyle.None,
                    },
                    {
                      label: 'Ascend',
                      value: OrderStyle.Ascend,
                    },
                    {
                      label: 'Descend',
                      value: OrderStyle.Descend,
                    },
                  ]}
                  allowClear={false}
                />
              </ProCard>

              <ProCard title="Details">
                <MultiTagSelect
                  name={ChallengeSearchFields.tags}
                  loading={isLoadingTags}
                  tags={challengeTags?.value}
                />

                <Typography.Text>
                  {t(translations.Challenges.Search.Form.difficulty)}
                </Typography.Text>

                <ProFormSlider
                  name={ChallengeSearchFields.difficulty}
                  style={{
                    width: '100%',
                    marginBottom: 0,
                  }}
                  min={1}
                  max={5}
                  step={0.1}
                  marks={{
                    1: 1,
                    2: 2,
                    3: 3,
                    4: 4,
                    5: 5,
                  }}
                  fieldProps={{
                    range: {
                      draggableTrack: true,
                    },
                    onAfterChange: difficultySliderChanged,
                  }}
                />

                <ProFormCheckbox
                  name={ChallengeSearchFields.includeNoDifficulty}
                >
                  {t(translations.Challenges.Search.Form.includeNoDifficulty)}
                </ProFormCheckbox>
              </ProCard>
            </ProCard>
          </ProForm>
        </ProCard>

        <ProCard
          bordered
          bodyStyle={{
            padding: 15,
          }}
        >
          <Skeleton loading={isLoadingChallenges} active>
            <ProList<ChallengeSearchResultItem>
              toolBarRender={() => {
                const actions: React.ReactNode[] = [];

                if (user?.role === Role.Member || user?.role === Role.Admin) {
                  actions.push(
                    <Button
                      type="primary"
                      onClick={() => navigate(PATH_CHALLENGES.save)}
                      icon={<PlusOutlined />}
                    />,
                  );
                }

                return actions;
              }}
              ghost
              rowKey="id"
              headerTitle="Challenges"
              itemLayout="vertical"
              split
              dataSource={challenges?.value?.items}
              metas={{
                title: {
                  dataIndex: 'name',
                },
                content: {
                  dataIndex: 'descriptionShort',
                },
                subTitle: {
                  render: (_, entity) => (
                    <Space size={0} wrap>
                      {entity.tagIds?.map(tagId => {
                        const tag = challengeTags?.value?.find(
                          x => x.id === tagId,
                        );
                        if (tag) {
                          return (
                            <Tag
                              key={tagId}
                              onClick={() => {
                                const selectedTags: string[] =
                                  form.getFieldValue(
                                    ChallengeSearchFields.tags,
                                  );
                                if (selectedTags.includes(tagId))  return;

                                form.setFieldsValue({
                                  [`${ChallengeSearchFields.tags}`]: [
                                    ...selectedTags,
                                    tagId,
                                  ],
                                });
                              }}
                            >
                              {tag.name}
                            </Tag>
                          );
                        }

                        return null;
                      })}
                    </Space>
                  ),
                },
                description: {
                  render: (_, entity) => (
                    <>
                      <Typography.Text>Difficulty:</Typography.Text>{' '}
                      {entity.difficulty > 0 ? (
                        <Rate disabled value={entity.difficulty} allowHalf />
                      ) : (
                        '???'
                      )}
                    </>
                  ),
                },
                extra: {
                  render: (_, entity) => {
                    const actions: React.ReactNode[] = [];

                    if (
                      user?.role === Role.Admin ||
                      entity.createdByUserId === user?.id
                    ) {
                      actions.push(
                        <Button
                          type="dashed"
                          onClick={() =>
                            navigate(PATH_CHALLENGES.save + `/${entity.id}`)
                          }
                          icon={<EditFilled />}
                        />,
                      );
                    }

                    return actions;
                  },
                },
              }}
            />
          </Skeleton>
        </ProCard>
      </ProCard>
    </Page>
  );
}

import * as React from 'react';
import { challengeApi } from 'app/api/challenge';
import { challengeTagApi } from 'app/api/challengeTag';
import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Skeleton,
  Slider,
  Space,
  Tag,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import {
  ChallengeSearchRequest,
  ChallengeSearchResultItem,
} from 'app/api/types/challenge';

import './styles/index.less';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/auth/selectors';
import { Role } from 'app/api/types/auth';
import { useWatch } from 'antd/lib/form/Form';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import ProForm, {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormSlider,
  ProFormText,
  QueryFilter,
} from '@ant-design/pro-form';

const { Search } = Input;
const { Option } = Select;

export default function Challenges() {
  const [form] = Form.useForm();
  const { data: challengeTags, isLoading: isLoadingTags } =
    challengeTagApi.useGetTagsQuery();
  const [
    triggerGetChallenges,
    { data: challenges, isLoading: isLoadingChalleges },
  ] = challengeApi.useLazyGetChallengesQuery();

  const user = useSelector(selectUser);
  const { t } = useTranslation();

  const search: string = useWatch('search', form);
  const [difficulty, setDifficulty] = useState([1, 5]);
  const [includeNoDifficulty, setIncludeNoDifficulty] = useState(true);
  const tagIds: string[] = useWatch('tags', form);

  useEffect(() => {
    const searchQuery: ChallengeSearchRequest = {
      text: search,
      tagIds: tagIds,
      includeNoDifficulty: includeNoDifficulty,
    };

    if (difficulty !== undefined) {
      searchQuery.minimumDifficulty = difficulty[0];
      searchQuery.maximumDifficulty = difficulty[1];
    } else {
      searchQuery.minimumDifficulty = 0;
      searchQuery.maximumDifficulty = 5;
    }

    triggerGetChallenges(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, difficulty, includeNoDifficulty, tagIds]);

  return (
    <PageContainer
      ghost
      header={{
        title: '',
      }}
    >
      <ProCard ghost gutter={16}>
        <ProCard colSpan="30%" bordered>
          <ProForm
            layout="vertical"
            form={form}
            initialValues={{
              search: undefined,
              difficulty: [1, 5],
              includeNoDifficulty: true,
              tagIds: [],
            }}
            submitter={false}
          >
            <Form.Item name="search">
              <Search
                placeholder={t(translations.Challenges.Search.Form.searchInput)}
                loading={isLoadingChalleges}
                enterButton
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="sortBy"
              label={t(translations.Challenges.Search.Form.sortBy)}
            >
              <Select
                style={{ width: '100%' }}
                placeholder={t(translations.Challenges.Search.Form.sortBy)}
                defaultActiveFirstOption
                options={[
                  {
                    label: 'Name',
                    value: 'name',
                  },
                  {
                    label: 'Difficulty',
                    value: 'difficulty',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item name="tags">
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t(translations.Challenges.Search.Form.tags)}
                loading={isLoadingTags}
                allowClear
              >
                {challengeTags?.value?.map(tag => (
                  <Option key={tag.id}>{tag.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <ProForm.Item
              label={t(translations.Challenges.Search.Form.difficulty)}
              name="difficulty"
            >
              <Slider
                range={{
                  draggableTrack: true,
                }}
                min={1}
                max={5}
                step={0.1}
                defaultValue={[1, 5]}
                marks={{
                  1: 1,
                  2: 2,
                  3: 3,
                  4: 4,
                  5: 5,
                }}
                onAfterChange={(values: [number, number]) =>
                  setDifficulty(values)
                }
              />
            </ProForm.Item>
            <Form.Item>
              <Checkbox
                defaultChecked
                onChange={(e: CheckboxChangeEvent) =>
                  setIncludeNoDifficulty(!includeNoDifficulty)
                }
              >
                {t(translations.Challenges.Search.Form.includeNoDifficulty)}
              </Checkbox>
            </Form.Item>
          </ProForm>
        </ProCard>
        <ProCard
          bordered
          bodyStyle={{
            padding: 15,
          }}
        >
          <Skeleton loading={isLoadingChalleges} active>
            <ProList<any>
              toolBarRender={() => {
                const actions: React.ReactNode[] = [];

                if (user?.role === Role.Member || user?.role === Role.Admin) {
                  actions.push(
                    <Button key="3" type="primary">
                      Create
                    </Button>,
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
                  title: 'Name',
                },
                description: {
                  dataIndex: 'task',
                },
                subTitle: {
                  dataIndex: 'tags',
                  render: (_, row: ChallengeSearchResultItem) => (
                    <Space>
                      {row.tags?.map(tag => (
                        <Tag key={tag.id}>{tag.name}</Tag>
                      ))}
                    </Space>
                  ),
                },
                extra: {
                  dataIndex: 'difficulty',
                  render: (_, row: ChallengeSearchResultItem) => (
                    <Space>
                      Difficulty: {row.difficulty > 0 ? row.difficulty : '???'}
                    </Space>
                  ),
                },
                actions: {
                  render: () => [<p>c</p>, <p>c2</p>, <p>c3</p>],
                },
              }}
            />
          </Skeleton>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}

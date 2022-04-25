import * as React from 'react';
import { challengeApi } from 'app/api/challenge';
import { challengeTagApi } from 'app/api/challengeTag';
import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Row, Select, Slider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { ChallengeSearchResultItem } from 'app/api/types/challenge';

const { Search } = Input;
const { Option } = Select;

export default function Challenges() {
  const { data: challengeTags, isLoading: isLoadingTags } =
    challengeTagApi.useGetTagsQuery();
  const [
    triggerGetChallenges,
    { data: challenges, isLoading: isLoadingChalleges },
  ] = challengeApi.useGetChallengesMutation();

  const { t } = useTranslation();

  useEffect(() => {
    triggerGetChallenges({});
  }, []);

  return (
    <PageContainer
      ghost
      header={{
        title: '',
      }}
    >
      <ProCard ghost gutter={5}>
        <ProCard colSpan="30%" bordered>
          <Form layout="vertical">
            <Form.Item>
              <Search
                placeholder={t(translations.Challenges.Search.Form.searchInput)}
                loading={isLoadingChalleges}
                enterButton
                allowClear
              />
            </Form.Item>

            <Form.Item
              label={t(translations.Challenges.Search.Form.difficulty)}
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
              />
            </Form.Item>
            <Form.Item label={t(translations.Challenges.Search.Form.tags)}>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Tags Mode"
                loading={isLoadingTags}
                allowClear
              >
                {challengeTags?.value?.map(tag => (
                  <Option key={tag.id}>{tag.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </ProCard>
        <ProCard bordered>
          <ProList<any>
            toolBarRender={() => {
              return [
                <Button key="3" type="primary">
                  new
                </Button>,
              ];
            }}
            rowKey="id"
            headerTitle="Vertical Style"
            itemLayout="vertical"
            loading={isLoadingChalleges}
            //dataSource={challenges?.value?.items}
            /*renderItem={item => (
            <ProCard>{item.name}</ProCard>)
          }*/
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}

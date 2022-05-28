import * as React from 'react';
import { useState } from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import ProCard from '@ant-design/pro-card';
import { SortBy } from 'app/api/types/challenge';

import { useSelector } from 'react-redux';
import { selectAuth } from 'app/slices/auth/selectors';
import { Role } from 'app/api/types/auth';
import { useWatch } from 'antd/lib/form/Form';
import ProForm, {
  ProFormCheckbox,
  ProFormSelect,
  ProFormSlider,
} from '@ant-design/pro-form';
import { useNavigate } from 'react-router-dom';
import { PATH_CHALLENGES } from 'app/routes/paths';
import MultiTagSelect from '../../components/MultiTagSelect';
import Page from 'app/components/Layout/Page';
import { ChallengeSearchFields } from './types';
import { OrderStyle } from 'app/api/types';
import { EditFilled, ExpandAltOutlined, PlusOutlined } from '@ant-design/icons';
import ChallengeList from 'app/components/ChallengeList';

export default function SearchChallenges() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { user } = useSelector(selectAuth);

  const [difficultyRange, setDifficultyRange] = useState<[number, number]>([
    1, 5,
  ]);

  const searchText: string = useWatch(ChallengeSearchFields.searchText, form);
  const sortBy: SortBy = useWatch(ChallengeSearchFields.sortBy, form);
  const orderStyle: OrderStyle = useWatch(
    ChallengeSearchFields.orderStyle,
    form,
  );
  const tagIds: string[] = useWatch(ChallengeSearchFields.tags, form);
  const includeNoDifficulty = useWatch(
    ChallengeSearchFields.includeNoDifficulty,
    form,
  );

  const handleOnDifficultySliderChange = (values: [number, number]) => {
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
              [`${ChallengeSearchFields.orderStyle}`]: OrderStyle.None,
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
                  name={ChallengeSearchFields.orderStyle}
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
                <MultiTagSelect name={ChallengeSearchFields.tags} />

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
                    onAfterChange: handleOnDifficultySliderChange,
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
          title="Challenges"
          extra={
            (user?.role === Role.Member || user?.role === Role.Admin) && (
              <Button
                type="primary"
                onClick={() => navigate(PATH_CHALLENGES.save)}
                icon={<PlusOutlined />}
              />
            )
          }
        >
          <ChallengeList
            sortBy={sortBy}
            orderStyle={orderStyle}
            text={searchText}
            tagIds={tagIds}
            difficultyRange={difficultyRange}
            includeNoDifficulty={includeNoDifficulty}
            itemExtra={{
              render: (_, entity) => {
                const actions: React.ReactNode[] = [];

                actions.push(
                  <Button
                    type="dashed"
                    onClick={() =>
                      navigate(PATH_CHALLENGES.root + `/${entity.id}`)
                    }
                    icon={<ExpandAltOutlined />}
                  />,
                );

                if (entity.createdByUserId === user?.id) {
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

                return <Space>{actions}</Space>;
              },
            }}
            onTagClick={tagId => {
              const selectedTags: string[] = form.getFieldValue(
                ChallengeSearchFields.tags,
              );
              if (selectedTags.includes(tagId)) return;

              form.setFieldsValue({
                [`${ChallengeSearchFields.tags}`]: [...selectedTags, tagId],
              });
            }}
          />
        </ProCard>
      </ProCard>
    </Page>
  );
}

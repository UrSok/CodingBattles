import { EditFilled, ExpandAltOutlined, PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormCheckbox,
  ProFormSelect,
  ProFormSlider,
} from '@ant-design/pro-form';
import { Button, Form, Input, Space, Typography } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import ChallengeList from 'app/components/ChallengeList';
import Page from 'app/components/Page';
import { PATH_CHALLENGES } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import { OrderStyle } from 'app/types/enums/orderStyle';
import { Role } from 'app/types/enums/role';
import { SortBy } from 'app/types/enums/sortBy';
import { translations } from 'locales/translations';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import MultiTagSelect from '../../components/MultiTagSelect';
import { ChallengeSearchFields } from './types';

export default function SearchChallenges() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { user } = useSelector(selectAuth);

  const [difficultyRange, setDifficultyRange] = useState<[number, number]>([
    1, 5,
  ]);

  const searchText: string = useWatch(ChallengeSearchFields.searchText, form);
  const serchTextDebounced = useDebounce(searchText, 300);

  const sortBy: SortBy = useWatch(ChallengeSearchFields.sortBy, form);
  const orderStyle: OrderStyle = useWatch(
    ChallengeSearchFields.orderStyle,
    form,
  );
  const tagIds: string[] = useWatch(ChallengeSearchFields.tags, form);
  const tagIdsDebounced = useDebounce(tagIds, 300);

  const includeNoDifficulty = useWatch(
    ChallengeSearchFields.includeNoDifficulty,
    form,
  );

  const handleOnDifficultySliderChange = (values: [number, number]) => {
    setDifficultyRange(values);
  };

  return (
    <Page ghost>
      <ProCard ghost gutter={8}>
        <ProCard colSpan="30%" ghost>
          <ProForm
            layout="vertical"
            form={form}
            initialValues={{
              [ChallengeSearchFields.searchText]: undefined,
              [ChallengeSearchFields.sortBy]: SortBy.Name,
              [ChallengeSearchFields.orderStyle]: OrderStyle.None,
              [ChallengeSearchFields.tags]: [],
              [ChallengeSearchFields.difficulty]: [1, 5],
              [ChallengeSearchFields.includeNoDifficulty]: true,
            }}
            submitter={false}
          >
            <ProCard ghost split="horizontal" gutter={[8, 8]}>
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
            (user?.role === Role.Admin || user?.role === Role.Member) && (
              <Button
                type="primary"
                onClick={() => navigate(PATH_CHALLENGES.save)}
              >
                Create
              </Button>
            )
          }
        >
          <ChallengeList
            sortBy={sortBy}
            orderStyle={orderStyle}
            text={serchTextDebounced}
            tagIds={tagIdsDebounced}
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
                [ChallengeSearchFields.tags]: [...selectedTags, tagId],
              });
            }}
          />
        </ProCard>
      </ProCard>
    </Page>
  );
}

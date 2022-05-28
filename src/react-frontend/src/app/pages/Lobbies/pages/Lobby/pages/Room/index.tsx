import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormCheckbox,
  ProFormSelect,
  ProFormSlider,
} from '@ant-design/pro-form';
import ProList from '@ant-design/pro-list';
import {
  Button,
  Drawer,
  Form,
  Input,
  Rate,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { challengeApi, challengeTagApi, gameApi } from 'app/api';
import { OrderStyle } from 'app/api/types';
import {
  Challenge,
  ChallengeSearchResultItem,
  SortBy,
} from 'app/api/types/challenge';
import { GameDetails, GameStatus, RoundDetails } from 'app/api/types/games';
import UserAvatar from 'app/components/Auth/UserAvatar';
import ChallengeList from 'app/components/ChallengeList';
import Page from 'app/components/Layout/Page';
import NoData from 'app/components/NoData';
import ChallengePages from 'app/pages/Challenges';
import MultiTagSelect from 'app/pages/Challenges/components/MultiTagSelect';
import { ChallengeSearchFields } from 'app/pages/Challenges/pages/Index/types';
import { selectUser } from 'app/slices/auth/selectors';
import { translations } from 'locales/translations';
import React, { ReactText, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';

export type RoomProps = {
  gameInfo?: GameDetails;
  onNewRoundStarted?: (round: number) => void;
};

export default function Room(props: RoomProps) {
  const { gameInfo, onNewRoundStarted } = props;
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const [form] = useForm();

  const { id } = useParams();

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>(
    [],
  );
  const { data: dataTags } = challengeTagApi.useGetTagsQuery();
  const [
    triggerSelectChallenge,
    { isLoading: isLoadingSelectChallenge, data: selectChallengeResult },
  ] = gameApi.useSelectChallengeMutation();

  const [triggerStartRound, { data: round, isLoading: isRoundLoading }] =
    gameApi.useStartRoundMutation();

  const {
    value: drawerState,
    setValue: changeDrawerValue,
    setFalse: disableDrawer,
  } = useBoolean(false);

  const searchText = useWatch(ChallengeSearchFields.searchText, form);

  const renderTags = (_, entity) => {
    const tags = dataTags?.value?.filter(x => entity.tagIds.includes(x.id));
    return (
      <Space size={0} wrap>
        {tags?.map(tag => (
          <Tag key={tag.id}>{tag.name}</Tag>
        ))}
      </Space>
    );
  };

  const handleStartRoundClick = async () => {
    const result = await triggerStartRound({
      gameId: id!,
    }).unwrap();

    if (result && result.isSuccess && onNewRoundStarted) {
      onNewRoundStarted(result.value!);
    }
  };

  const handleOnChallengeClick = (record, index) => {
    return {
      onClick: () => {
        disableDrawer();
        triggerSelectChallenge({
          gameId: id!,
          challengeId: record.id,
        });
      },
    };
  };

  return (
    <Page
      title={gameInfo?.name}
      subTitle={
        <>
          {gameInfo?.isPrivate ? (
            <Tag color="red">Private</Tag>
          ) : (
            <Tag color="green">Public</Tag>
          )}
          {gameInfo?.code}
        </>
      }
      extra={
        <>
          {(!gameInfo?.currentRound ||
            gameInfo.status === GameStatus.NotStarted) &&
          gameInfo?.gameMasterUser.id === user?.id ? (
            <Button
              type="primary"
              disabled={
                !gameInfo?.currentRound || !gameInfo.currentRound.challenge
              }
              onClick={handleStartRoundClick}
              loading={isRoundLoading}
            >
              Start round
            </Button>
          ) : undefined}
        </>
      }
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard gutter={16} ghost>
          <ProCard title="Users">
            <Space wrap>
              {gameInfo?.users.map(user => (
                <UserAvatar
                  key={user.id}
                  userName={user.username}
                  size="large"
                />
              ))}
            </Space>
          </ProCard>
          <ProCard
            colSpan={12}
            title="Selected challenge"
            extra={
              <Button onClick={() => changeDrawerValue(!drawerState)}>
                Select challenge
              </Button>
            }
          >
            <ProList<ChallengeSearchResultItem>
              ghost
              rowKey={(entity, _) => entity.id}
              itemLayout="vertical"
              locale={{
                emptyText: <NoData />,
              }}
              dataSource={
                gameInfo?.currentRound?.challenge
                  ? [gameInfo?.currentRound?.challenge]
                  : []
              }
              metas={{
                title: {
                  dataIndex: 'name',
                },
                content: {
                  dataIndex: 'descriptionShort',
                },
                subTitle: {
                  render: renderTags,
                },
                actions: {
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
              }}
            />
          </ProCard>
        </ProCard>
        <ProCard title="Statistics" ghost>
          <ProCard>
            <ProList<RoundDetails>
              ghost
              rowKey={(entity, _) => entity.number}
              expandable={{
                expandedRowKeys,
                onExpandedRowsChange: setExpandedRowKeys,
              }}
              locale={{
                emptyText: <NoData />,
              }}
              dataSource={
                gameInfo?.currentRound
                  ? [gameInfo.currentRound, ...gameInfo.previousRounds]
                  : gameInfo?.previousRounds
              }
              metas={{
                title: {
                  dataIndex: 'number',
                },
                content: {
                  dataIndex: 'descriptionShort',
                },
              }}
            />
          </ProCard>
        </ProCard>
      </ProCard>

      <Drawer
        width={800}
        title="Choose challenge"
        placement="right"
        visible={drawerState}
        onClose={() => disableDrawer()}
      >
        <ProForm
          layout="vertical"
          form={form}
          initialValues={{
            [`${ChallengeSearchFields.searchText}`]: undefined,
          }}
          submitter={false}
        >
          <Form.Item name={ChallengeSearchFields.searchText}>
            <Input.Search
              placeholder={t(translations.Challenges.Search.Form.searchInput)}
              enterButton
              allowClear
            />
          </Form.Item>
        </ProForm>
        <ChallengeList text={searchText} onItem={handleOnChallengeClick} />
      </Drawer>
    </Page>
  );
}

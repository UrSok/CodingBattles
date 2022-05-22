import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Drawer, Rate, Space, Tag, Typography } from 'antd';
import { challengeApi, challengeTagApi, gameApi } from 'app/api';
import { Challenge, ChallengeSearchResultItem } from 'app/api/types/challenge';
import { GameDetails, GameStatus } from 'app/api/types/games';
import UserAvatar from 'app/components/Auth/UserAvatar';
import Page from 'app/components/Layout/Page';
import NoData from 'app/components/NoData';
import ChallengePages from 'app/pages/Challenges';
import { selectUser } from 'app/slices/auth/selectors';
import React, { ReactText, useState } from 'react';
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

  const { id } = useParams();

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>(
    [],
  );
  const [
    triggerSelectChallenge,
    { isLoading: isLoadingSelectChallenge, data: selectChallengeResult },
  ] = gameApi.useSelectChallengeMutation();

  const { data: dataTags } = challengeTagApi.useGetTagsQuery();
  const { data: data, isLoading: isLoadingChallenges } =
    challengeApi.useGetChallengesQuery({});
  const [triggerStartRound, { data: round, isLoading: isRoundLoading }] =
    gameApi.useStartRoundMutation();

  const {
    value: drawerState,
    setTrue: enableDrawer,
    setValue: changeDrawerValue,
    setFalse: disableDrawer,
  } = useBoolean(false);

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
            <ProList<ChallengeSearchResultItem>
              ghost
              rowKey={(entity, _) => entity.id}
              expandable={{
                expandedRowKeys,
                onExpandedRowsChange: setExpandedRowKeys,
              }}
              locale={{
                emptyText: <NoData />,
              }}
              //dataSource={selectedChallenge}
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
                        if (tagId) {
                          return <Tag key={tagId}>{tagId}</Tag>;
                        }

                        return null;
                      })}
                    </Space>
                  ),
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
      </ProCard>

      <Drawer
        width={800}
        title="Choose challenge"
        placement="right"
        visible={drawerState}
        onClose={() => disableDrawer()}
      >
        <ProList<ChallengeSearchResultItem>
          ghost
          rowKey={(entity, _) => entity.id}
          itemLayout="vertical"
          split
          onItem={(record, index) => {
            return {
              onClick: () => {
                disableDrawer();
                triggerSelectChallenge({
                  gameId: id!,
                  challengeId: record.id,
                });
              },
            };
          }}
          locale={{
            emptyText: <NoData />,
          }}
          dataSource={data?.value?.items}
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
      </Drawer>
    </Page>
  );
}

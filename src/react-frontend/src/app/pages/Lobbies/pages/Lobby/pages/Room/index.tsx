import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Drawer, Rate, Space, Tag, Typography } from 'antd';
import { challengeApi, challengeTagApi, gameApi } from 'app/api';
import { Challenge, ChallengeSearchResultItem } from 'app/api/types/challenge';
import { GetGameResult } from 'app/api/types/games';
import UserAvatar from 'app/components/Auth/UserAvatar';
import Page from 'app/components/Layout/Page';
import NoData from 'app/components/NoData';
import React, { ReactText, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';

export type RoomProps = {
  gameInfo?: GetGameResult;
  onNewRoundStarted?: (round: number) => void;
};

export default function Room(props: RoomProps) {
  const { gameInfo, onNewRoundStarted } = props;

  const { id } = useParams();

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>(
    [],
  );
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeSearchResultItem>();

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

  const handleStartNewRunClick = async () => {
    const result = await triggerStartRound({
      gameId: id!,
      challengeId: selectedChallenge!.id,
    }).unwrap();

    if (result && result.isSuccess && onNewRoundStarted) {
      onNewRoundStarted(result.value!);
    }
  };

  return (
    <Page
      title={gameInfo?.name}
      subTitle={gameInfo?.code}
      extra={
        <>
          <Button onClick={() => changeDrawerValue(!drawerState)}>
            Select challenge
          </Button>
          <Button
            type="primary"
            disabled={!selectedChallenge}
            onClick={handleStartNewRunClick}
            loading={isRoundLoading}
          >
            Start new round
          </Button>

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
                    setSelectedChallenge(record);
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
        </>
      }
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard gutter={16} ghost title="Current round">
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
          <ProCard colSpan={12} title="Selected challenge">
            <ProList<ChallengeSearchResultItem>
              ghost
              rowKey={(entity, _) => entity.id}
              itemLayout="vertical"
              locale={{
                emptyText: <NoData />,
              }}
              dataSource={selectedChallenge ? [selectedChallenge] : []}
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
        <ProCard title="Previous rounds" ghost>
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
    </Page>
  );
}

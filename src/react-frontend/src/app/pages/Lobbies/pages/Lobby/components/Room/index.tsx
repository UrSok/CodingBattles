import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Rate, Space, Tag, Typography } from 'antd';
import { gameApi } from 'app/api';
import UserAvatar from 'app/components/Auth/UserAvatar';
import Page from 'app/components/Layout/Page';
import NoData from 'app/components/NoData';
import { selectUser } from 'app/slices/auth/selectors';
import { GameStatus } from 'app/types/enums/gameStatus';
import { Challenge } from 'app/types/models/challenge/challenge';
import { Game } from 'app/types/models/game/game';
import { Round } from 'app/types/models/game/round';
import * as React from 'react';
import { ReactText, useState } from 'react';
import { useSelector } from 'react-redux';
import ChooseChallenge from './components/ChooseChallenge';

export type RoomProps = {
  gameInfo: Game;
};

export default function Room(props: RoomProps) {
  const { gameInfo } = props;
  const user = useSelector(selectUser);

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>(
    [],
  );

  const [triggerStartRound, { isLoading: isRoundLoading }] =
    gameApi.useStartRoundMutation();

  const renderTags = (_, record: Challenge) => {
    return (
      <Space size={0} wrap>
        {record.tags?.map(tag => (
          <Tag key={tag.id}>{tag.name}</Tag>
        ))}
      </Space>
    );
  };

  const handleStartRoundClick = async () => {
    triggerStartRound(gameInfo.id);
  };

  const renderSelectChallenge = () => {
    if (!gameInfo.currentRound?.challenge) return;
    const { challenge } = gameInfo.currentRound;

    return (
      <ProCard ghost title={challenge.name}>
        {renderTags(undefined, challenge)}
        {challenge.descriptionShort}
      </ProCard>
    );
  };
  return (
    <Page
      title={gameInfo.name}
      subTitle={
        <>
          {gameInfo.isPrivate ? (
            <Tag color="red">Private</Tag>
          ) : (
            <Tag color="green">Public</Tag>
          )}
          {gameInfo.code}
        </>
      }
      extra={
        <>
          {(!gameInfo.currentRound ||
            gameInfo.status === GameStatus.NotStarted) &&
            gameInfo?.gameMasterUser.id === user?.id && (
              <Button
                type="primary"
                disabled={
                  !gameInfo.currentRound || !gameInfo.currentRound.challenge
                }
                onClick={handleStartRoundClick}
                loading={isRoundLoading}
              >
                Start round
              </Button>
            )}
        </>
      }
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard gutter={16} ghost>
          <ProCard title="Users">
            <Space wrap>
              {gameInfo.users.map(user => (
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
              <ChooseChallenge
                gameId={gameInfo.id}
                trigger={<Button>Select challenge</Button>}
              />
            }
          >
            <>
              {renderSelectChallenge()}
              <ProList<Challenge>
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
            </>
          </ProCard>
        </ProCard>
        <ProCard title="Statistics" ghost>
          <ProCard>
            <ProList<Round>
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
    </Page>
  );
}

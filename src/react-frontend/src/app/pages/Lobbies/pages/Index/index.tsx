import ProList from '@ant-design/pro-list';
import { Avatar, Button, Space, Tag } from 'antd';
import { gameApi } from 'app/api';
import UserAvatar from 'app/components/Auth/UserAvatar';
import Page from 'app/components/Page';
import NoData from 'app/components/NoData';
import { PATH_LOBBY } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import { GameStatus } from 'app/types/enums/gameStatus';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreateLobbyModal from './components/CreateLobbyModal';
import JoinLobbyModal from './components/JoinLobbyModal';
import { GameSearchItem } from 'app/types/models/game/gameSearchItem';

export default function GamesPage() {
  const { isAuthenticated, user: authUser } = useSelector(selectAuth);
  const navigate = useNavigate();

  const { isLoading: isLoadingGames, data: gamesResult } =
    gameApi.useGetAllQuery();

  const [triggerJoinLobby] = gameApi.useJoinGameMutation();

  const handleJoin = async (code: string) => {
    if (!authUser?.id) return;

    const result = await triggerJoinLobby({
      userId: authUser.id,
      code: code,
    }).unwrap();

    if (result.isSuccess) {
      navigate(PATH_LOBBY.root + `/${result.value}`);
    }
  };

  return (
    <Page loading={isLoadingGames}>
      <ProList<GameSearchItem>
        ghost
        locale={{
          emptyText: <NoData />,
        }}
        grid={{ gutter: 16, column: 4 }}
        toolBarRender={() => {
          const actions: React.ReactNode[] = [];
          if (isAuthenticated && authUser) {
            actions.push(<CreateLobbyModal userId={authUser.id} />);
            actions.push(<JoinLobbyModal userId={authUser.id} />);
          }

          return actions;
        }}
        headerTitle="Lobbies"
        dataSource={gamesResult?.value}
        onItem={record => ({
          onClick: () => navigate(PATH_LOBBY.root + `/${record.id}`),
        })}
        metas={{
          title: {
            dataIndex: 'name',
          },
          subTitle: {
            dataIndex: 'code',
          },
          content: {
            render: (dom, record, index) => {
              return (
                <Space
                  direction="horizontal"
                  style={{
                    width: '97%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Avatar.Group maxCount={5}>
                    {record.users.map(user => (
                      <UserAvatar userName={user.username} size="large" />
                    ))}
                  </Avatar.Group>
                  {record.users.some(x => x.id === authUser?.id) && (
                    <Tag color="cyan">Joined</Tag>
                  )}
                </Space>
              );
            },
          },
          actions: {
            render: (dom, value, index) => {
              let tag = <Tag color="green">Not Started</Tag>;

              if (value.status === GameStatus.InProgress) {
                tag = <Tag color="warning">In Progress</Tag>;
              }
              return [tag];
            },
            cardActionProps: 'extra',
          },
        }}
      />
    </Page>
  );
}

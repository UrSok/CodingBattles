import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm from '@ant-design/pro-form';
import Actions from '@ant-design/pro-form/lib/layouts/QueryFilter/Actions';
import ProList from '@ant-design/pro-list';
import Skeleton from '@ant-design/pro-skeleton';
import { Avatar, Button, Space, Tag, Tooltip } from 'antd';
import { gameApi } from 'app/api';
import { GameStatus } from 'app/api/types/games';
import UserAvatar from 'app/components/Auth/UserAvatar';
import Page from 'app/components/Layout/Page';
import NoData from 'app/components/NoData';
import { PATH_LOBBY } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreateLobbyModal from './components/CreateLobbyModal';
import JoinLobbyModal from './components/JoinLobbyModal';

export default function GamesPage() {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const navigate = useNavigate();

  const { isLoading: isLoadingGames, data: gamesResult } =
    gameApi.useGetAllQuery();

  const myLobbies = gamesResult?.value?.filter(x =>
    x.users.some(x => user && x.id === user.id),
  );

  const otherLobbies = gamesResult?.value?.filter(x => !myLobbies?.includes(x));

  const [triggerJoinLobby] = gameApi.useJoinGameMutation();

  const handleJoin = async (code: string) => {
    if (!user?.id) return;

    const result = await triggerJoinLobby({
      userId: user.id,
      code: code,
    }).unwrap();

    if (result.isSuccess) {
      navigate(PATH_LOBBY.root + `/${result.value}`);
    }
  };

  return (
    <Page loading={isLoadingGames}>
      <ProList
        ghost
        locale={{
          emptyText: <NoData />,
        }}
        grid={{ gutter: 16, column: 4 }}
        toolBarRender={() => {
          const actions: React.ReactNode[] = [];
          if (isAuthenticated && user) {
            actions.push(<CreateLobbyModal userId={user.id} />);
            actions.push(<JoinLobbyModal userId={user.id} />);
          }

          return actions;
        }}
        headerTitle="Joined/My lobbies"
        dataSource={myLobbies}
        metas={{
          title: {
            dataIndex: 'name',
          },
          subTitle: {
            dataIndex: 'code',
          },
          content: {
            render: (dom, value, index) => {
              let tag: React.ReactNode = [];

              if (value.status === GameStatus.NotStarted) {
                tag = <Tag color="green">Not Started</Tag>;
              }
              if (value.status === GameStatus.InProgress) {
                tag = <Tag color="warning">In Progress</Tag>;
              }

              return (
                <Space direction="vertical">
                  <Avatar.Group maxCount={5}>
                    {value.users.map(user => (
                      <UserAvatar userName={user.username} size="large" />
                    ))}
                  </Avatar.Group>
                  {tag}
                </Space>
              );
            },
          },
          actions: {
            render: (dom, value, index) => {
              return [
                <Button
                  type="primary"
                  onClick={() => navigate(PATH_LOBBY.root + `/${value.id}`)}
                >
                  Open
                </Button>,
              ];
            },
            cardActionProps: 'extra',
          },
        }}
      />
      <ProList
        ghost
        locale={{
          emptyText: <NoData />,
        }}
        grid={{ gutter: 16, column: 4 }}
        headerTitle="Other lobbies"
        dataSource={otherLobbies}
        metas={{
          title: {
            dataIndex: 'name',
          },
          subTitle: {
            dataIndex: 'code',
          },
          content: {
            render: (dom, value, index) => {
              let tag: React.ReactNode = [];

              if (value.status === GameStatus.NotStarted) {
                tag = <Tag color="green">Not Started</Tag>;
              }
              if (value.status === GameStatus.InProgress) {
                tag = <Tag color="warning">In Progress</Tag>;
              }

              return (
                <Space direction="vertical">
                  <Avatar.Group maxCount={5}>
                    {value.users.map(user => (
                      <UserAvatar userName={user.username} size="large" />
                    ))}
                  </Avatar.Group>
                  {tag}
                </Space>
              );
            },
          },
          actions: {
            render: (dom, value, index) => {
              return [
                <Button type="primary" onClick={() => handleJoin(value.code)}>
                  Join
                </Button>,
              ];
            },
            cardActionProps: 'extra',
          },
        }}
      />
    </Page>
  );
}

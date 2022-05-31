import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Avatar, Space, Tag, Typography } from 'antd';
import { gameApi } from 'app/api';
import SingInModalForm from 'app/components/Auth/Forms/SignInModalForm';
import SingUpModalForm from 'app/components/Auth/Forms/SignUpModalForm';
import UserAvatar from 'app/components/Auth/UserAvatar';
import CardSection from 'app/components/CardSection';
import LoadingSpinner from 'app/components/LoadingSpinner';
import NoData from 'app/components/NoData';
import Page from 'app/components/Page';
import { PATH_LOBBY, PATH_PROFILES } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import { GameStatus } from 'app/types/enums/gameStatus';
import { GameSearchItem } from 'app/types/models/game/gameSearchItem';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CreateLobbyModal from '../Lobbies/pages/Index/components/CreateLobbyModal';
import JoinLobbyModal from '../Lobbies/pages/Index/components/JoinLobbyModal';

export default function Dashboard() {
  const { isAuthenticated, user: authUser } = useSelector(selectAuth);
  const navigate = useNavigate();

  const { data: gamesResult, isLoading: isGamesResultLoading } =
    gameApi.useGetGamesByUserIdQuery(authUser?.id ?? skipToken);

  const currentGames = gamesResult?.value?.filter(
    x => x => x.users.some(user => user.id === authUser?.id),
  );

  const gamesHistory = gamesResult?.value?.filter(
    x => !currentGames?.some(y => x.id === y.id),
  );

  // const dashboard = (
  //   <CardSection ghost title="Dashboard">
  //     <ProCard>
  //       <Space direction="vertical">
  //         <Typography.Text>Welcome back,</Typography.Text>
  //         <Link to={PATH_PROFILES.root + `/${user?.id}`}>
  //           <Space className="challenge-created-by">
  //             <UserAvatar userName={user?.username ?? ''} size="large" />
  //             <Typography.Text
  //               strong
  //               style={{
  //                 fontSize: 15,
  //               }}
  //             >
  //               {user?.username}
  //             </Typography.Text>
  //           </Space>
  //         </Link>
  //       </Space>
  //     </ProCard>
  //   </CardSection>
  // );

  const dashboard = (
    <>
      <ProCard
        title="Lobbies"
        direction="column"
        ghost
        extra={
          authUser && (
            <Space>
              <CreateLobbyModal userId={authUser.id} />
              <JoinLobbyModal userId={authUser.id} />
            </Space>
          )
        }
        gutter={[8, 8]}
      >
        <ProCard collapsible title="Current">
          <ProList<GameSearchItem>
            ghost
            locale={{
              emptyText: <NoData />,
            }}
            grid={{ gutter: 16, column: 4 }}
            dataSource={currentGames}
            onItem={record => ({
              onClick: () => navigate(PATH_LOBBY.root + `/${record.id}`),
            })}
            loading={{
              spinning: isGamesResultLoading,
              indicator: <LoadingSpinner noTip />,
            }}
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
        </ProCard>
        <ProCard collapsible title="History">
          <ProList<GameSearchItem>
            ghost
            locale={{
              emptyText: <NoData />,
            }}
            grid={{ gutter: 16, column: 4 }}
            dataSource={gamesHistory}
            onItem={record => ({
              onClick: () => navigate(PATH_LOBBY.root + `/${record.id}`),
            })}
            loading={{
              spinning: isGamesResultLoading,
              indicator: <LoadingSpinner noTip />,
            }}
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
        </ProCard>
      </ProCard>
    </>
  );

  return (
    <Page>
      <ProCard ghost gutter={[16, 16]} direction="column">
        <ProCard
          ghost
          bodyStyle={{
            height: isAuthenticated ? 'initial' : '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Space direction="vertical" align="center">
            <img src="/logo-smol.png" alt="logo-smol" />
            <Typography.Text strong>
              A platform for challenging others in a coding battle.
            </Typography.Text>

            <Space
              style={{
                marginTop: '10px',
              }}
            >
              {!isAuthenticated && (
                <Space>
                  <SingInModalForm textButton />
                  <SingUpModalForm textButton />
                </Space>
              )}
            </Space>
          </Space>
        </ProCard>
        {isAuthenticated && dashboard}
      </ProCard>
    </Page>
  );
}

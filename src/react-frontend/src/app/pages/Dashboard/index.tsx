import { EditFilled, ExpandAltOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Avatar, Button, Space, Tag, Typography } from 'antd';
import { challengeApi, gameApi } from 'app/api';
import SingInModalForm from 'app/components/Auth/Forms/SignInModalForm';
import SingUpModalForm from 'app/components/Auth/Forms/SignUpModalForm';
import UserAvatar from 'app/components/Auth/UserAvatar';
import ChallengeList from 'app/components/ChallengeList';
import LoadingSpinner from 'app/components/LoadingSpinner';
import NoData from 'app/components/NoData';
import Page from 'app/components/Page';
import { PATH_CHALLENGES, PATH_LOBBY } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import { ChallengeStatus } from 'app/types/enums/challengeStatus';
import { GameStatus } from 'app/types/enums/gameStatus';
import { Role } from 'app/types/enums/role';
import { GameSearchItem } from 'app/types/models/game/gameSearchItem';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreateLobbyModal from '../Lobbies/pages/Index/components/CreateLobbyModal';
import JoinLobbyModal from '../Lobbies/pages/Index/components/JoinLobbyModal';

export default function Dashboard() {
  const { isAuthenticated, user: authUser } = useSelector(selectAuth);
  const isMemberOrAdmin =
    authUser?.role === Role.Member || authUser?.role === Role.Admin;
  const navigate = useNavigate();

  const { data: gamesResult, isLoading: isGamesResultLoading } =
    gameApi.useGetGamesByUserIdQuery(authUser?.id ?? skipToken);

  const currentGames = gamesResult?.value?.filter(
    x => x => x.users.some(user => user.id === authUser?.id),
  );

  const gamesHistory = gamesResult?.value?.filter(
    x => !currentGames?.some(y => x.id === y.id),
  );

  const { data: challengesResult, isLoading: isChallengesResultLoading } =
    challengeApi.useGetByUserIdQuery(
      authUser && isMemberOrAdmin ? authUser.id : skipToken,
    );

  const draftChallenges = challengesResult?.value?.filter(
    x => x.status === ChallengeStatus.Draft,
  );

  const unpublishedChallenges = challengesResult?.value?.filter(
    x => x.status === ChallengeStatus.Unpublished,
  );

  const publishedChallenges = challengesResult?.value?.filter(
    x => x.status === ChallengeStatus.Published,
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
              {isMemberOrAdmin && <CreateLobbyModal userId={authUser.id} />}
              <JoinLobbyModal userId={authUser.id} />
            </Space>
          )
        }
        gutter={[8, 8]}
      >
        <ProCard
          collapsible
          title="Current"
          loading={isGamesResultLoading ? <LoadingSpinner noTip /> : undefined}
        >
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
        <ProCard
          collapsible
          defaultCollapsed
          title="History"
          loading={isGamesResultLoading ? <LoadingSpinner noTip /> : undefined}
        >
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
      {isMemberOrAdmin && (
        <ProCard
          title="My Challenges"
          direction="column"
          ghost
          extra={
            isMemberOrAdmin && (
              <Button
                type="primary"
                onClick={() => navigate(PATH_CHALLENGES.save)}
              >
                Create
              </Button>
            )
          }
          gutter={[8, 8]}
        >
          <ProCard
            collapsible
            title="Draft"
            defaultCollapsed
            loading={
              isChallengesResultLoading ? <LoadingSpinner noTip /> : undefined
            }
          >
            <ChallengeList
              preventFetch
              staticChallenges={draftChallenges}
              itemExtra={{
                render: (_, entity) => (
                  <Space>
                    <Button
                      type="dashed"
                      onClick={() =>
                        navigate(PATH_CHALLENGES.root + `/${entity.id}`)
                      }
                      icon={<ExpandAltOutlined />}
                    />
                    <Button
                      type="dashed"
                      onClick={() =>
                        navigate(PATH_CHALLENGES.save + `/${entity.id}`)
                      }
                      icon={<EditFilled />}
                    />
                  </Space>
                ),
              }}
            />
          </ProCard>
          <ProCard
            collapsible
            title="Upublished"
            defaultCollapsed
            loading={
              isChallengesResultLoading ? <LoadingSpinner noTip /> : undefined
            }
          >
            <ChallengeList
              preventFetch
              staticChallenges={unpublishedChallenges}
              itemExtra={{
                render: (_, entity) => (
                  <Space>
                    <Button
                      type="dashed"
                      onClick={() =>
                        navigate(PATH_CHALLENGES.root + `/${entity.id}`)
                      }
                      icon={<ExpandAltOutlined />}
                    />
                    <Button
                      type="dashed"
                      onClick={() =>
                        navigate(PATH_CHALLENGES.save + `/${entity.id}`)
                      }
                      icon={<EditFilled />}
                    />
                  </Space>
                ),
              }}
            />
          </ProCard>
          <ProCard
            collapsible
            title="Published"
            defaultCollapsed
            loading={
              isChallengesResultLoading ? <LoadingSpinner noTip /> : undefined
            }
          >
            <ChallengeList
              preventFetch
              staticChallenges={publishedChallenges}
              itemExtra={{
                render: (_, entity) => (
                  <Space>
                    <Button
                      type="dashed"
                      onClick={() =>
                        navigate(PATH_CHALLENGES.root + `/${entity.id}`)
                      }
                      icon={<ExpandAltOutlined />}
                    />
                    <Button
                      type="dashed"
                      onClick={() =>
                        navigate(PATH_CHALLENGES.save + `/${entity.id}`)
                      }
                      icon={<EditFilled />}
                    />
                  </Space>
                ),
              }}
            />
          </ProCard>
        </ProCard>
      )}
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

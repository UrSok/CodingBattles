import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Rate, Space, Tag, Typography } from 'antd';
import { gameApi } from 'app/api';
import UserAvatar from 'app/components/Auth/UserAvatar';
import ChallengeList from 'app/components/ChallengeList';
import Page from 'app/components/Layout/Page';
import NoData from 'app/components/NoData';
import { selectUser } from 'app/slices/auth/selectors';
import { GameStatus } from 'app/types/enums/gameStatus';
import { RoundStatus } from 'app/types/enums/roundStatus';
import { Challenge } from 'app/types/models/challenge/challenge';
import { Game } from 'app/types/models/game/game';
import { Round } from 'app/types/models/game/round';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import RoundSettings from './components/RoundSettings';
import ChooseChallenge from './components/RoundSettings/components/ChooseChallenge';
import RoundsStatistics from './components/RoundsStatistics';

export type RoomProps = {
  gameInfo: Game;
};

export default function Room(props: RoomProps) {
  const { gameInfo } = props;
  const authUser = useSelector(selectUser);
  const isGameMaster = gameInfo.gameMasterUser.id === authUser?.id;

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
          {gameInfo.status === GameStatus.NotStarted && isGameMaster && (
            <Button danger type="primary">
              Close Game
            </Button>
          )}
          {!isGameMaster && (
            <Button danger type="primary">
              Leave Game
            </Button>
          )}
        </>
      }
    >
      <ProCard direction="column" ghost gutter={[8, 8]}>
        <ProCard direction="column" gutter={[0]} ghost>
          <ProCard ghost title="Users">
            <ProCard>
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
          </ProCard>
          {(isGameMaster ||
            gameInfo.currentRound?.status === RoundStatus.NotStarted) && (
            <RoundSettings
              gameId={gameInfo.id}
              isGameMaster={isGameMaster}
              currentRound={gameInfo.currentRound}
            />
          )}
        </ProCard>
        <ProCard title="Results" ghost>
          <RoundsStatistics gameInfo={gameInfo} />
        </ProCard>
      </ProCard>
    </Page>
  );
}

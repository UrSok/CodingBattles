import { gameApi } from 'app/api';
import Page from 'app/components/Layout/Page';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { selectAuth, selectUser } from 'app/slices/auth/selectors';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Ide from './pages/Ide';
import Room from './pages/Room';
import { addMinutesToDate } from './pages/utils/date';

import { getTokenFromLocalStorage } from 'app/utils/jwt';
import * as signalR from '@microsoft/signalr';
import { useEffectOnce } from 'usehooks-ts';
import { Button } from 'antd';

const connection: signalR.HubConnection;

export default function Lobby() {
  const { id } = useParams();
  const token = getTokenFromLocalStorage();
  const user = useSelector(selectUser);

 useEffectOnce(() => {
    

    connection.start();

    connection.on('send', data => {
      console.log('Received: ', data);
    });
  });

  const join = () => {
    if (connection.state === signalR.HubConnectionState.Connected) {
      connection.send('JoinLobby', user?.id, 'NYCrV6Tc');
    }
  };

  const salut = () => {
    if (connection.state === signalR.HubConnectionState.Connected) {
      connection.send('send', id, 'Salut');
    }
  };

  return (
    <div>
      <Button onClick={join}>JoinLobby</Button>
      <Button onClick={salut}>Salut</Button>
    </div>
  );

}

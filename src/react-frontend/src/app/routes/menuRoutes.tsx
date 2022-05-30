import AccountGroupOutline from '@2fd/ant-design-icons/lib/AccountGroupOutline';
import PuzzleOutline from '@2fd/ant-design-icons/lib/PuzzleOutline';
import { MenuDataItem } from '@ant-design/pro-layout';
import * as React from 'react';
import { PATH_CHALLENGES, PATH_LOBBY } from './paths';

export const menuRoutes: MenuDataItem[] = [
  {
    path: PATH_CHALLENGES.root,
    name: 'Challenges',
    icon: <PuzzleOutline style={{ fontSize: 18 }} />,
    access: 'any',
  },
  {
    path: PATH_LOBBY.root,
    name: 'Lobbies',
    icon: <AccountGroupOutline style={{ fontSize: 18 }} />,
    access: 'any',
  },
];

import * as React from 'react';

import PuzzleOutline from '@2fd/ant-design-icons/lib/PuzzleOutline';
import AccountGroupOutline from '@2fd/ant-design-icons/lib/AccountGroupOutline';
import PlayBoxMultipleOutline from '@2fd/ant-design-icons/lib/PlayBoxMultipleOutline';

import { PATH_CHALLENGES, PATH_IDE, PATH_LOBBY } from './paths';

import { MenuDataItem } from '@ant-design/pro-layout';

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
  }/*,
  {
    path: PATH_IDE.root,
    name: 'IDE',
    icon: <PlayBoxMultipleOutline style={{ fontSize: 18 }} />,
    access: 'any',
  }*/
];

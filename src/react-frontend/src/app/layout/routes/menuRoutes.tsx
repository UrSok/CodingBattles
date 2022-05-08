import * as React from 'react';
import {
  SmileOutlined,
  PlayCircleOutlined,
  FolderOutlined,
} from '@ant-design/icons';

import { PATH_CHALLENGES, PATH_GAMES, PATH_IDE } from './paths';

import { MenuDataItem } from '@ant-design/pro-layout';

export const menuRoutes: MenuDataItem[] = [
  {
    path: PATH_CHALLENGES.root,
    name: 'Challenges',
    icon: <SmileOutlined />,
    access: 'any',
  },
  {
    path: PATH_GAMES.root,
    name: 'Games',
    icon: <PlayCircleOutlined />,
    access: 'any',
  },
  {
    path: PATH_IDE.root,
    name: 'IDE',
    icon: <FolderOutlined />,
    access: 'any',
  },
];

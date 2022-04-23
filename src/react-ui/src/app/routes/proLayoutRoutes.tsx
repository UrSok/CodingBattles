import React from 'react';
import { SmileOutlined, PlayCircleOutlined, FolderOutlined } from '@ant-design/icons';

export const proLayoutRoutes = {
  route: {
    path: '/',
    routes: [
      {
        path: '/challenges',
        name: 'Challenges',
        icon: <SmileOutlined />,
        access: 'any',
      },
      {
        path: '/games',
        name: 'Games',
        icon: <PlayCircleOutlined />,
        access: 'any',
      },
      {
        path: '/ide',
        name: 'IDE',
        icon: <FolderOutlined />,
        access: 'any',
      },
    ],
  },
  location: {
    pathname: '/',
  },
};

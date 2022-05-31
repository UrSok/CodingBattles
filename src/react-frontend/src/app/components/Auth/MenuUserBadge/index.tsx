import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Typography } from 'antd';

import { PATH_PROFILES } from 'app/routes/paths';
import UserAvatar, {
  getColors,
  getFirstCharacter,
  getFirstTwoCharacters,
} from '../UserAvatar';

type MenuUserBadgeProps = {
  userName: string;
};

export default function MenuUserBadge(props: MenuUserBadgeProps) {
  const { userName } = props;
  const firstTwoChars = getFirstTwoCharacters(userName);
  const firstChar = getFirstCharacter(firstTwoChars);
  const { background, foreground } = getColors(firstChar);
  const style = {
    backgroundColor: background,
    color: foreground,
  };

  return {
    title: (
      //<Link to={PATH_PROFILES.ME.root}>
      <Typography.Text strong>{userName}</Typography.Text>
      //</Link>
    ),
    size: 'large',
    style: style,
    children: (
      //<Link to={PATH_PROFILES.ME.root}>
      <UserAvatar userName={userName} />
      //</Link>
    ),
  };
}

import { Avatar, Typography } from 'antd';
import { PATH_PROFILES } from 'app/layout/routes/paths';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  red,
  volcano,
  gold,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey,
} from '@ant-design/colors';

const colorsDictionary: Record<string, typeof red> = {
  ABC: red,
  CDX: volcano,
  EF: gold,
  GH: yellow,
  IJY: lime,
  KL: green,
  MN: cyan,
  OP: blue,
  QR: geekblue,
  STZ: purple,
  UV: magenta,
  0: grey,
};

function getFirstTwoCharacters(name: string) {
  return name.toUpperCase().substring(0, 2);
}

function getFirstCharacter(name: string) {
  return name.toUpperCase().charAt(0);
}

function getColors(firstChar: string): {
  background: string;
  foreground: string;
} {
  let color = colorsDictionary[0];
  for (const key in colorsDictionary) {
    if (key.includes(firstChar)) {
      color = colorsDictionary[key];
      break;
    }
  }

  return {
    background: color[1],
    foreground: color.primary!,
  };
}

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
      <Link to={PATH_PROFILES.ME.root}>
        <Typography.Text strong>{userName}</Typography.Text>
      </Link>
    ),
    size: 'large',
    style: style,
    children: (
      <Link to={PATH_PROFILES.ME.root}>
        <Avatar style={style}>{firstTwoChars}</Avatar>
      </Link>
    ),
  };
}

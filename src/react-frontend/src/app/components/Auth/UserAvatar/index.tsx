import React from 'react';

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
import { Avatar } from 'antd';
import { AvatarSize } from 'antd/lib/avatar/SizeContext';

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

export function getFirstTwoCharacters(name: string) {
  return name.toUpperCase().substring(0, 2);
}

export function getFirstCharacter(name: string) {
  return name.toUpperCase().charAt(0);
}

export function getColors(firstChar: string): {
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

type UserAvatarProps = {
  userName: string;
  size?: AvatarSize;
};

export default function UserAvatar(props: UserAvatarProps) {
  const { userName, size } = props;
  const firstTwoChars = getFirstTwoCharacters(userName);
  const firstChar = getFirstCharacter(firstTwoChars);
  const { background, foreground } = getColors(firstChar);

  return (
    <Avatar
      style={{
        backgroundColor: background,
        color: foreground,
      }}
      size={size ?? 'default'}
    >
      {firstTwoChars}
    </Avatar>
  );
}

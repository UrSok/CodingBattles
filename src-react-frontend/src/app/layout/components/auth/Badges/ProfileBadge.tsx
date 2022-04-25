import * as React from 'react';
import {
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Space, Menu, MenuProps } from 'antd';
import { TFunction, useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { PATH_PROFILES } from 'app/layout/routes/paths';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { selectUser } from 'app/auth/selectors';
import { authActions } from 'app/auth';

export default function ProfileBadge() {
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  return (
    <Dropdown
      overlay={<DropdownMenu t={t} navigate={navigate} dispatch={dispatch} />}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Space>
        {user?.username}
        <Avatar shape="square" size="default" icon={<UserOutlined />} />
        <DownOutlined />
      </Space>
    </Dropdown>
  );
}

type DropdownMenuProps = {
  t: TFunction<'translation'>;
  navigate: NavigateFunction;
  dispatch: Dispatch<AnyAction>;
};

enum MenuKey {
  MyProfile = 'my-profile',
  Settings = 'settings',
  SignOut = 'sign-out',
}

const DropdownMenu = ({ t, navigate, dispatch }: DropdownMenuProps) => {
  const menuItems: MenuProps['items'] = [
    {
      key: MenuKey.MyProfile,
      label: t(translations.ProfileBadge.Dropdown.myProfile),
      icon: <ProfileOutlined />,
    },
    {
      key: MenuKey.Settings,
      label: t(translations.ProfileBadge.Dropdown.settings),
      icon: <SettingOutlined />,
    },
    {
      key: MenuKey.SignOut,
      label: t(translations.ProfileBadge.Dropdown.singOut),
      icon: <LogoutOutlined />,
    },
  ];

  const handleOnClick: MenuClickEventHandler = ({ key }) => {
    switch (key as MenuKey) {
      case MenuKey.MyProfile:
        navigate(PATH_PROFILES.ME.root);
        break;
      case MenuKey.Settings:
        navigate(PATH_PROFILES.ME.settings);
        break;
      case MenuKey.SignOut:
        dispatch(authActions.signOut());
        break;
      default:
        throw new Error('Unkown menu key');
    }
  };

  return <Menu items={menuItems} onClick={handleOnClick} />;
};

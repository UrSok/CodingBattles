import React, { useEffect } from 'react';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Router from './routes/Router';
import { menuRoutes } from './routes/menuRoutes';
import HeaderAlerts from './components/auth/HeaderAlerts';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from 'app/auth/selectors';
import { Avatar, notification, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PATH_PROFILES } from './routes/paths';
import { useAuthSlice } from 'app/auth';
import SingInModalForm from './components/auth/Forms/SignInModalForm';
import SingUpModalForm from './components/auth/Forms/SignUpModalForm';
import { translations } from 'locales/translations';
import { selectLayout } from './slice/selectors';
import { useLayoutSlice } from './slice';

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const { showUnkownError } = useSelector(selectLayout);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { actions: authActions } = useAuthSlice();
  const { actions: layoutActions } = useLayoutSlice();

  const signOut = () => {
    dispatch(authActions.signOut());
    navigate('/');
    notification['success']({
      message: t(translations.SignOutNotification.message),
      description: <p>{t(translations.SignOutNotification.description)}</p>,
      duration: 5,
    });
  };

  useEffect(() => {
    if (showUnkownError) {
      notification['error']({
        message: t(translations.UnkownErrorNotification.message),
        description: (
          <p>{t(translations.UnkownErrorNotification.description)}</p>
        ),
        duration: 10,
      });
      dispatch(layoutActions.resetUnkownException());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUnkownError]);

  return (
    <ProLayout
      title="Coding Battles"
      /*layoutBgImgList={[
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
          left: 85,
          bottom: 100,
          height: '303px',
        },
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
          bottom: -68,
          right: -45,
          height: '303px',
        },
        {
          src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
          bottom: 0,
          left: 0,
          width: '331px',
        },
      ]}*/
      route={{
        routes: menuRoutes,
      }}
      location={{
        pathname: pathname,
      }}
      /*menu={{
        hideMenuWhenCollapsed: true,
        type: 'group',
      }}*/
      fixSiderbar
      onMenuHeaderClick={() => navigate('/')}
      menuDataRender={(menuData: MenuDataItem[]): MenuDataItem[] => {
        return menuData;
      }}
      menuItemRender={(item: MenuDataItem, dom) => (
        <Link to={item.path!}>{dom}</Link>
      )}
      //rightContentRender={() => <AuthBadges />}
      avatarProps={
        isAuthenticated
          ? {
              title: user?.username,
              size: 'middle',
              children: (
                <Link to={PATH_PROFILES.ME.root}>
                  <Avatar size="small" icon={<UserOutlined />} />
                </Link>
              ),
            }
          : null
      }
      actionsRender={props => {
        if (isAuthenticated) {
          return [
            <Link
              to={PATH_PROFILES.ME.settings}
              style={{
                color: 'inherit',
              }}
            >
              <SettingOutlined />
            </Link>,
            <LogoutOutlined onClick={signOut} />,
          ];
        }

        return [<SingUpModalForm />, <SingInModalForm />];
      }}
    >
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>
        <HeaderAlerts />
        <Router />
      </Space>
    </ProLayout>
  );
}

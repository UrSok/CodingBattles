import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { notification, Space } from 'antd';
import { useAuthSlice } from 'app/slices/auth';
import { selectAuth } from 'app/slices/auth/selectors';
import { Role } from 'app/types/enums/role';
import { translations } from 'locales/translations';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { menuRoutes } from '../../routes/menuRoutes';
import { PATH_PROFILES } from '../../routes/paths';
import Router from '../../routes/Router';
import SingInModalForm from '../Auth/Forms/SignInModalForm';
import SingUpModalForm from '../Auth/Forms/SignUpModalForm';
import MenuUserBadge from '../Auth/MenuUserBadge';
import HeaderAlerts from '../HeaderAlerts';

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { actions: authActions } = useAuthSlice();

  const signOut = () => {
    dispatch(authActions.signOut());
    navigate('/');
    notification['success']({
      message: t(translations.SignOutNotification.message),
      description: <p>{t(translations.SignOutNotification.description)}</p>,
      duration: 5,
    });
  };

  return (
    <ProLayout
      title="Coding Battle"
      logo={false}
      fixedHeader
      fixSiderbar
      locale="en-US"
      layoutBgImgList={[
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
      ]}
      /*menu={{
        //hideMenuWhenCollapsed: true,
      }}*/
      route={{
        routes: menuRoutes,
      }}
      location={{
        pathname: pathname,
      }}
      onMenuHeaderClick={() => navigate('/')}
      menuDataRender={(menuData: MenuDataItem[]): MenuDataItem[] => {
        // TODO: REFACTOR THIS LOGIC AS IT DOESN'T WORK AS EXPECTED
        if (!isAuthenticated) {
          return menuData.filter(x => x.access === 'any');
        }

        if (user?.role === Role.Admin) return menuData;

        if (user?.role !== Role.Member) {
          menuData = menuData.filter(x => x.access !== Role.Member);
        }

        return menuData;
      }}
      menuItemRender={(item: MenuDataItem, dom) => (
        <Link to={item.path!}>{dom}</Link>
      )}
      avatarProps={
        isAuthenticated ? MenuUserBadge({ userName: user!.username }) : null
      }
      actionsRender={_ => {
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

import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { useMonaco } from '@monaco-editor/react';
import { notification, Space } from 'antd';
import { translations } from 'locales/translations';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import { stubInputLanguage, stubLangDefinitions } from '../config/monaco';
import SingInModalForm from './components/Auth/Forms/SignInModalForm';
import SingUpModalForm from './components/Auth/Forms/SignUpModalForm';
import MenuUserBadge from './components/Auth/MenuUserBadge';
import HeaderAlert from './components/HeaderAlert';
import routes from './routes/menuRoutes';
import { PATH_PROFILES } from './routes/paths';
import Router from './routes/Router';
import { useAuthSlice } from './slices/auth';
import { selectAuth } from './slices/auth/selectors';
import { useLayoutSlice } from './slices/layout';
import { selectLayout } from './slices/layout/selectors';
import './styles/index.less';
import { Role } from './types/enums/role';

const layoutBgImgList = [
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
];

export default function App() {
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();
  const monaco = useMonaco();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { actions: authActions } = useAuthSlice();
  const { actions: layoutActions } = useLayoutSlice();
  const { isInitialized, isAuthenticated, user } = useSelector(selectAuth);
  const { showUnkownError } = useSelector(selectLayout);

  const signOut = () => {
    dispatch(authActions.signOut());
    navigate('/');
    notification['success']({
      message: t(translations.SignOutNotification.message),
      description: <p>{t(translations.SignOutNotification.description)}</p>,
      duration: 5,
    });
  };

  useEffectOnce(() => {
    dispatch(authActions.initialize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useUpdateEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: stubInputLanguage });
      monaco.languages.setMonarchTokensProvider(
        stubInputLanguage,
        stubLangDefinitions,
      );
    }
    // TODO: ADD LANGUAGE PROVIDER SOMEDAY
    /*monaco.languages.registerCompletionItemProvider(
        stubInputLang,
        stubLangCompletion,
      );*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco]);

  useUpdateEffect(() => {
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
    <>
      <Helmet
        titleTemplate="%s - Coding Battles"
        defaultTitle="Coding Battles"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta
          name="description"
          content="A platform for challenging others in a coding battle."
        />
      </Helmet>
      <ProLayout
        title="Coding Battle"
        logo={false}
        fixedHeader
        fixSiderbar
        loading={!isInitialized}
        layoutBgImgList={layoutBgImgList}
        contentStyle={{}}
        menu={{
          hideMenuWhenCollapsed: true,
        }}
        route={{
          routes,
        }}
        location={{
          pathname,
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
        avatarProps={user && MenuUserBadge({ userName: user.username })}
        actionsRender={_ => {
          if (!isAuthenticated) {
            return [<SingUpModalForm />, <SingInModalForm />];
          }

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
        }}
      >
        <Space
          direction="vertical"
          size="small"
          style={{
            display: 'flex',
          }}
        >
          <HeaderAlert user={user} />
          <Router />
        </Space>
      </ProLayout>
    </>
  );
}

import ProCard from '@ant-design/pro-card';
import { Space, Typography } from 'antd';
import SingInModalForm from 'app/components/Auth/Forms/SignInModalForm';
import SingUpModalForm from 'app/components/Auth/Forms/SignUpModalForm';
import UserAvatar from 'app/components/Auth/UserAvatar';
import CardSection from 'app/components/CardSection';
import Page from 'app/components/Page';
import { PATH_PROFILES } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Welcome() {
  const { isAuthenticated, user } = useSelector(selectAuth);

  const dashboard = (
    <CardSection ghost title="Dashboard">
      <ProCard>
        <Space direction="vertical">
          <Typography.Text>Welcome back,</Typography.Text>
          <Link to={PATH_PROFILES.root + `/${user?.id}`}>
            <Space className="challenge-created-by">
              <UserAvatar userName={user?.username ?? ''} size="large" />
              <Typography.Text
                strong
                style={{
                  fontSize: 15,
                }}
              >
                {user?.username}
              </Typography.Text>
            </Space>
          </Link>
        </Space>
      </ProCard>
    </CardSection>
  );

  return (
    <Page>
      <ProCard ghost gutter={[16, 16]} direction="column">
        <ProCard
          ghost
          bodyStyle={{
            height: isAuthenticated ? 'initial' : '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Space direction="vertical" align="center">
            <img src="/logo-smol.png" alt="logo-smol" />
            <Typography.Text strong>
              A platform for challenging others in a coding battle.
            </Typography.Text>

            <Space
              style={{
                marginTop: '10px',
              }}
            >
              {!isAuthenticated ? (
                <Space>
                  <SingInModalForm textButton />
                  <SingUpModalForm textButton />
                </Space>
              ) : null}
            </Space>
          </Space>
        </ProCard>
        {isAuthenticated && dashboard}
      </ProCard>
    </Page>
  );
}

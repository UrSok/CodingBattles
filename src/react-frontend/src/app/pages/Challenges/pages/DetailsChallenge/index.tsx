import ProCard from '@ant-design/pro-card';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProList from '@ant-design/pro-list';
import MDEditor from '@uiw/react-md-editor';
import { Button, Space, Typography } from 'antd';
import { challengeApi } from 'app/api/challenge';
import { Feedback } from 'app/api/types/challenge';
import CardSection from 'app/components/CardSection';
import ChallengeDescription from 'app/components/ChallengeDescription';
import ErrorResult from 'app/components/ErrorResult';
import Page from 'app/components/Layout/Page';
import NoData from 'app/components/NoData';
import { PATH_CHALLENGES } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function DetailsChallenge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(selectAuth);

  const { isLoading, data, error } = challengeApi.useGetChallengeQuery(id!);

  let pageContent: React.ReactNode = '';

  if (!data || !data?.isSuccess) {
    return (
      <Page loading={isLoading}>
        <ErrorResult status="404" title="Challenge not found" />
      </Page>
    );
  }

  if (data?.value) {
    const {
      tagIds,
      descriptionMarkdown,
      stubGeneratorInput,
      tests,
      createdByUserId,
      feedbacks,
    } = data.value;

    pageContent = (
      <>
        <ProCard direction="column" ghost gutter={[16, 16]}>
          <ProCard gutter={16} ghost>
            <ProCard title="Description" colSpan={16}>
              <ChallengeDescription value={descriptionMarkdown} />
            </ProCard>
            <ProCard colSpan={8} ghost direction="column" gutter={[16, 16]}>
              <ProCard title="Created by">{createdByUserId}</ProCard>
              <ProCard title="Tags">{createdByUserId}</ProCard>
              <ProCard title="Statistics">
                {!feedbacks || feedbacks.length === 0 ? (
                  'Not enough feedbacks'
                ) : (
                  <div>{feedbacks.length}</div>
                )}
              </ProCard>
            </ProCard>
          </ProCard>

          <ProCard gutter={16} ghost>
            <ProCard title="Tests" colSpan={16}>
              <ProCard ghost split="horizontal" gutter={[16, 16]}>
                {tests.map((test, index) => (
                  <ProCard key={index} split="horizontal" ghost>
                    <ProCard
                      direction="row"
                      gutter={[8, 0]}
                      ghost
                      title={test?.title}
                    >
                      <ProCard ghost>
                        <Typography.Text strong>Input:</Typography.Text>
                        <Typography.Paragraph>
                          <pre>{test.case?.input}</pre>
                        </Typography.Paragraph>
                      </ProCard>
                      <ProCard ghost>
                        <Typography.Text strong>
                          Expected Output:
                        </Typography.Text>
                        <Typography.Paragraph>
                          <pre>{test.case?.expectedOutput}</pre>
                        </Typography.Paragraph>
                      </ProCard>
                    </ProCard>
                  </ProCard>
                ))}
              </ProCard>
            </ProCard>
          </ProCard>

          <ProCard gutter={16} ghost>
            <ProCard title="Feedbacks" colSpan={16} >
              <ProList<Feedback> 
                ghost
                rowKey={(entity) => entity.userId}
                dataSource={feedbacks}
                split
                itemLayout="vertical"
                locale={{
                  emptyText: <NoData />,
                }}
              />
            </ProCard>
          </ProCard>
        </ProCard>
      </>
    );
  }

  return (
    <Page
      loading={isLoading}
      title={data?.value?.name}
      extra={
        <>
          {isAuthenticated &&
          user?.id &&
          user?.id === data?.value?.createdByUserId ? (
            <Button onClick={() => navigate(PATH_CHALLENGES.save + `/${id}`)}>
              Edit
            </Button>
          ) : null}
          <Button type="primary">Play</Button>
        </>
      }
    >
      {pageContent}
    </Page>
  );
}

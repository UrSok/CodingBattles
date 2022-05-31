import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Space, Tag, Typography } from 'antd';
import { challengeApi } from 'app/api/challenge';
import UserAvatar from 'app/components/Auth/UserAvatar';
import ChallengeDescription from 'app/components/ChallengeDescription';
import ErrorResult from 'app/components/ErrorResult';
import Page from 'app/components/Page';
import NoData from 'app/components/NoData';
import { PATH_CHALLENGES, PATH_PROFILES } from 'app/routes/paths';
import { selectAuth } from 'app/slices/auth/selectors';
import { ChallengeStatus } from 'app/types/enums/challengeStatus';
import { Role } from 'app/types/enums/role';
import { Feedback } from 'app/types/models/challenge/feedback';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UnPublishModal from '../../components/UnPublishModal';
import FeedbackModalForm from 'app/components/FeedbackModalForm';
import ProForm, { ProFormRate } from '@ant-design/pro-form';

export default function DetailsChallenge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(selectAuth);

  const { isLoading, data } = challengeApi.useGetChallengeQuery(id!);

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
      tags,
      descriptionMarkdown,
      tests,
      user,
      feedbacks,
      difficulty,
      fun,
      testCasesRelevancy,
    } = data.value;

    pageContent = (
      <>
        <ProCard direction="column" ghost gutter={[16, 16]}>
          <ProCard gutter={16} ghost>
            <ProCard colSpan={16} ghost direction="column" gutter={[16, 16]}>
              <ProCard title="Description">
                <ChallengeDescription value={descriptionMarkdown} />
              </ProCard>

              <ProCard title="Tests">
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

              {/* <ProCard title="Feedbacks">
                <ProList<Feedback>
                  ghost
                  rowKey={entity => entity.userId}
                  dataSource={feedbacks}
                  split
                  itemLayout="vertical"
                  locale={{
                    emptyText: <NoData />,
                  }}
                />
              </ProCard> */}
            </ProCard>

            <ProCard colSpan={8} ghost direction="column" gutter={[16, 16]}>
              <ProCard title="Created by">
                <Link to={PATH_PROFILES.root + `/${user.id}`}>
                  <Space className="challenge-created-by">
                    <UserAvatar userName={user.username} size="large" />
                    <Typography.Text
                      strong
                      style={{
                        fontSize: 15,
                      }}
                    >
                      {user.username}
                    </Typography.Text>
                  </Space>
                </Link>
              </ProCard>

              <ProCard title="Tags">
                {
                  <>
                    {tags.map(tag => (
                      <Tag key={tag.id}>{tag.name}</Tag>
                    ))}
                  </>
                }
              </ProCard>

              <ProCard
                title="Statistics"
                subTitle={`(${feedbacks.length} ${
                  feedbacks.length === 1 ? 'feedback' : 'feedbacks'
                })`}
              >
                {!feedbacks ||
                  (feedbacks.length === 0 && 'Not enough feedbacks')}
                {feedbacks.length > 0 && (
                  <ProForm submitter={false}>
                    <ProFormRate
                      label="Difficulty"
                      name="difficulty"
                      initialValue={difficulty ?? 0}
                      fieldProps={{
                        allowHalf: true,
                      }}
                      readonly
                    />
                    <ProFormRate
                      label="Fun"
                      name="fun"
                      initialValue={fun ?? 0}
                      fieldProps={{
                        allowHalf: true,
                      }}
                      readonly
                    />
                    <ProFormRate
                      label="Test Cases Relvancy"
                      name="testCasesRelvancy"
                      initialValue={testCasesRelevancy ?? 0}
                      fieldProps={{
                        allowHalf: true,
                      }}
                      readonly
                    />
                  </ProForm>
                )}
              </ProCard>
            </ProCard>
          </ProCard>
        </ProCard>
      </>
    );
  }

  let subTitle: React.ReactNode | undefined = undefined;
  switch (data.value?.status) {
    case ChallengeStatus.Draft:
      subTitle = <Tag color="yellow">Draft</Tag>;
      break;
    case ChallengeStatus.Unpublished:
      subTitle = <Tag color="red">Unpublished</Tag>;
      break;
  }

  return (
    <Page
      loading={isLoading}
      title={data?.value?.name}
      extra={
        <>
          {/* {isAuthenticated &&
            user?.role === Role.Admin &&
            data.value?.status === ChallengeStatus.Published && (
              <UnPublishModal challengeId={data.value!.id} />
            )} */}
          {isAuthenticated && user?.id && user?.id === data?.value?.user.id && (
            <Button onClick={() => navigate(PATH_CHALLENGES.save + `/${id}`)}>
              Edit
            </Button>
          )}
          {/* {data.value?.status === ChallengeStatus.Published && (
            <Button type="primary">Play</Button>
          )} */}
          {data.value &&
            data.value.feedbacks.some(x => x.userId === user?.id) && (
              <FeedbackModalForm challenge={data.value} />
            )}
        </>
      }
      subTitle={subTitle}
    >
      {pageContent}
    </Page>
  );
}

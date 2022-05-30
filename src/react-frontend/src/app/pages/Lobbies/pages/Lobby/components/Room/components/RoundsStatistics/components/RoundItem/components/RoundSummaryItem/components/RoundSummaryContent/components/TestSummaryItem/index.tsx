import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Alert, Tag, Typography } from 'antd';
import { TestSummaryStatus } from 'app/types/enums/testSummaryStatus';
import { TestPair } from 'app/types/models/challenge/testPair';
import { TestSummary } from 'app/types/models/game/testSummary';
import * as React from 'react';

type TestSummaryItemProps = {
  status: TestSummaryStatus;
  reason: string;
  testPair: TestPair;
};

export default function TestSummaryItem(props: TestSummaryItemProps) {
  const { status, reason, testPair } = props;

  return (
    <ProCard
      ghost
      collapsible
      defaultCollapsed
      title={testPair.title}
      direction="column"
      extra={
        status === TestSummaryStatus.Valid ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Passed
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Failed
          </Tag>
        )
      }
    >
      <ProCard title="Case" direction="row" gutter={[8, 0]} ghost>
        <ProCard ghost>
          <Typography.Text>Input:</Typography.Text>
          <Typography.Paragraph>
            <pre
              style={{
                marginTop: 0,
              }}
            >
              {testPair.case?.input}
            </pre>
          </Typography.Paragraph>
        </ProCard>
        <ProCard ghost>
          <Typography.Text>Expected Output:</Typography.Text>
          <Typography.Paragraph>
            <pre
              style={{
                marginTop: 0,
              }}
            >
              {testPair.case?.expectedOutput}
            </pre>
          </Typography.Paragraph>
        </ProCard>
      </ProCard>
      <ProCard title="Validator" direction="row" gutter={[8, 0]} ghost>
        <ProCard ghost>
          <Typography.Text>Input:</Typography.Text>
          <Typography.Paragraph>
            <pre
              style={{
                marginTop: 0,
              }}
            >
              {testPair.validator?.input}
            </pre>
          </Typography.Paragraph>
        </ProCard>
        <ProCard ghost>
          <Typography.Text>Expected Output:</Typography.Text>
          <Typography.Paragraph>
            <pre
              style={{
                marginTop: 0,
              }}
            >
              {testPair.validator?.expectedOutput}
            </pre>
          </Typography.Paragraph>
        </ProCard>
      </ProCard>
      {status !== TestSummaryStatus.Valid && (
        <ProCard title="Reason" direction="column" gutter={[8, 0]} ghost>
          <Alert
            showIcon
            type="error"
            message={`${
              status === TestSummaryStatus.BuildError
                ? 'Build Error'
                : status === TestSummaryStatus.TestFailed
                ? 'Test Case failed'
                : 'Test Validator failed'
            }`}
            description={
              reason && (
                <Typography.Paragraph>
                  <pre>{reason}</pre>
                </Typography.Paragraph>
              )
            }
          />
        </ProCard>
      )}
    </ProCard>
  );
}

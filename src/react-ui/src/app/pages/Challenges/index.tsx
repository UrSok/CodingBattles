import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { Button, Col, Progress, Row, Space, Tag } from 'antd';
import { useChallengeApi } from 'app/api/challenge/challenge';
import { useChallengeTagApi } from 'app/api/challenge/challengeTag';
import React, { useEffect, useState } from 'react';

const dataSource = [
  'The Sky of the Sparrow',
  'Ant Design',
  'Ant Financial Experience Technology',
  'TechUI',
  'TechUI 2.0',
  'Bigfish',
  'Umi',
  'Ant Design Pro',
].map(item => ({
  title: item,
  subTitle: <Tag color=" #5BD8A6 "> Yuque column </Tag>,
  actions: [],
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
  content: (
    <div
      style={{
        flex: 1,
      }}
    >
      <div
        style={{
          width: 200,
        }}
      >
        <div> Publishing </div>
        <Progress percent={80} />
      </div>
    </div>
  ),
}));

export default function Challenges() {
  const { useSearchChallengesMutation } = useChallengeApi();
  const [searchChallenge, { isLoading, isError, data }] =
    useSearchChallengesMutation();

  useEffect(() => {
    searchChallenge({});
  }, []);

  console.log(isLoading);
  console.log(isError);
  console.log(data);

  return (
    <PageContainer
    //content={<p>hellor</p>}
    /*tabList={[
        {
          tab: '基本信息',
          key: 'base',
        },
        {
          tab: '详细信息',
          key: 'info',
        },
      ]}
      extraContent={
        <Space size={24}>
          <Statistic title="Feedback" value={1128} />
          <Statistic title="Unmerged" value={93} suffix="/ 100" />
        </Space>
      }
      extra={[
        <Button key="3">操作</Button>,
        <Button key="2">操作</Button>,
        <Button key="1" type="primary">
          主操作
        </Button>,
      ]}*/
    >
      {/*<Row>
        <Col flex={2}>2 / 5</Col>
        <Col flex={3}>
        </Col>
    </Row>*/}

      <ProList<any>
        toolBarRender={() => {
          return [
            <Button key="add" type="primary">
              new
            </Button>,
          ];
        }}
        onRow={(record: any) => {
          return {
            onMouseEnter: () => {
              console.log(record);
            },
            onClick: () => {
              console.log(record);
            },
          };
        }}
        rowKey="name"
        headerTitle="Base List"
        grid={{ gutter: 16, column: 2 }}
        tooltip="Basic list configuration"
        dataSource={dataSource}
        showActions="hover"
        showExtra="hover"
        metas={{
          title: {},
          avatar: {},
          description: {},
          type: {},
          content: {},
          subTitle: {},
          actions: {},
        }}
      />
    </PageContainer>
  );
}

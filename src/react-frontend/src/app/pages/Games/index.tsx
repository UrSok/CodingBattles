import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm from '@ant-design/pro-form';
import ProList from '@ant-design/pro-list';
import { Avatar, Button, Tooltip } from 'antd';
import Page from 'app/components/Layout/Page';
import React from 'react';

/* 
Code,
Create,
Join
*/

export default function GamesPage() {
  return (
    <Page>
      <ProList
        /*locale={{
        emptyText: <NoData />,
      }}*/
        grid={{ gutter: 16, column: 4 }}
        toolBarRender={() => {
          return [<Button type="dashed">Create</Button>, <Button type="primary">Join private</Button>]
        }}
        headerTitle="Challenges"
        showActions="always"
        showExtra="always"
        dataSource={[
          {
            id: 1,
            name: 'Salue',
            kek: 'Sgfdgfdgdfalue',
          },
          {
            id: 2,
            name: 'Salue3',
            kek: 'Sgfdgfdgfdgfdgdfalue',
          },
          {
            id: 3,
            name: 'Salue3',
            kek: 'Sgfdgfgfdgfddgdfalue',
          },
          {
            id: 3,
            name: 'Salue3',
            kek: 'Sgfdgfgfdgfddgdfalue',
          },
        ]}
        metas={{
          title: {
            dataIndex: 'id',
          },
          content: {
            render: (dom, value, index) => {
              return (
                <Avatar.Group maxCount={5}>
                  <Avatar src="https://joeschmoe.io/api/v1/random" />
                  <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                  <Tooltip title="Ant User" placement="top">
                    <Avatar
                      style={{ backgroundColor: '#87d068' }}
                      icon={<UserOutlined />}
                    />
                  </Tooltip>
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<AntDesignOutlined />}
                  />
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<AntDesignOutlined />}
                  />
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<AntDesignOutlined />}
                  />
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<AntDesignOutlined />}
                  />
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<AntDesignOutlined />}
                  />
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<AntDesignOutlined />}
                  />
                </Avatar.Group>
              );
            },
          },
          actions: {
            render: (dom, value, index) => {
              return [<Button type="primary">Join</Button>];
            },
            cardActionProps: 'extra',
          },
        }}
      />
    </Page>
  );
}

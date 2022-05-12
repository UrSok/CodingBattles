import { PlaySquareTwoTone, PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Avatar, Button, Space, Tag, Typography } from 'antd';
import { challengeApi } from 'app/api';
import { TestPair } from 'app/api/types/challenge';
import ChallengeDescription from 'app/components/ChallengeDescription';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import { Language } from 'app/types/global';
import React, { ReactText, useState } from 'react';

export default function GameInProgress() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>(
    [],
  );

  const { data } = challengeApi.useGetChallengeQuery(
    '6279a8f54965d0de16aabf83',
  );

  return (
    <ProCard direction="column" ghost gutter={[16, 16]}>
      <ProCard gutter={16} ghost>
        <ProCard ghost colSpan={10} direction="column" gutter={[16, 16]}>
          <ProCard
            title="Task"
            bodyStyle={{
              height: '450px',
              overflow: 'scroll',
            }}
          >
            <ChallengeDescription value={data?.value?.descriptionMarkdown} />
          </ProCard>
          <ProCard title="Output"></ProCard>
        </ProCard>
        <ProCard ghost colSpan={14} direction="column" gutter={[16, 16]}>
          <ProCard>
            <Space
              style={{
                marginBottom: '5px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <LanguageSelect
                antdFieldName={'test'}
                width="lg"
                defaultLanguage={Language.javascript}
                placeholder="Solution Language"
              />
              <Space>
                <Button>Run all test cases</Button>
                <Button>Submit solution</Button>
              </Space>
            </Space>
            <CodeEditor
              //editorRef={solutionEditorRef}
              //defaultValue={initialChallenge?.solution.sourceCode}
              language={Language.javascript}
              //onModelChange={handleSolutionInputChanged}
              //readOnly={statusIsNotDraft}
            />
          </ProCard>
          <ProCard gutter={16} ghost>
            <ProCard colSpan={12} direction="column">
              <ProList<TestPair>
                ghost
                split
                expandable={{
                  expandedRowKeys,
                  onExpandedRowsChange: setExpandedRowKeys,
                }}
                metas={{
                  title: {
                    dataIndex: 'title',
                  },
                  subTitle: {
                    render: (dom, test, index) => {
                      return <Tag color="error">Error</Tag>;
                    },
                  },
                  actions: {
                    render: (dom, value, index) => {
                      return <PlaySquareTwoTone />;
                    },
                  },
                  description: {
                    render: (dom, test, index) => {
                      return (
                        <ProCard
                          key={index}
                          direction="row"
                          gutter={[8, 0]}
                          ghost
                        >
                          <ProCard ghost>
                            <Typography.Text>Input:</Typography.Text>
                            <Typography.Paragraph>
                              <pre
                                style={{
                                  marginTop: 0,
                                }}
                              >
                                {test.case?.input}
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
                                {test.case?.expectedOutput}
                              </pre>
                            </Typography.Paragraph>
                          </ProCard>
                        </ProCard>
                      );
                    },
                  },
                }}
                dataSource={[
                  {
                    title: 'Salut',
                    case: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                    validator: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                  },
                  {
                    title: 'Salut 2',
                    case: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                    validator: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                  },
                  {
                    title: 'Salut 3',
                    case: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                    validator: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                  },
                ]}
              ></ProList>
            </ProCard>
            <ProCard colSpan={12} direction="column">
              <ProList
                ghost
                split
                metas={{
                  title: {
                    render: (dom, value, index) => {
                      return <Space>
                        <Avatar>AR</Avatar>
                        gfjdklgjfdlkjkl
                        </Space>
                    },
                  },
                  subTitle: {
                    render: (dom, test, index) => {
                      return <Tag color="error">Error</Tag>;
                    },
                  },
                  actions: {
                    render: (dom, value, index) => {
                      return `Tests: 2/4 - 90%`;
                    },
                  }
                }}
                dataSource={[
                  {
                    title: 'Salut',
                    case: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                    validator: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                  },
                  {
                    title: 'Salut 2',
                    case: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                    validator: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                  },
                  {
                    title: 'Salut 3',
                    case: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                    validator: {
                      input: '1',
                      expectedOutput: '4343',
                    },
                  },
                ]}
              ></ProList>
            </ProCard>
          </ProCard>
        </ProCard>
      </ProCard>
    </ProCard>
  );
}

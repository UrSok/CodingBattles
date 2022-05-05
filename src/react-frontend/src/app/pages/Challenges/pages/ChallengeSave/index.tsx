import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { stubInputLangId } from 'config/monacoconfig';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { getLanguageKeyName, Language } from 'app/utils/types/globalTypes';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { stubGeneratorApi } from 'app/api/stubGenerator';
import ErrorAlert from './components/ErrorAlert';
import { Button, Form, Space } from 'antd';
import {
  DeleteTwoTone,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { red } from '@ant-design/colors';

export default function ChallengeSave() {
  const { id } = useParams();
  const [form] = useForm();
  const [
    triggerGenerateStub,
    { isLoading: isGeneratig, data: generateStubResult },
  ] = stubGeneratorApi.useLazyGenerateStubQuery();
  const selectedStubLang: Language = useWatch('challenge-stub-language', form);
  const selectedSolutionLang: Language = useWatch(
    'challenge-solution-language',
    form,
  );
  const stubInputRef = useRef<any>(null);
  const [emptyStubInput, setEmptyStubInput] = useState(true);

  const triggerStubGeneration = (input: string | undefined) => {
    if (input?.length === 0 || !input) return;

    triggerGenerateStub(
      {
        language: selectedStubLang,
        input: input,
      },
      true,
    );
  };

  const stubInputMounted = (editor, _) => {
    stubInputRef.current = editor;
  };

  useEffect(() => {
    if (stubInputRef !== null && stubInputRef.current !== null) {
      const input: string = stubInputRef.current.getValue();
      triggerStubGeneration(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStubLang]);

  const stubInputChanged = (input: string | undefined, ev) => {
    setEmptyStubInput(!input || input?.length === 0);
    triggerStubGeneration(input);
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '',
      }}
      footer={[
        <Button type="ghost">Save</Button>,
        <Button type="primary">Publish</Button>,
      ]}
    >
      <ProForm form={form} submitter={false}>
        <ProCard
          ghost
          title={
            <Title level={4} style={{ margin: 0 }}>
              General Information
            </Title>
          }
        >
          <ProCard>
            <ProFormText name="challenge-name" placeholder="Title" />
            <ProFormTextArea
              name="challenge-task"
              placeholder="Challenge goal description"
              allowClear
            />
            <ProFormTextArea
              name="challenge-input"
              placeholder="Challenge input description"
              allowClear
            />
            <ProFormTextArea
              name="challenge-output"
              placeholder="Challenge output description"
              allowClear
            />
            <ProFormTextArea
              name="challenge-constraints"
              placeholder="Challenge input constraints"
              allowClear
            />
          </ProCard>
        </ProCard>

        <ProCard
          ghost
          title={
            <Title level={4} style={{ margin: 0 }}>
              Stub
            </Title>
          }
        >
          <ProCard>
            <ProForm.Item label="Stub input:">
              <Space
                direction="vertical"
                style={{
                  width: '100%',
                }}
              >
                <Editor
                  loading={<LoadingSpinner />}
                  height={300}
                  language={stubInputLangId}
                  className="bordered-editor"
                  onChange={stubInputChanged}
                  onMount={stubInputMounted}
                />
                {!emptyStubInput &&
                !generateStubResult?.isSuccess &&
                generateStubResult?.value?.error ? (
                  <ErrorAlert error={generateStubResult!.value?.error!} />
                ) : (
                  ''
                )}
              </Space>
            </ProForm.Item>
            <ProFormSelect
              name="challenge-stub-language"
              placeholder="Generation language"
              width="sm"
              allowClear={false}
              initialValue={getLanguageKeyName(Language.javascript)}
              valueEnum={Language}
            />
            <ProForm.Item label="Result:">
              <Editor
                loading={<LoadingSpinner />}
                height={300}
                language={selectedStubLang}
                defaultValue="// update the stub input to get a result"
                value={
                  generateStubResult?.isSuccess
                    ? generateStubResult?.value?.stub
                    : ''
                }
                options={{
                  readOnly: true,
                }}
                className="bordered-editor"
              />
            </ProForm.Item>
          </ProCard>
        </ProCard>

        <ProCard
          ghost
          title={
            <Title level={4} style={{ margin: 0 }}>
              Tests
            </Title>
          }
        >
          <Form.List name="tests" initialValue={[{}, {}, {}, {}]}>
            {(fields, { add, remove }) => (
              <ProCard ghost split="horizontal" gutter={[16, 16]}>
                {fields.map((field, index) => (
                  <ProCard>
                    <ProCard split="horizontal" ghost>
                      {index > 3 ? (
                        <Space
                          direction="vertical"
                          align="end"
                          style={{
                            marginBottom: '5px',
                          }}
                        >
                          <DeleteTwoTone
                            twoToneColor={red.primary}
                            onClick={() => remove(index)}
                            style={{
                              fontSize: '20px',
                            }}
                          />
                        </Space>
                      ) : (
                        ''
                      )}
                      <ProCard direction="column" ghost className="">
                        <ProCard split="horizontal" ghost>
                          <ProFormText
                            name={[field.name, `test-name-${field.key}`]}
                            initialValue={`Test ${index + 1}`}
                            placeholder="Test name"
                            allowClear={false}
                            rules={[
                              {
                                required: true,
                                message: 'Name is required',
                              },
                            ]}
                          />
                          <ProCard ghost>
                            <ProCard
                              ghost
                              colSpan="50%"
                              style={{
                                paddingRight: '5px',
                              }}
                            >
                              <ProFormTextArea
                                name={[field.name, `test-input-${field.key}`]}
                                placeholder="Test input"
                                allowClear
                                rules={[
                                  {
                                    required: true,
                                    message: 'Input is required',
                                  },
                                ]}
                              />
                            </ProCard>
                            <ProCard
                              ghost
                              colSpan="50%"
                              style={{
                                paddingLeft: '5px',
                              }}
                            >
                              <ProFormTextArea
                                name={[
                                  field.name,
                                  `test-excepted-${field.key}`,
                                ]}
                                placeholder="Test excepted result"
                                allowClear
                                rules={[
                                  {
                                    required: true,
                                    message: 'Excepted result is required',
                                  },
                                ]}
                              />
                            </ProCard>
                          </ProCard>
                        </ProCard>
                        <ProCard split="horizontal" ghost>
                          <ProFormText
                            name={[field.name, `validator-name-${field.key}`]}
                            initialValue={`Validator ${index + 1}`}
                            placeholder="Validator name"
                            allowClear={false}
                            rules={[
                              {
                                required: true,
                                message: 'Name is required',
                              },
                            ]}
                          />
                          <ProCard ghost>
                            <ProCard
                              ghost
                              colSpan="50%"
                              style={{
                                paddingRight: '5px',
                              }}
                            >
                              <ProFormTextArea
                                name={[
                                  field.name,
                                  `validator-input-${field.key}`,
                                ]}
                                placeholder="Validator input"
                                allowClear
                                rules={[
                                  {
                                    required: true,
                                    message: 'Input is required',
                                  },
                                ]}
                              />
                            </ProCard>
                            <ProCard
                              ghost
                              colSpan="50%"
                              style={{
                                paddingLeft: '5px',
                              }}
                            >
                              <ProFormTextArea
                                name={[
                                  field.name,
                                  `validator-excepted-${field.key}`,
                                ]}
                                placeholder="Validator excepted result"
                                allowClear
                                rules={[
                                  {
                                    required: true,
                                    message: 'Excepted result is required',
                                  },
                                ]}
                              />
                            </ProCard>
                          </ProCard>
                        </ProCard>
                      </ProCard>
                    </ProCard>
                  </ProCard>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Add test
                  </Button>
                </Form.Item>
              </ProCard>
            )}
          </Form.List>
        </ProCard>

        <ProCard
          ghost
          title={
            <Title level={4} style={{ margin: 0 }}>
              Solution
            </Title>
          }
        >
          <ProCard>
            <Space
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <ProFormSelect
                name="challenge-solution-language"
                placeholder="Solution language"
                width="sm"
                allowClear={false}
                initialValue={getLanguageKeyName(Language.javascript)}
                valueEnum={Language}
              />
              <Button type="primary">Test Solution</Button>
            </Space>
            <Editor
              loading={<LoadingSpinner />}
              height={300}
              language={selectedSolutionLang}
              className="bordered-editor"

              //onChange={stubInputChanged}
              //onMount={stubInputMounted}
            />
          </ProCard>
        </ProCard>
      </ProForm>
    </PageContainer>
  );
}

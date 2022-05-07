import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { stubInputLangId } from 'config/monacoconfig';
import LoadingSpinner from 'app/components/LoadingSpinner';
import { getLanguageKeyName, Language } from 'app/utils/types/globalTypes';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { stubGeneratorApi } from 'app/api/stubGenerator';
import ErrorAlert from './components/ErrorAlert';
import { Button, Checkbox, Form, Select, Space, Typography } from 'antd';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import ChallengeDescription from 'app/layout/components/Challenges/ChallengeDescription';
import MultiTagSelect from '../../components/MultiTagSelect';
import { challengeApi } from 'app/api/challenge';
import { TestPair } from 'app/api/types/challenge';
import { PATH_CHALLENGES } from 'app/layout/routes/paths';

export default function ChallengeSave() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [triggerSaveChallenge, { isLoading: isSaving, data: savingResult }] =
    challengeApi.useSaveChallengeMutation();
    const [triggerGetChallenge] =
      challengeApi.useLazyGetChallengeQuery();
  const [form] = useForm();
  const [
    triggerGenerateStub,
    { isLoading: isGeneratig, data: generateStubResult },
  ] = stubGeneratorApi.useLazyGenerateStubQuery();
  const selectedStubLang: Language = useWatch('challengeStubLanguage', form);
  const selectedSolutionLang: Language = useWatch(
    'challengeSolutionLanguage',
    form,
  );
  const stubInputRef = useRef<any>(null);
  const solutionInputRef = useRef<any>(null);
  const [emptyStubInput, setEmptyStubInput] = useState(true);
  const challengeMarkdownDescription = useWatch(
    'challengeDescriptionMarkdown',
    form,
  );

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

  const solutionInputMounted = (editor, _) => {
    solutionInputRef.current = editor;
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

  const saveChallenge = async () => {
    const challengeName = form.getFieldValue('challengeName');
    const challengeDescriptionShort = form.getFieldValue(
      'challengeDescriptionShort',
    );
    const challengeTags = form.getFieldValue('challengeTags');
    const challengeDescriptionMarkdown = form.getFieldValue(
      'challengeDescriptionMarkdown',
    );
    const challengeTests: any[] = form.getFieldValue('challengeTests');
    const challengeSolutionLanguage = form.getFieldValue(
      'challengeSolutionLanguage',
    );

    let testPairs: TestPair[] = challengeTests.map(
      (test, index: number): TestPair => ({
        title: test[`testName${index}`],
        case: {
          input: test[`testInput${index}`],
          expectedOutput: test[`testExcepted${index}`],
        },
        validator: {
          input: test[`validatorInput${index}`],
          expectedOutput: test[`validatorExcepted${index}`],
        },
      }),
    );

    const stubInput = stubInputRef?.current?.getValue();
    const solutionInput = solutionInputRef?.current?.getValue();

    const result = await triggerSaveChallenge({
      id: paramId,
      model: {
        name: challengeName,
        descriptionShort: challengeDescriptionShort,
        descriptionMarkdown: challengeDescriptionMarkdown,
        tagIds: challengeTags,
        tests: testPairs,
        stubGeneratorInput: stubInput,
        solution: {
          language: challengeSolutionLanguage,
          sourceCoude: solutionInput,
        },
      },
    }).unwrap();

    if (result?.value !== undefined && result.value !== 'null') {
      navigate(PATH_CHALLENGES.save + `/${result.value}`, { replace: true });
    }
  };

  useEffect(() => {
    if (paramId) {
      triggerGetChallenge(paramId);
    }
  }, []);

  //TODO: THINK HOW TO USE THE USETIMEOUT HOOK
  //const [abortAutoSave, setAbortTimeout] = useState(false);
  //const [autoSave, setAutoSave] = useState(false);

  return (
    <PageContainer
      ghost
      header={{
        title: '',
      }}
      footer={[
        /*<Checkbox onChange={e => setAutoSave(e.target.value)}>
          Auto-save
        </Checkbox>,*/
        <Button type="ghost" onClick={saveChallenge} loading={isSaving}>
          Save
        </Button>,
        <Button type="primary" loading={isSaving}>
          Publish
        </Button>,
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
          <ProCard style={{ marginRight: '3%' }}>
            <ProFormText name="challengeName" placeholder="Title" />
            <ProFormTextArea
              name="challengeDescriptionShort"
              placeholder="Challenge short description"
              allowClear
            />
            <MultiTagSelect name="challengeTags" />
          </ProCard>
        </ProCard>

        <ProCard
          ghost
          title={
            <Title level={4} style={{ margin: 0 }}>
              Descritpion
            </Title>
          }
        >
          <ProCard>
            <ProCard ghost split="vertical">
              <ProCard
                ghost
                style={{
                  paddingRight: '5px',
                }}
              >
                <ProFormTextArea
                  label={<Typography.Text strong>Input</Typography.Text>}
                  name="challengeDescriptionMarkdown"
                  placeholder="Challenge description"
                  fieldProps={{
                    autoSize: { minRows: 2 },
                  }}
                />
              </ProCard>
              <ProCard
                ghost
                style={{
                  paddingLeft: '5px',
                }}
              >
                <Typography.Text strong>Preview</Typography.Text>
                <ChallengeDescription
                  descriptionMarkdown={challengeMarkdownDescription}
                />
              </ProCard>
            </ProCard>
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
            <ProForm.Item
              label={<Typography.Text strong>Input</Typography.Text>}
            >
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
              name="challengeStubLanguage"
              placeholder="Generation language"
              width="sm"
              allowClear={false}
              initialValue={getLanguageKeyName(Language.javascript)}
              valueEnum={Language}
            />
            <ProForm.Item
              label={<Typography.Text strong>Result</Typography.Text>}
            >
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
          <Form.List name="challengeTests" initialValue={[{}, {}, {}, {}]}>
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
                      <ProCard direction="column" ghost>
                        <ProCard split="horizontal" ghost>
                          <ProFormText
                            name={[field.name, `testName${field.key}`]}
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
                                name={[field.name, `testInput${field.key}`]}
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
                                name={[field.name, `testExcepted${field.key}`]}
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
                                  `validatorInput${field.key}`,
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
                                  `validatorExcepted${field.key}`,
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
                name="challengeSolutionLanguage"
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
              onMount={solutionInputMounted}
            />
          </ProCard>
        </ProCard>
      </ProForm>
    </PageContainer>
  );
}

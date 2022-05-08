import { red } from '@ant-design/colors';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Space, Typography } from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { challengeApi } from 'app/api/challenge';
import { stubGeneratorApi } from 'app/api/stubGenerator';
import { Challenge, TestPair } from 'app/api/types/challenge';
import CodeEditor from 'app/components/CodeEditor';
import LanguageSelect from 'app/components/Fields/LanguageSelect';
import ChallengeDescription from 'app/components/ChallengeDescription';
import { PATH_CHALLENGES } from 'app/layout/routes/paths';
import { Language } from 'app/types/global';
import { stubInputLang } from 'config/monaco';
import monaco from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MultiTagSelect from '../../components/MultiTagSelect';
import ErrorAlert from './components/ErrorAlert';
import FormCardSection from './components/FormCardSection';
import { ChallengeSaveFields } from './utils/ChallengeSaveFields';

export default function ChallengeSave() {
  const { id: paramId } = useParams();

  const navigate = useNavigate();
  const [form] = useForm();

  const [saveButtonsDisabled, setSaveButtonsDisabled] = useState(false);

  const [triggerGenerateStub, { data: generateStubResult }] =
    stubGeneratorApi.useLazyGenerateStubQuery();
  const [triggerGetChallenge] = challengeApi.useLazyGetChallengeQuery();
  const [triggerSaveChallenge, { isLoading: isSaving, data: savingResult }] =
    challengeApi.useSaveChallengeMutation();

  const [emptyStubInput, setEmptyStubInput] = useState(true);

  const selectedStubLang: Language = useWatch(
    ChallengeSaveFields.stubLanguage,
    form,
  );
  const selectedSolutionLang: Language = useWatch(
    ChallengeSaveFields.solutionLanguage,
    form,
  );
  const challengeMarkdownDescription = useWatch(
    ChallengeSaveFields.descriptionMarkdown,
    form,
  );

  const stubInputEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const solutionInputEditorRef =
    useRef<monaco.editor.IStandaloneCodeEditor>(null);

  useEffect(() => {
    const getChallengeAsync = async () => {
      if (paramId) {
        return await triggerGetChallenge(paramId).unwrap();
      }
    };
    getChallengeAsync().then(result => {
      if (!result || !result.isSuccess || !result.value) return;
      setSaveButtonsDisabled(true);
      const {
        name,
        descriptionShort,
        descriptionMarkdown,
        tagIds,
        stubGeneratorInput,
        tests,
        solution,
      } = result.value;

      const testPairs = tests.map((value, index) => {
        return {
          [`${ChallengeSaveFields.testName}${index}`]: value.title,
          [`${ChallengeSaveFields.testInput}${index}`]: value.case?.input,
          [`${ChallengeSaveFields.testExcepted}${index}`]:
            value.case?.expectedOutput,
          [`${ChallengeSaveFields.validatorInput}${index}`]:
            value.validator?.input,
          [`${ChallengeSaveFields.validatorExcepted}${index}`]:
            value.validator?.expectedOutput,
        };
      });

      form.setFieldsValue({
        [`${ChallengeSaveFields.name}`]: name,
        [`${ChallengeSaveFields.descriptionShort}`]: descriptionShort,
        [`${ChallengeSaveFields.descriptionMarkdown}`]: descriptionMarkdown,
        [`${ChallengeSaveFields.tags}`]: tagIds,
        [`${ChallengeSaveFields.tests}`]: testPairs,
        [`${ChallengeSaveFields.solutionLanguage}`]: solution.language,
      });

      stubInputEditorRef.current?.setValue(stubGeneratorInput);
      solutionInputEditorRef.current?.setValue(solution.sourceCode ?? '');
    });
  }, []);

  useEffect(() => {
    if (stubInputEditorRef !== null && stubInputEditorRef.current !== null) {
      const input: string = stubInputEditorRef.current.getValue();
      triggerStubGeneration(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStubLang]);

  const triggerStubGeneration = async (input: string | undefined) => {
    if (input?.length === 0 || !input) return;
    await triggerGenerateStub(
      {
        language: selectedStubLang,
        input: input,
      },
      true,
    );
  };

  const stubInputChanged = async (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setEmptyStubInput(!value || value?.length === 0);
    triggerStubGeneration(value);
    setSaveButtonsDisabled(false);
  };

  const solutionInputChanged = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setSaveButtonsDisabled(false);
  };

  const saveChallenge = async () => {
    const challengeName = form.getFieldValue(ChallengeSaveFields.name);
    const challengeDescriptionShort = form.getFieldValue(
      ChallengeSaveFields.descriptionShort,
    );
    const challengeTags = form.getFieldValue(ChallengeSaveFields.tags);
    const challengeDescriptionMarkdown = form.getFieldValue(
      ChallengeSaveFields.descriptionMarkdown,
    );
    const challengeTests: any[] = form.getFieldValue(ChallengeSaveFields.tests);
    const challengeSolutionLang = form.getFieldValue(
      ChallengeSaveFields.solutionLanguage,
    );

    let testPairs: TestPair[] = challengeTests.map(
      (test, index: number): TestPair => ({
        title: test[`${ChallengeSaveFields.testName}${index}`],
        case: {
          input: test[`${ChallengeSaveFields.testInput}${index}`],
          expectedOutput: test[`${ChallengeSaveFields.testExcepted}${index}`],
        },
        validator: {
          input: test[`${ChallengeSaveFields.validatorInput}${index}`],
          expectedOutput:
            test[`${ChallengeSaveFields.validatorExcepted}${index}`],
        },
      }),
    );

    const stubInput = stubInputEditorRef?.current?.getValue() ?? '';
    const solutionInput = solutionInputEditorRef?.current?.getValue();

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
          language: challengeSolutionLang,
          sourceCode: solutionInput,
        },
      },
    }).unwrap();

    if (result?.value !== undefined && result.value !== 'null') {
      setSaveButtonsDisabled(true);
      if (!paramId) {
        navigate(PATH_CHALLENGES.save + `/${result.value}`, { replace: true });
      }
    }
  };

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
        <Button
          type="ghost"
          onClick={saveChallenge}
          loading={isSaving}
          disabled={saveButtonsDisabled}
        >
          Save
        </Button>,
        <Button
          type="primary"
          loading={isSaving}
          disabled={saveButtonsDisabled}
        >
          Publish
        </Button>,
      ]}
    >
      <ProForm form={form} submitter={false}>
        <FormCardSection title="General Information">
          <ProFormText name={ChallengeSaveFields.name} placeholder="Title" />
          <ProFormTextArea
            name={ChallengeSaveFields.descriptionShort}
            placeholder="Challenge short description"
          />
          <MultiTagSelect name={ChallengeSaveFields.tags} />
        </FormCardSection>

        <FormCardSection title="Description">
          <ProFormTextArea
            name={ChallengeSaveFields.descriptionMarkdown}
            placeholder="Challenge description"
            fieldProps={{
              autoSize: { minRows: 2 },
            }}
          />
          <Typography.Text strong>Preview</Typography.Text>
          <ChallengeDescription
            descriptionMarkdown={challengeMarkdownDescription}
          />
        </FormCardSection>

        <FormCardSection title="Stub Generator">
          <Space
            direction="vertical"
            style={{
              width: '100%',
            }}
          >
            <CodeEditor
              editorRef={stubInputEditorRef}
              language={stubInputLang}
              onModelChange={stubInputChanged}
            />

            {!emptyStubInput &&
            !generateStubResult?.isSuccess &&
            generateStubResult?.value?.error ? (
              <ErrorAlert error={generateStubResult!.value?.error!} />
            ) : (
              ''
            )}
          </Space>
          <Typography.Text strong>Result</Typography.Text>
          <LanguageSelect
            antdFieldName={ChallengeSaveFields.stubLanguage}
            placeholder="Generation language"
            width="sm"
            defaultLanguage={Language.javascript}
            style={{
              marginBottom: '5px',
            }}
          />
          <CodeEditor
            language={selectedStubLang}
            defaultValue="// update the stub input to get a result"
            value={
              generateStubResult?.isSuccess
                ? generateStubResult?.value?.stub
                : ''
            }
            readOnly
          />
        </FormCardSection>

        <FormCardSection title="Tests" ghost>
          <Form.List
            name={ChallengeSaveFields.tests}
            initialValue={[{}, {}, {}, {}]}
          >
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
                            name={[
                              field.name,
                              `${ChallengeSaveFields.testName}${field.key}`,
                            ]}
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
                                name={[
                                  field.name,
                                  `${ChallengeSaveFields.testInput}${field.key}`,
                                ]}
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
                                  `${ChallengeSaveFields.testExcepted}${field.key}`,
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
                                  `${ChallengeSaveFields.validatorInput}${field.key}`,
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
                                  `${ChallengeSaveFields.validatorExcepted}${field.key}`,
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
        </FormCardSection>

        <FormCardSection title="Solution">
          <Space
            style={{
              marginBottom: '5px',
            }}
          >
            <LanguageSelect
              antdFieldName={ChallengeSaveFields.solutionLanguage}
              placeholder="Solution language"
              width="sm"
              defaultLanguage={Language.javascript}
            />
            <Button type="primary">Test Solution</Button>
          </Space>
          <CodeEditor
            editorRef={solutionInputEditorRef}
            language={selectedSolutionLang}
            onModelChange={solutionInputChanged}
          />
        </FormCardSection>
      </ProForm>
    </PageContainer>
  );
}

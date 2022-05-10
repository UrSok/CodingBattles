import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import { Alert, Button, Form, notification, Space, Typography } from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { challengeApi } from 'app/api/challenge';
import { Challenge, ChallengeStatus, TestPair } from 'app/api/types/challenge';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import MultiTagSelect from 'app/pages/Challenges/components/MultiTagSelect';
import { PATH_CHALLENGES } from 'app/routes/paths';
import { Language } from 'app/types/global';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveFields } from '../../types';
import CardSection from '../../../../../../components/CardSection';
import monaco from 'monaco-editor';
import ProCard from '@ant-design/pro-card';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import MarkdownDescriptionEditor, {
  MarkdownEditorRef,
} from './components/MarkdownDescriptionEditor';

import { useEffectOnce, useBoolean } from 'usehooks-ts';
import StubGenerator from './components/StubGenerator';

import { FieldData } from 'rc-field-form/es/interface';

type SaveFormProps = {
  challenge?: Challenge;
};

export default function SaveForm(props: SaveFormProps) {
  const { challenge: initialChallenge } = props;
  const statusIsNotDraft = initialChallenge
    ? initialChallenge.status !== ChallengeStatus.Draft
    : false;

  const navigate = useNavigate();
  const [form] = useForm();

  const solutionLanguage: Language = useWatch(
    SaveFields.solutionLanguage,
    form,
  );

  const markdownEditorRef = useRef<MarkdownEditorRef>(null);
  const stubEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const solutionEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const [triggerSaveChallenge, { isLoading: isSaving, data: savingResult }] =
    challengeApi.useSaveChallengeMutation();

  const {
    value: saveState,
    setFalse: saveStateDisable,
    setTrue: saveStateEnable,
  } = useBoolean(true);

  const saveStateEnableDecorated = () => {
    const nameFieldValue = form.getFieldValue([SaveFields.name]);
    if (!nameFieldValue) {
      saveStateDisable();
      return;
    }

    saveStateEnable();
  };

  useEffectOnce(() => {
    saveStateDisable();

    if (!initialChallenge) return;

    const {
      name,
      tagIds,
      descriptionShort,
      descriptionMarkdown,
      stubGeneratorInput,
      tests,
      solution,
    } = initialChallenge;

    const testPairs = tests.map((value, index) => {
      return {
        [`${SaveFields.testName}${index}`]: value.title,
        [`${SaveFields.testInput}${index}`]: value.case?.input,
        [`${SaveFields.testExcepted}${index}`]: value.case?.expectedOutput,
        [`${SaveFields.validatorInput}${index}`]: value.validator?.input,
        [`${SaveFields.validatorExcepted}${index}`]:
          value.validator?.expectedOutput,
      };
    });

    stubEditorRef?.current?.setValue(stubGeneratorInput);

    form.setFieldsValue({
      [`${SaveFields.name}`]: name,
      [`${SaveFields.descriptionShort}`]: descriptionShort,
      [`${SaveFields.tags}`]: tagIds,
      [`${SaveFields.descriptionMarkdown}`]: descriptionMarkdown,
      [`${SaveFields.tests}`]: testPairs,
      [`${SaveFields.solutionLanguage}`]: solution.language,
    });
  });

  useEffect(() => {
    if (
      savingResult &&
      savingResult.value !== undefined &&
      savingResult.value !== 'null'
    ) {
      saveStateDisable();
      if (!initialChallenge) {
        navigate(PATH_CHALLENGES.save + `/${savingResult.value}`, {
          replace: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savingResult]);

  const handleSolutionInputChanged = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    saveStateEnableDecorated();
  };

  const handleSaveChallenge = async () => {
    const challengeName = form.getFieldValue(SaveFields.name);
    const challengeDescriptionShort = form.getFieldValue(
      SaveFields.descriptionShort,
    );
    const challengeTags = form.getFieldValue(SaveFields.tags);
    const challengeTests: any[] = form.getFieldValue(SaveFields.tests);

    const testPairs: TestPair[] = challengeTests.map(
      (test, index: number): TestPair => ({
        title: test[`${SaveFields.testName}${index}`],
        case: {
          input: test[`${SaveFields.testInput}${index}`],
          expectedOutput: test[`${SaveFields.testExcepted}${index}`],
        },
        validator: {
          input: test[`${SaveFields.validatorInput}${index}`],
          expectedOutput: test[`${SaveFields.validatorExcepted}${index}`],
        },
      }),
    );

    const descriptionInput = markdownEditorRef?.current?.value;
    const stubInput = stubEditorRef?.current?.getValue() ?? '';
    const solutionInput = solutionEditorRef?.current?.getValue();

    triggerSaveChallenge({
      id: initialChallenge?.id,
      model: {
        name: challengeName,
        descriptionShort: challengeDescriptionShort,
        descriptionMarkdown: descriptionInput ?? '',
        tagIds: challengeTags,
        tests: testPairs,
        stubGeneratorInput: stubInput,
        solution: {
          language: solutionLanguage,
          sourceCode: solutionInput,
        },
      },
    });
  };

  const handleFieldsChanged = (
    changedFields: FieldData[],
    allFields: FieldData[],
  ) => {
    if (changedFields.every(x => x.name.toString() === SaveFields.stubLanguage))
      return;

    saveStateEnableDecorated();
  };

  const handleOnPublish = async (values: any) => {
    form.validateFields([
      SaveFields.name,
      SaveFields.tags,
      SaveFields.descriptionShort,
      SaveFields.descriptionMarkdown,
      SaveFields.stubGenerator,
      SaveFields.tests,
      SaveFields.solutionIsValid,
    ]);
  };

  return (
    <>
      {initialChallenge?.status === ChallengeStatus.Unpublished ? (
        <Alert
          showIcon
          type="warning"
          message="This challenge was unpublished!"
          description={
            <>
              <Typography.Text strong>Reason: </Typography.Text>
              {initialChallenge?.statusReason}
            </>
          }
        />
      ) : initialChallenge?.status === ChallengeStatus.Published ? (
        <Alert
          showIcon
          type="success"
          message="This challenge is already published!"
          description="You won't be able to modify the tests, stub input or solution."
        />
      ) : (
        <Alert
          showIcon
          closable
          type="info"
          message="Please ensure that everything is validated!"
          description="You won't be able to modify the tests, stub input or solution after you publish the challenge."
        />
      )}
      <ProForm
        form={form}
        submitter={false}
        onFieldsChange={handleFieldsChanged}
        onFinish={handleOnPublish}
        scrollToFirstError
      >
        <CardSection title="General Information">
          <Typography.Text strong>Title</Typography.Text>
          <ProFormText
            name={SaveFields.name}
            placeholder="Name"
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
            ]}
          />
          <Typography.Text strong>Tags</Typography.Text>
          <MultiTagSelect name={SaveFields.tags} requiredRule />
          <Typography.Text strong>Short Description</Typography.Text>
          <ProFormTextArea
            name={SaveFields.descriptionShort}
            placeholder="Challenge short description"
            rules={[
              {
                required: true,
                message: 'Short description is required',
              },
            ]}
          />
          <Typography.Text strong>Description</Typography.Text>
          <Form.Item
            name={SaveFields.descriptionMarkdown}
            rules={[
              {
                required: true,
                message: 'Description is required',
              },
            ]}
          >
            <MarkdownDescriptionEditor
              editorRef={markdownEditorRef}
              initialValue={initialChallenge?.descriptionMarkdown}
              inputChanged={(value: string | undefined) => {
                saveStateEnableDecorated();
                if (!value || value.length === 0) {
                  form.setFields([
                    {
                      name: SaveFields.descriptionMarkdown,
                      errors: ['Description is required'],
                      value: undefined,
                    },
                  ]);
                  return;
                }

                form.setFields([
                  {
                    name: SaveFields.descriptionMarkdown,
                    errors: [],
                    value: 'nice',
                  },
                ]);
              }}
            />
          </Form.Item>
        </CardSection>

        <CardSection title="Stub Generator">
          <Form.Item
            name={SaveFields.stubGenerator}
            rules={[
              {
                required: true,
                message: 'A valid stub input is required',
              },
            ]}
          >
            <StubGenerator
              stubCodeEditorRef={stubEditorRef}
              initialValue={initialChallenge?.stubGeneratorInput}
              onStubInputChangedDecorator={() => saveStateEnableDecorated()}
              onResultChanged={(stub, isValid) => {
                if (!isValid) {
                  form.setFields([
                    {
                      name: SaveFields.stubGenerator,
                      errors: ['A valid stub input is required'],
                      value: undefined,
                    },
                  ]);
                  return;
                }

                form.setFields([
                  {
                    name: SaveFields.stubGenerator,
                    errors: [],
                    value: 'nice',
                  },
                ]);
              }}
            />
          </Form.Item>
        </CardSection>

        <CardSection title="Tests" ghost>
          <Form.List name={SaveFields.tests} initialValue={[{}, {}, {}, {}]}>
            {(fields, { add, remove }) => (
              <ProCard ghost split="horizontal" gutter={[16, 16]}>
                {fields.map((field, index) => (
                  <ProCard key={field.key}>
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
                              `${SaveFields.testName}${field.key}`,
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
                                  `${SaveFields.testInput}${field.key}`,
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
                                  `${SaveFields.testExcepted}${field.key}`,
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
                                  `${SaveFields.validatorInput}${field.key}`,
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
                                  `${SaveFields.validatorExcepted}${field.key}`,
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
        </CardSection>

        <CardSection title="Solution">
          <Form.Item
            name={SaveFields.solutionIsValid}
            rules={[
              {
                required: true,
                message: 'A valid solution is required',
              },
            ]}
          >
            <Space
              style={{
                marginBottom: '5px',
              }}
            >
              <LanguageSelect
                antdFieldName={SaveFields.solutionLanguage}
                placeholder="Solution language"
                width="sm"
                defaultLanguage={Language.javascript}
                readOnly={statusIsNotDraft}
              />
              <Button type="primary">Test Solution</Button>
            </Space>
            <CodeEditor
              editorRef={solutionEditorRef}
              defaultValue={initialChallenge?.solution.sourceCode}
              language={solutionLanguage}
              onModelChange={handleSolutionInputChanged}
              readOnly={statusIsNotDraft}
            />
          </Form.Item>
        </CardSection>
      </ProForm>

      <FooterToolbar>
        {/*<Checkbox onChange={e => setAutoSave(e.target.value)}>
          Auto-save
        </Checkbox>,*/}
        <Button
          type="ghost"
          onClick={handleSaveChallenge}
          loading={isSaving}
          disabled={!saveState}
        >
          Save
        </Button>
        {initialChallenge &&
        initialChallenge.status !== ChallengeStatus.Published ? (
          <Button
            type="primary"
            disabled={saveState}
            onClick={() => form.submit()}
          >
            Publish
          </Button>
        ) : null}
      </FooterToolbar>
    </>
  );
}

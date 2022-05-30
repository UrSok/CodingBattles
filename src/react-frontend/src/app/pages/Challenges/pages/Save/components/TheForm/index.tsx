import { red } from '@ant-design/colors';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import { Alert, Button, Form, message, Space, Typography } from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { NamePath } from 'antd/lib/form/interface';
import { gameApi } from 'app/api';
import { challengeApi } from 'app/api/challenge';
import { RunTestResult } from 'app/api/game/types/runTest';
import { ResultValue } from 'app/api/types';

import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import MultiTagSelect from 'app/pages/Challenges/components/MultiTagSelect';
import { PATH_CHALLENGES } from 'app/routes/paths';
import { ChallengeStatus } from 'app/types/enums/challengeStatus';
import { ErrorCode } from 'app/types/enums/errorCode';
import { Language } from 'app/types/enums/language';
import { Challenge } from 'app/types/models/challenge/challenge';
import { TestPair } from 'app/types/models/challenge/testPair';
import { getLanguageKeyName } from 'app/utils/enumHelpers';
import monaco from 'monaco-editor';
import { FieldData } from 'rc-field-form/es/interface';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoolean, useEffectOnce } from 'usehooks-ts';
import CardSection from '../../../../../../components/CardSection';
import ChallengeStatusAlert from './components/ChallengeStatusAlert';
import MarkdownDescriptionEditor, {
  MarkdownEditorRef,
} from './components/MarkdownDescriptionEditor';
import StubGenerator from './components/StubGenerator';
import { FormFields, FormType } from './types';

type Props = {
  challenge?: Challenge;
};

export default function TheForm(props: Props) {
  const { challenge: initialChallenge } = props;
  const statusIsNotDraft = initialChallenge
    ? initialChallenge.status !== ChallengeStatus.Draft
    : false;

  const navigate = useNavigate();
  const [form] = useForm();
  const formRef = useRef<ProFormInstance<FormType>>();

  const solutionLanguage: Language = useWatch(
    FormFields.solutionLanguage,
    form,
  );

  const markdownEditorRef = useRef<MarkdownEditorRef>();
  const stubEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const solutionEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const [trigerTestSolution, { isLoading: isTesting }] =
    gameApi.useRunTestMutation();

  const [triggerSaveChallenge, { isLoading: isSaving, data: savingResult }] =
    challengeApi.useSaveChallengeMutation();

  const [triggerPublishChallenge, { isLoading: isPublishing }] =
    challengeApi.usePublishChallengeMutation();

  const [solutionErrorAlert, setSolutionErrorAlert] =
    useState<React.ReactNode>(undefined);

  const {
    value: testSolutionButtonState,
    setFalse: disableTestSolutionButton,
    setTrue: enableTestSolutionButton,
  } = useBoolean(true);

  const {
    value: saveState,
    setFalse: saveStateDisable,
    setTrue: saveStateEnable,
  } = useBoolean(true);

  const saveStateEnableDecorated = () => {
    if (
      !formRef ||
      !formRef.current ||
      !formRef.current.getFieldFormatValueObject
    )
      return;

    const result = formRef.current.getFieldFormatValueObject(FormFields.name);
    if (!result.name) return;

    saveStateEnable();
  };

  useEffectOnce(() => {
    saveStateDisable();
    formRef.current?.validateFields([FormFields.name]);

    if (!initialChallenge) return;

    const {
      name,
      tags,
      descriptionShort,
      descriptionMarkdown,
      stubGeneratorInput,
      tests,
      solution,
    } = initialChallenge;

    stubEditorRef.current?.setValue(stubGeneratorInput);

    formRef.current?.setFieldsValue({
      name: name,
      tags: tags.map(tag => tag.id),
      descriptionShort: descriptionShort,
      descriptionMarkdown: descriptionMarkdown,
      stubLanguage: getLanguageKeyName(Language.javascript),
      stubInput: stubGeneratorInput,
      tests: tests,
      solutionLanguage: solution
        ? getLanguageKeyName(Language[solution.language])
        : getLanguageKeyName(Language.javascript),
      solutionStatus: solution.sourceCode ? 'Invalid' : 'Empty',
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

  const handleMarkdownInputChanged = (value: string | undefined) => {
    saveStateEnableDecorated();
    formRef.current?.setFields([
      {
        name: FormFields.descriptionMarkdown,
        errors: value ? [] : ['Description is required'],
        value: value,
      },
    ]);
  };

  const handleStubInputChangedDecorator = (value: string | undefined) => {
    saveStateEnableDecorated();
  };

  const handleGenerateStubResultChanged = (
    stubInput: string | undefined,
    _: string | undefined,
    isValid: boolean,
  ) => {
    formRef.current?.setFields([
      {
        name: FormFields.stubInput,
        errors: !isValid ? ['A valid stub input is required'] : [],
        value: stubInput,
      },
    ]);
  };

  const handleSolutionInputChanged = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    formRef.current?.setFieldsValue({
      solutionStatus: value && value.length > 0 ? 'Invalid' : 'Empty',
    });
    if (!value || value.length === 0) {
      disableTestSolutionButton();
    } else {
      enableTestSolutionButton();
    }
    saveStateEnableDecorated();
  };

  const handleFieldsChanged = (changedFields: FieldData[], _: FieldData[]) => {
    if (
      changedFields.every(
        x =>
          x.name.toString() === FormFields.stubLanguage ||
          x.name.toString() === FormFields.solutionStatus,
      )
    )
      return;

    if (
      changedFields.some(
        x =>
          x.name.toString().includes(FormFields.tests) ||
          x.name.toString() === FormFields.solutionLanguage,
      )
    ) {
      enableTestSolutionButton();
      formRef.current?.setFieldsValue({
        solutionStatus: 'Invalid',
      });
    }

    saveStateEnableDecorated();
  };

  const returnTestsIfTheyAreValid = async (): Promise<FormType | undefined> => {
    if (!formRef || !formRef.current || !formRef.current.getFieldsFormatValue)
      return;

    const testsLength =
      formRef.current.getFieldsFormatValue(true)?.tests?.length;

    const testsFields: NamePath[] = [];

    for (let i = 0; i < testsLength; i++) {
      testsFields.push([FormFields.tests, i, FormFields.testTitle]);
      testsFields.push([FormFields.tests, i, ...FormFields.caseInput]);
      testsFields.push([FormFields.tests, i, ...FormFields.caseExpectedOutput]);
      testsFields.push([FormFields.tests, i, ...FormFields.validatorInput]);
      testsFields.push([
        FormFields.tests,
        i,
        ...FormFields.validatorExpectedOutput,
      ]);
    }

    try {
      return await formRef.current.validateFields(testsFields);
    } catch (ex) {
      return;
    }
  };

  const handleFailedTest = (
    testPair: TestPair,
    testResult: ResultValue<RunTestResult>,
  ) => {
    formRef.current?.setFields([
      {
        name: FormFields.solutionStatus,
        value: 'Invalid',
      },
    ]);

    const errorCode = testResult.errors?.at(0)?.name;

    if (errorCode === ErrorCode.BuildError) {
      setSolutionErrorAlert(
        <Alert
          showIcon
          type="error"
          message={`${testPair.title} failed with the following BUILD error`}
          description={<pre>{testResult.value?.outputError}</pre>}
        />,
      );
      return;
    }

    const testType =
      errorCode === ErrorCode.TestNotPassed ? 'test' : 'validator';
    const expectedOutput =
      errorCode === ErrorCode.TestNotPassed
        ? testPair.case?.expectedOutput
        : testPair.validator?.expectedOutput;

    setSolutionErrorAlert(
      <Alert
        showIcon
        type="error"
        message={`${testPair.title} failed with the following ${testType} error`}
        description={
          <Space direction="vertical">
            <Typography.Paragraph>
              <Typography.Text strong>Expected output:</Typography.Text>
              <pre style={{ marginTop: 0 }}>{expectedOutput}</pre>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text strong>Actual output:</Typography.Text>
              <pre style={{ marginTop: 0 }}>
                {testResult.value?.outputError}
              </pre>
            </Typography.Paragraph>
          </Space>
        }
      />,
    );
  };

  const handleOnTestSolutionClick = async () => {
    if (!formRef || !formRef.current) return;

    const data = await returnTestsIfTheyAreValid();
    if (!data) return;

    if (!solutionEditorRef.current?.getValue()) {
      formRef.current.setFields([
        {
          name: FormFields.solutionStatus,
          value: 'Empty',
        },
      ]);
      return;
    }

    const { tests } = data;

    disableTestSolutionButton();
    for (const { index, value: test } of tests.map((value, index) => ({
      value,
      index,
    }))) {
      const messageKey = test.title + index;
      message.loading({
        content: (
          <>
            <Typography.Text strong>{test.title}</Typography.Text> is being
            tested
          </>
        ),
        duration: 0,
        key: messageKey,
      });

      const runResult = await trigerTestSolution({
        id: index.toString(),
        test: test,
        solution: {
          language: solutionLanguage,
          sourceCode: solutionEditorRef.current?.getValue() ?? '',
        },
      }).unwrap();

      if (runResult.isSuccess === false) {
        message.error({
          content: (
            <>
              <Typography.Text strong>{test.title}</Typography.Text> test failed
            </>
          ),
          duration: 2,
          key: messageKey,
        });

        handleFailedTest(test, runResult);
        return;
      }

      message.success({
        content: (
          <>
            <Typography.Text strong>{test.title}</Typography.Text> test
            succeeded
          </>
        ),
        duration: 2,
        key: messageKey,
      });
    }

    setSolutionErrorAlert(undefined);
    message.success({
      content: (
        <>
          <Typography.Text strong>Congratulations!</Typography.Text> All tests
          have passed.
        </>
      ),
      duration: 5,
    });

    formRef.current?.setFieldsValue({
      solutionStatus: 'Valid',
    });
  };

  const handleSaveChallenge = async () => {
    if (!formRef || !formRef.current || !formRef.current.getFieldsFormatValue)
      return;
    const data = formRef.current?.getFieldsFormatValue(true);

    const solutionInput = solutionEditorRef?.current?.getValue();

    triggerSaveChallenge({
      id: initialChallenge?.id,
      model: {
        name: data.name,
        descriptionShort: data.descriptionShort,
        descriptionMarkdown: data.descriptionMarkdown ?? '',
        tagIds: data.tags,
        tests: data.tests,
        stubGeneratorInput: data.stubInput,
        solution: {
          language: data.solutionLanguage,
          sourceCode: solutionInput,
        },
      },
    });
  };

  const handleOnPublish = async (values: FormType) => {
    message.loading({
      content: 'Publishing challenge',
      key: 'pub',
      duration: 0,
    });
    const result = await triggerPublishChallenge(initialChallenge!.id).unwrap();

    if (!result.isSuccess) {
      message.error({
        content: 'An error occurred',
        key: 'pub',
        duration: 3,
      });
      return;
    }

    message.success({
      content: 'Challenge published',
      key: 'pub',
      duration: 3,
    });

    navigate(PATH_CHALLENGES.root + `/${initialChallenge?.id}`);
  };

  const handleOnPublishFailed = async errorInfo => {
    message.error({
      content: 'Some mandatory checks failed!',
      duration: 5,
    });
  };

  return (
    <>
      <ChallengeStatusAlert
        status={initialChallenge?.status}
        statusReason={initialChallenge?.statusReason}
      />
      <ProForm<FormType>
        form={form}
        formRef={formRef}
        submitter={false}
        onFieldsChange={handleFieldsChanged}
        //onValuesChange={(_, values) => console.log(values)}
        onFinishFailed={handleOnPublishFailed}
        onFinish={handleOnPublish}
        scrollToFirstError={{
          scrollMode: 'always',
          behavior: 'smooth',
        }}
      >
        <CardSection title="General Information">
          <Typography.Text strong>Title</Typography.Text>
          <ProFormText
            name={FormFields.name}
            placeholder="Name"
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
            ]}
            allowClear={false}
          />
          <Typography.Text strong>Tags</Typography.Text>
          <MultiTagSelect name={FormFields.tags} requiredRule />
          <Typography.Text strong>Short Description</Typography.Text>
          <ProFormTextArea
            name={FormFields.descriptionShort}
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
            name={FormFields.descriptionMarkdown}
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
              inputChanged={handleMarkdownInputChanged}
            />
          </Form.Item>
        </CardSection>

        <CardSection title="Stub Generator">
          <Form.Item
            name={FormFields.stubInput}
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
              onStubInputChangedDecorator={handleStubInputChangedDecorator}
              onResultChanged={handleGenerateStubResultChanged}
              disabled={statusIsNotDraft}
            />
          </Form.Item>
        </CardSection>

        <CardSection title="Tests" ghost>
          <Form.List name={FormFields.tests} initialValue={[{}, {}, {}, {}]}>
            {(fields, { add, remove }) => (
              <ProCard ghost split="horizontal" gutter={[16, 16]}>
                {fields.map((field, index) => (
                  <ProCard key={field.key}>
                    <ProCard split="horizontal" ghost>
                      {index > 3 && !statusIsNotDraft ? (
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
                            name={[index, FormFields.testTitle]}
                            initialValue={`Test ${index + 1}`}
                            placeholder="Test name"
                            allowClear={false}
                            disabled={statusIsNotDraft}
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
                                name={[index, ...FormFields.caseInput]}
                                placeholder="Test input"
                                allowClear
                                disabled={statusIsNotDraft}
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
                                name={[index, ...FormFields.caseExpectedOutput]}
                                placeholder="Test expected output"
                                disabled={statusIsNotDraft}
                                allowClear
                                rules={[
                                  {
                                    required: true,
                                    message: 'Expected output is required',
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
                                name={[index, ...FormFields.validatorInput]}
                                placeholder="Validator input"
                                disabled={statusIsNotDraft}
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
                                  index,
                                  ...FormFields.validatorExpectedOutput,
                                ]}
                                disabled={statusIsNotDraft}
                                placeholder="Validator expected output"
                                allowClear
                                rules={[
                                  {
                                    required: true,
                                    message: 'Expected output is required',
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
                    disabled={statusIsNotDraft}
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
            name={FormFields.solutionStatus}
            rules={[
              {
                pattern: /Valid/,
                message: 'A valid solution is required',
              },
            ]}
          >
            <>
              <Space
                style={{
                  marginBottom: '5px',
                }}
              >
                <LanguageSelect
                  antdFieldName={FormFields.solutionLanguage}
                  placeholder="Solution language"
                  width="sm"
                  defaultLanguage={Language.javascript}
                  disabled={statusIsNotDraft}
                />
                <Button
                  type="primary"
                  onClick={handleOnTestSolutionClick}
                  loading={isTesting}
                  disabled={!testSolutionButtonState}
                >
                  Test Solution
                </Button>
              </Space>
              <CodeEditor
                editorRef={solutionEditorRef}
                defaultValue={initialChallenge?.solution.sourceCode}
                language={solutionLanguage}
                onModelChange={handleSolutionInputChanged}
                readOnly={statusIsNotDraft}
              />
            </>
          </Form.Item>
          {solutionErrorAlert}
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
            loading={isPublishing}
            onClick={() => formRef.current?.submit()}
          >
            Publish
          </Button>
        ) : null}
      </FooterToolbar>
    </>
  );
}

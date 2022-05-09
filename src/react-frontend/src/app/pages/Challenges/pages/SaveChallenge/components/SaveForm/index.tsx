import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import { Alert, Button, Form, Space, Typography } from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { challengeApi } from 'app/api/challenge';
import { Challenge, ChallengeStatus, TestPair } from 'app/api/types/challenge';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import MultiTagSelect from 'app/pages/Challenges/components/MultiTagSelect';
import { PATH_CHALLENGES } from 'app/routes/paths';
import { Language } from 'app/types/global';
import { stubInputLanguage } from 'config/monaco';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveFields } from '../../types';
import ErrorAlert from './components/ErrorAlert';
import FormCardSection from './components/FormCardSection';
import monaco from 'monaco-editor';
import { stubGeneratorApi } from 'app/api/stubGenerator';
import ProCard from '@ant-design/pro-card';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import MarkdownDescriptionEditor, {
  MarkdownEditorRef,
} from './components/MarkdownDescriptionEditor';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { getLanguageKeyName } from 'app/utils/enumHelpers';
import { StubGeneratorModel } from 'app/api/types/stubGenerator';

import { useEffectOnce } from 'usehooks-ts';

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

  const stubLanguage: Language = useWatch(SaveFields.stubLanguage, form);
  const solutionLanguage: Language = useWatch(
    SaveFields.solutionLanguage,
    form,
  );

  const markdownEditorRef = useRef<MarkdownEditorRef>(null);
  const stubEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const solutionEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const getStubQueryValue = (
    language: Language,
    generatorInput: string | undefined,
  ): StubGeneratorModel | typeof skipToken => {
    if (!generatorInput || generatorInput.length === 0) return skipToken;
    return {
      language: language,
      input: generatorInput,
    };
  };

  const { refetch, data: generateStubResult } =
    stubGeneratorApi.useGenerateStubQuery(
      getStubQueryValue(
        stubLanguage ?? getLanguageKeyName(Language.javascript),
        stubEditorRef?.current?.getValue() ??
          initialChallenge?.stubGeneratorInput,
      ),
    );
  const [triggerSaveChallenge, { isLoading: isSaving, data: savingResult }] =
    challengeApi.useSaveChallengeMutation();
  const [emptyStubInput, setEmptyStubInput] = useState(true);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  useEffectOnce(() => {
    if (!initialChallenge) return;
    setSaveButtonDisabled(true);
    const {
      name,
      descriptionShort,
      stubGeneratorInput,
      tagIds,
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
      [`${SaveFields.tests}`]: testPairs,
      [`${SaveFields.solutionLanguage}`]: solution.language,
    });
  });

  useEffect(() => {
    if (stubEditorRef?.current) {
      const input: string = stubEditorRef.current.getValue();
      triggerStubGeneration(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stubLanguage]);

  useEffect(() => {
    if (
      savingResult &&
      savingResult.value !== undefined &&
      savingResult.value !== 'null'
    ) {
      setSaveButtonDisabled(true);
      if (!initialChallenge) {
        navigate(PATH_CHALLENGES.save + `/${savingResult.value}`, {
          replace: true,
        });
      }
    }
  }, [savingResult, initialChallenge, navigate]);

  const triggerStubGeneration = async (input: string | undefined) => {
    if (input?.length === 0 || !input) return;
    refetch();
  };

  const handleStubInputChanged = async (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setEmptyStubInput(!value || value?.length === 0);
    triggerStubGeneration(value);
    setSaveButtonDisabled(false);
  };

  const handleSolutionInputChanged = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setSaveButtonDisabled(false);
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

  return (
    <>
      {initialChallenge?.status === ChallengeStatus.Unpublished ? (
        <Alert
          showIcon
          type="warning"
          message="Your challenge was unpublished!"
          description={
            <>
              <Typography.Text strong>Reason: </Typography.Text>
              {initialChallenge?.statusReason}
            </>
          }
        />
      ) : null}
      <ProForm
        form={form}
        submitter={false}
        onValuesChange={() => setSaveButtonDisabled(false)}
      >
        <FormCardSection title="General Information">
          <Typography.Text strong>Title</Typography.Text>
          <ProFormText name={SaveFields.name} placeholder="Title" />
          <Typography.Text strong>Tags</Typography.Text>
          <MultiTagSelect name={SaveFields.tags} />
          <Typography.Text strong>Short Description</Typography.Text>
          <ProFormTextArea
            name={SaveFields.descriptionShort}
            placeholder="Challenge short description"
          />
          <Typography.Text strong>Description</Typography.Text>
          <MarkdownDescriptionEditor
            editorRef={markdownEditorRef}
            initialValue={initialChallenge?.descriptionMarkdown}
            inputChanged={() => setSaveButtonDisabled(false)}
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
              editorRef={stubEditorRef}
              defaultValue={initialChallenge?.stubGeneratorInput}
              language={stubInputLanguage}
              readOnly={statusIsNotDraft}
              onModelChange={handleStubInputChanged}
            />

            {!emptyStubInput &&
            generateStubResult &&
            !generateStubResult.isSuccess &&
            generateStubResult.value &&
            generateStubResult.value.error ? (
              <ErrorAlert error={generateStubResult.value.error!} />
            ) : null}
          </Space>
          <Typography.Text strong>Result</Typography.Text>
          <LanguageSelect
            antdFieldName={SaveFields.stubLanguage}
            placeholder="Generation language"
            width="sm"
            defaultLanguage={Language.javascript}
            style={{
              marginBottom: '5px',
            }}
          />
          <CodeEditor
            language={stubLanguage}
            defaultValue="// update the stub input to get the result"
            value={generateStubResult?.value?.stub}
            readOnly
          />
        </FormCardSection>

        <FormCardSection title="Tests" ghost>
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
        </FormCardSection>

        <FormCardSection title="Solution">
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
        </FormCardSection>
      </ProForm>

      <FooterToolbar>
        {/*<Checkbox onChange={e => setAutoSave(e.target.value)}>
          Auto-save
        </Checkbox>,*/}
        <Button
          type="ghost"
          onClick={handleSaveChallenge}
          loading={isSaving}
          disabled={saveButtonDisabled}
        >
          Save
        </Button>
        <Button type="primary" loading={isSaving} disabled={saveButtonDisabled}>
          Publish
        </Button>
      </FooterToolbar>
    </>
  );
}

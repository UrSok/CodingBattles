import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Alert, Button, Form, Space, Tag, Typography } from 'antd';
import ChallengeDescription from 'app/components/ChallengeDescription';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import Page from 'app/components/Layout/Page';
import { Language } from 'app/types/enums/language';
import React, { ReactText, useEffect, useRef, useState } from 'react';
import Play from '@2fd/ant-design-icons/lib/Play';
import monaco from 'monaco-editor';
import { useEffectOnce, useMap } from 'usehooks-ts';
import { gameApi, stubGeneratorApi } from 'app/api';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { getLanguageKeyName } from 'app/utils/enumHelpers';
import UserAvatar from 'app/components/Auth/UserAvatar';
import Countdown from 'antd/lib/statistic/Countdown';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { selectUser } from 'app/slices/auth/selectors';
import { useSelector } from 'react-redux';
import { Game } from 'app/types/models/game/game';
import { TestPair } from 'app/types/models/challenge/testPair';
import { ErrorCode } from 'app/types/enums/errorCode';

type TestState = 'None' | 'Validating' | 'Passed' | 'Failed' | 'Unvalidated';

type IdeProps = {
  gameInfo: Game;
};

export default function Ide(props: IdeProps) {
  const { gameInfo } = props;
  const { currentRound } = gameInfo!;
  const user = useSelector(selectUser);

  const deadLine =
    currentRound && currentRound.startTime
      ? new Date(currentRound.startTime).getTime() + 1800000
      : 0;

  const [form] = useForm();
  const solutionLanguage: Language = useWatch('solutionLang', form);

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>(
    [],
  );

  //const [testsState, updateTestsState] =
  const [testsMap, testsMapActions] = useMap<string, TestState>();

  const solutionEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const [
    triggerStubGenerator,
    { isLoading: isGenerating, data: GenerateStubResult },
  ] = stubGeneratorApi.useLazyGenerateStubQuery();

  const [triggerTestRun, { isLoading: isTesting, data: testResult }] =
    gameApi.useRunTestMutation();

  const [triggerSubmitResult, { isLoading: isSubmiting, data: submitResult }] =
    gameApi.useSubmitResultMutation();

  useEffectOnce(() => {
    let tests = currentRound?.challenge.tests;

    if (tests) {
      for (let i = 0; i < tests?.length; i++) {
        testsMapActions.set(i.toString(), 'None');
      }
    }

    triggerStubGenerator({
      input: currentRound?.challenge.stubGeneratorInput ?? '',
      language: solutionLanguage ?? getLanguageKeyName(Language.javascript),
    });
  });

  useEffect(() => {
    triggerStubGenerator({
      input: currentRound?.challenge.stubGeneratorInput ?? '',
      language: solutionLanguage ?? getLanguageKeyName(Language.javascript),
    });
  }, [solutionLanguage]);

  useEffect(() => {
    if (!testResult || !testResult.value) return;

    if (testResult.isSuccess) {
      testsMapActions.set(testResult.value.id, 'Passed');
    } else {
      testsMapActions.set(testResult.value.id, 'Failed');
    }
  }, [testResult]);

  useEffect(() => {
    console.log(GenerateStubResult);
    if (
      GenerateStubResult?.isSuccess &&
      GenerateStubResult &&
      GenerateStubResult.value
    ) {
      solutionEditorRef.current?.setValue(GenerateStubResult.value.stub);
    }
  }, [GenerateStubResult]);

  const upperRowMaxSize: React.CSSProperties = {
    height: '42vh',
  };
  const lowerRowMaxSize: React.CSSProperties = {
    height: '35vh',
  };

  const autoResizeStyle: React.CSSProperties = {
    resize: 'vertical',
    overflow: 'auto',
  };

  const TaskCard = (
    <ProCard
      title="Task"
      bodyStyle={{ ...autoResizeStyle, ...upperRowMaxSize }}
    >
      <ChallengeDescription
        value={currentRound?.challenge.descriptionMarkdown}
      />
    </ProCard>
  );

  const handleOnTestClick = async (value: TestPair, index: number) => {
    const solutionText = solutionEditorRef.current?.getValue();
    if (!solutionText) return;

    testsMapActions.set(index.toString(), 'Validating');

    await triggerTestRun({
      id: index.toString(),
      test: value,
      solution: {
        language: solutionLanguage,
        sourceCode: solutionText,
      },
    });
  };

  const handleRunAllTests = async () => {
    if (!currentRound) return;
    const solutionText = solutionEditorRef.current?.getValue();
    if (!solutionText) return;

    for (let i = 0; i < currentRound.challenge.tests.length; i++) {
      testsMapActions.set(i.toString(), 'Validating');

      var result = await triggerTestRun({
        id: i.toString(),
        test: currentRound.challenge.tests[i],
        solution: {
          language: solutionLanguage,
          sourceCode: solutionText,
        },
      }).unwrap();

      if (!result.isSuccess) {
        testsMapActions.set(i.toString(), 'Failed');
        return;
      }

      testsMapActions.set(i.toString(), 'Passed');
    }
  };

  const TestsCard = (
    <ProCard
      title="Tests"
      direction="column"
      bodyStyle={{ ...autoResizeStyle, ...lowerRowMaxSize }}
      extra={
        <Button size="small" disabled={isTesting} onClick={handleRunAllTests}>
          RUN ALL
        </Button>
      }
    >
      <ProList<TestPair>
        ghost
        split
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
        }}
        metas={{
          avatar: {
            render: (dom, test, index) => (
              <Typography.Text strong>{index + 1}.</Typography.Text>
            ),
          },
          title: {
            dataIndex: 'title',
          },
          subTitle: {
            render: (dom, test, index) => {
              const testState = testsMap.get(index.toString());

              if (testState === 'Validating') {
                return (
                  <Tag icon={<SyncOutlined spin />} color="processing">
                    Processing
                  </Tag>
                );
              }

              if (testState === 'Passed') {
                return (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Passed
                  </Tag>
                );
              }

              if (testState === 'Unvalidated') {
                return (
                  <Tag icon={<ExclamationCircleOutlined />} color="warning">
                    Unvalidated
                  </Tag>
                );
              }

              if (testState === 'Failed') {
                return (
                  <Tag icon={<CloseCircleOutlined />} color="error">
                    Failed
                  </Tag>
                );
              }

              return null;
            },
          },
          actions: {
            render: (dom, value, index) => {
              return (
                <Button
                  type="ghost"
                  icon={<Play style={{ fontSize: 24 }} />}
                  onClick={() => handleOnTestClick(value, index)}
                  disabled={
                    testsMap.get(index.toString()) === 'Validating' && isTesting
                  }
                />
              );
            },
          },
          description: {
            render: (dom, test, index) => {
              return (
                <ProCard key={index} direction="row" gutter={[8, 0]} ghost>
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
        dataSource={currentRound?.challenge.tests}
      />
    </ProCard>
  );

  const handleSolutionInputChanged = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    let tests = currentRound?.challenge.tests;

    if (tests) {
      for (let i = 0; i < tests?.length; i++) {
        if (
          testsMap.get(i.toString()) !== 'None' &&
          testsMap.get(i.toString()) !== 'Unvalidated'
        ) {
          testsMapActions.set(i.toString(), 'Unvalidated');
        }
      }
    }
  };

  const handleSubmit = () => {
    const solutionText = solutionEditorRef.current?.getValue();

    triggerSubmitResult({
      gameId: gameInfo.id,
      userId: user!.id,
      solution: {
        language: solutionLanguage,
        sourceCode: solutionText ?? '',
      },
    });
  };

  const SolutionEditorCard = (
    <ProCard
      title="Solution"
      bodyStyle={{ ...autoResizeStyle, ...upperRowMaxSize }}
      extra={
        <Space>
          <Form form={form}>
            <LanguageSelect
              antdFieldName="solutionLang"
              width="sm"
              defaultLanguage={Language.javascript}
              placeholder="Solution Language"
            />
          </Form>
          <Button
            type="primary"
            icon={<Play />}
            onClick={handleSubmit}
            loading={isSubmiting}
          >
            SUBMIT
          </Button>
        </Space>
      }
    >
      <CodeEditor
        editorRef={solutionEditorRef}
        defaultValue={GenerateStubResult?.value?.stub}
        language={solutionLanguage}
        onModelChange={handleSolutionInputChanged}
      />
    </ProCard>
  );

  const handleTheOutput = (): React.ReactNode => {
    if (testResult && !testResult?.isSuccess) {
      if (testResult?.errors?.at(0)?.name === ErrorCode.BuildError) {
        const error = testResult.value?.outputError
          ? testResult.value.test.buildStderr
          : testResult?.value?.test.stderr;

        return (
          <>
            <Alert showIcon type="error" message="Build error" />
            <Typography.Paragraph>
              <pre>{error}</pre>
            </Typography.Paragraph>
          </>
        );
      }

      if (
        testResult?.errors?.at(0)?.name === ErrorCode.TestNotPassed ||
        testResult?.errors?.at(0)?.name === ErrorCode.ValidatorNotPassed
      ) {
        return (
          <>
            <Alert
              showIcon
              type="error"
              message="Expected output differs from the actual"
            />
            <Typography.Paragraph>
              <pre>{testResult?.value?.outputError}</pre>
            </Typography.Paragraph>
          </>
        );
      }
    }

    if (testResult?.isSuccess) {
      return (
        <>
          <Typography.Paragraph>
            <pre>
              {testResult?.value?.test?.stdout ??
                testResult?.value?.validator?.stdout}
            </pre>
          </Typography.Paragraph>
        </>
      );
    }

    return undefined;
  };

  const OutputCard = (
    <ProCard
      title="Output"
      bodyStyle={{ ...autoResizeStyle, ...lowerRowMaxSize }}
    >
      {handleTheOutput()}
    </ProCard>
  );

  const UsersCard = (
    <ProCard
      title="Users"
      colSpan={8}
      direction="column"
      bodyStyle={{ ...autoResizeStyle, ...lowerRowMaxSize }}
    >
      <ProList
        ghost
        split
        metas={{
          title: {
            render: (dom, value, index) => {
              return (
                <Space>
                  <UserAvatar userName={value.username} size="large" />
                  <Typography.Text>{value.username}</Typography.Text>
                </Space>
              );
            },
          },
          actions: {
            render: (dom, value, index) => {
              return null;
              <Tag color="error">Error</Tag>;
            },
          },
        }}
        dataSource={gameInfo?.users}
      />
    </ProCard>
  );

  const handleOnCountdownFinish = () => {};

  return (
    <Page
      title={currentRound?.challenge.name}
      extra={
        <Space>
          <Typography.Text
            strong
            style={{
              fontSize: 20,
            }}
          >
            Time Left:
          </Typography.Text>
          <Countdown
            valueStyle={{
              fontSize: 20,
            }}
            value={deadLine}
            onFinish={handleOnCountdownFinish}
          />
        </Space>
      }
    >
      <ProCard direction="column" ghost gutter={[16, 16]}>
        <ProCard gutter={16} ghost>
          <ProCard ghost colSpan={10} direction="column" gutter={[16, 16]}>
            {TaskCard}
            {TestsCard}
          </ProCard>
          <ProCard ghost colSpan={14} direction="column" gutter={[16, 16]}>
            {SolutionEditorCard}
            <ProCard gutter={16} ghost>
              {OutputCard}
              {UsersCard}
            </ProCard>
          </ProCard>
        </ProCard>
      </ProCard>
    </Page>
  );
}

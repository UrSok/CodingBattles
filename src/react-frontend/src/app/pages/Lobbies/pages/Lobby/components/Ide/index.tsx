import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Alert, Button, Form, message, Space, Tag, Typography } from 'antd';
import ChallengeDescription from 'app/components/ChallengeDescription';
import CodeEditor from 'app/components/Input/CodeEditor';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import Page from 'app/components/Page';
import { Language } from 'app/types/enums/language';
import React, { ReactText, useRef, useState } from 'react';
import Play from '@2fd/ant-design-icons/lib/Play';
import monaco from 'monaco-editor';
import {
  useDebounce,
  useEffectOnce,
  useInterval,
  useMap,
  useUpdateEffect,
} from 'usehooks-ts';
import { gameApi, stubGeneratorApi } from 'app/api';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { getGameModeKeyName, getLanguageKeyName } from 'app/utils/enumHelpers';
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
import { GameMode } from 'app/types/enums/gameMode';
import { RoundSummaryStatus } from 'app/types/enums/roundSummaryStatus';
import { UserDto } from 'app/types/models/user/userDto';
import LoadingSpinner from 'app/components/LoadingSpinner';

type TestState = 'None' | 'Validating' | 'Passed' | 'Failed' | 'Unvalidated';

type IdeProps = {
  gameInfo: Game;
};

export default function Ide(props: IdeProps) {
  const { gameInfo } = props;
  const { currentRound } = gameInfo!;
  const authUser = useSelector(selectUser);

  const authUserRoundSummary = currentRound?.roundSummaries.find(
    x => x.user.id === authUser?.id,
  );

  // const deadLine =
  //   currentRound && currentRound.startTime
  //     ? new Date(currentRound.startTime).getTime() + 1800000
  //     : 0;

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
    { isLoading: isGenerating, data: generateStubResult },
  ] = stubGeneratorApi.useLazyGenerateStubQuery();

  const [triggerSaveSolution] = gameApi.useSaveSolutionMutation();

  const [triggerTestRun, { isLoading: isTesting, data: testResult }] =
    gameApi.useRunTestMutation();

  const [triggerSubmitResult, { isLoading: isSubmiting }] =
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

  useInterval(async () => {
    if (!authUserRoundSummary) return;

    const solutionText = solutionEditorRef.current?.getValue();
    if (!solutionText || solutionText.length === 0) return;

    if (
      solutionText !== authUserRoundSummary.solution?.sourceCode ||
      solutionLanguage !== authUserRoundSummary.solution?.language
    ) {
      const result = await triggerSaveSolution({
        gameId: gameInfo.id,
        userId: authUser!.id,
        solution: {
          language: solutionLanguage,
          sourceCode: solutionText,
        },
      }).unwrap();

      if (!result.isSuccess) return;
      message.success('Solution saved!', 3);
    }
  }, 10000);

  useUpdateEffect(() => {
    triggerStubGenerator({
      input: currentRound?.challenge.stubGeneratorInput ?? '',
      language: solutionLanguage ?? getLanguageKeyName(Language.javascript),
    });
  }, [solutionLanguage]);

  useUpdateEffect(() => {
    if (!testResult || !testResult.value) return;

    if (testResult.isSuccess) {
      testsMapActions.set(testResult.value.id, 'Passed');
    } else {
      testsMapActions.set(testResult.value.id, 'Failed');
    }
  }, [testResult]);

  useUpdateEffect(() => {
    if (
      generateStubResult?.isSuccess &&
      generateStubResult &&
      generateStubResult.value
    ) {
      solutionEditorRef.current?.setValue(generateStubResult.value.stub);
    }
  }, [generateStubResult]);

  const upperRowMaxSize: React.CSSProperties = {
    height: '42vh',
  };
  const lowerRowMaxSize: React.CSSProperties = {
    height: '35vh',
  };

  const spanRowMaxSize: React.CSSProperties = {
    height: '84vh',
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

    var promises = currentRound.challenge.tests.map(async (test, index) => {
      testsMapActions.set(index.toString(), 'Validating');

      var result = await triggerTestRun({
        id: index.toString(),
        test,
        solution: {
          language: solutionLanguage,
          sourceCode: solutionText,
        },
      }).unwrap();

      if (!result.isSuccess) {
        testsMapActions.set(index.toString(), 'Failed');
        return;
      }

      testsMapActions.set(index.toString(), 'Passed');
    });

    await Promise.all(promises);

    // for (let i = 0; i < currentRound.challenge.tests.length; i++) {
    //   testsMapActions.set(i.toString(), 'Validating');

    //   var result = await triggerTestRun({
    //     id: i.toString(),
    //     test: currentRound.challenge.tests[i],
    //     solution: {
    //       language: solutionLanguage,
    //       sourceCode: solutionText,
    //     },
    //   }).unwrap();

    //   if (!result.isSuccess) {
    //     testsMapActions.set(i.toString(), 'Failed');
    //     return;
    //   }

    //   testsMapActions.set(i.toString(), 'Passed');
    // }
  };

  const TestsCard = (
    <ProCard
      title="Tests"
      direction="column"
      bodyStyle={
        currentRound?.gameMode === getGameModeKeyName(GameMode.reverse)
          ? { ...autoResizeStyle, ...spanRowMaxSize }
          : { ...autoResizeStyle, ...lowerRowMaxSize }
      }
      extra={
        <Button
          size="small"
          type="primary"
          disabled={isTesting}
          onClick={handleRunAllTests}
        >
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
      userId: authUser!.id,
      solution: {
        language: solutionLanguage,
        sourceCode: solutionText ?? '',
      },
    });
  };

  // const handleReGenerateStub = () => {
  //   triggerStubGenerator({
  //     language: solutionLanguage,
  //     input: gameInfo.currentRound?.challenge.stubGeneratorInput,
  //   });
  // };

  const SolutionEditorCard = (
    <ProCard
      title="Solution"
      bodyStyle={{ ...autoResizeStyle, ...upperRowMaxSize }}
      // subTitle={

      //     <Button
      //       danger
      //       type="primary"
      //       size="small"
      //       onClick={handleReGenerateStub}
      //       loading={isGenerating}
      //     >
      //       Re-generate stub
      //     </Button>
      // }
      extra={
        <Form form={form}>
          <LanguageSelect
            antdFieldName="solutionLang"
            width="sm"
            defaultLanguage={
              authUserRoundSummary?.solution
                ? Language[authUserRoundSummary.solution.language]
                : generateStubResult?.value?.stub
            }
            placeholder="Solution Language"
          />
        </Form>
      }
    >
      <CodeEditor
        editorRef={solutionEditorRef}
        defaultValue={
          authUserRoundSummary?.solution?.sourceCode ??
          generateStubResult?.value?.stub
        }
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
      <ProList<UserDto>
        ghost
        split
        metas={{
          title: {
            render: (dom, user, index) => {
              return (
                <Space>
                  <UserAvatar userName={user.username} size="large" />
                  <Typography.Text>{user.username}</Typography.Text>
                </Space>
              );
            },
          },
          extra: {
            render: (dom, user, index) => {
              const roundSummary = currentRound?.roundSummaries.find(
                x => x.user.id === user.id,
              );

              if (roundSummary?.status === RoundSummaryStatus.Submitting) {
                return <Tag color="warning">Submitting</Tag>;
              }

              if (roundSummary?.status === RoundSummaryStatus.Submitted) {
                return <Tag color="success">Submitted</Tag>;
              }

              return undefined;
            },
          },
        }}
        dataSource={gameInfo?.users}
      />
    </ProCard>
  );

  return (
    <Page
      title={currentRound?.challenge.name}
      // extra={
      //   <Space>
      //     <Typography.Text
      //       strong
      //       style={{
      //         fontSize: 20,
      //       }}
      //     >
      //       Time Left:
      //     </Typography.Text>
      //     <Countdown
      //       valueStyle={{
      //         fontSize: 20,
      //       }}
      //       value={deadLine}
      //       onFinish={handleOnCountdownFinish}
      //     />
      //   </Space>
      // }
      subTitle={
        currentRound && (
          <Tag color="cyan">{GameMode[currentRound?.gameMode]}</Tag>
        )
      }
      extra={
        <Button
          type="primary"
          icon={<Play />}
          onClick={handleSubmit}
          loading={isSubmiting}
        >
          SUBMIT
        </Button>
      }
    >
      <ProCard direction="column" ghost gutter={[16, 16]}>
        <ProCard gutter={16} ghost>
          <ProCard ghost colSpan={10} direction="column" gutter={[16, 16]}>
            {currentRound?.gameMode !== getGameModeKeyName(GameMode.reverse) &&
              TaskCard}
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

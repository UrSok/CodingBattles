import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import { Alert, Button, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { gameApi } from 'app/api';
import ChallengeList from 'app/components/ChallengeList';
import LanguageSelect from 'app/components/Input/LanguageSelect';
import { selectUser } from 'app/slices/auth/selectors';
import { ChallengeSelectorType } from 'app/types/enums/challengeSelectorType';
import { GameMode } from 'app/types/enums/gameMode';
import { RoundStatus } from 'app/types/enums/roundStatus';
import { Round } from 'app/types/models/game/round';
import { getChallengeSelectorTypeKeyName } from 'app/utils/enumHelpers';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChooseChallenge from './components/ChooseChallenge';
import { RoundSettingsFields } from './types';

type RoundSettingsProps = {
  gameId: string;
  isGameMaster: boolean;
  currentRound?: Round;
};

export default function RoundSettings(props: RoundSettingsProps) {
  const { gameId, isGameMaster, currentRound } = props;
  const [form] = useForm();

  const [triggerCreateRound] = gameApi.useCreateRoundMutation();
  const [triggerUpdateRound] = gameApi.useUpdateCurrentRoundSettingsMutation();
  const [triggerStartRound] = gameApi.useStartRoundMutation();
  const [triggerEndRound] = gameApi.useEndRoundMutation();

  const handleOnNewRound = () => {
    triggerCreateRound(gameId);
  };

  const handleOnStartRound = () => {
    triggerStartRound(gameId);
  };

  const handleOnForceEndRound = () => {
    triggerEndRound(gameId);
  };

  const handleOnSettingsChange = (changedValues, values) => {
    triggerUpdateRound({
      gameId,
      request: {
        restrictedLanguages: values.restrictedLanguages,
        gameMode: values.gamemode,
        challengeSelectorType: values.challengeSelectorType,
      },
    });
  };

  useEffect(() => {
    if (!currentRound) return;

    form.setFieldsValue({
      [`${RoundSettingsFields.gamemode}`]: currentRound.gameMode,
      [`${RoundSettingsFields.restrictedLanguages}`]:
        currentRound.restrictedLanguages,
      [`${RoundSettingsFields.challengeSelectorType}`]:
        currentRound.challengeSelectorType,
      [`${RoundSettingsFields.challengeSelected}`]: currentRound.challenge
        ? true
        : false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound]);

  return (
    <>
      <ProCard
        ghost
        title="Round settings"
        extra={
          currentRound &&
          currentRound.status === RoundStatus.NotStarted &&
          isGameMaster && (
            <Button
              type="primary"
              onClick={handleOnStartRound}
              disabled={!currentRound.challenge}
            >
              Start round
            </Button>
          )
        }
      >
        {!currentRound && (
          <Alert
            message="Use the button on the right side to create a new round."
            action={
              <Button type="primary" onClick={handleOnNewRound}>
                New Round
              </Button>
            }
          />
        )}
        {currentRound?.status === RoundStatus.InProgress && (
          <Alert
            type="error"
            message="Round in progress. Use the button on the right side to end the round forcefully."
            action={
              <Button danger type="primary" onClick={handleOnForceEndRound}>
                End Round
              </Button>
            }
          />
        )}
        {currentRound && currentRound.status === RoundStatus.NotStarted && (
          <ProForm
            form={form}
            submitter={false}
            onValuesChange={handleOnSettingsChange}
          >
            <ProCard ghost gutter={[8, 8]}>
              <ProCard title="General">
                <ProFormSelect
                  allowClear={false}
                  disabled={!isGameMaster}
                  name={RoundSettingsFields.gamemode}
                  label="Gamemode"
                  valueEnum={GameMode}
                  initialValue={GameMode.classic}
                />
                {/* <LanguageSelect
                  label="Languages"
                  disabled={!isGameMaster}
                  placeholder="All"
                  antdFieldName={RoundSettingsFields.restrictedLanguages}
                  multi
                /> */}
              </ProCard>
              <ProCard title="Challenge">
                {isGameMaster && (
                  <ProFormSelect
                    label="Selector"
                    allowClear={false}
                    placeholder="Choose selector"
                    name={RoundSettingsFields.challengeSelectorType}
                    valueEnum={ChallengeSelectorType}
                    initialValue={ChallengeSelectorType.specific}
                  />
                )}
                <ChallengeList
                  preventFetch
                  emptyElement={
                    isGameMaster && (
                      <ChooseChallenge
                        gameId={gameId}
                        trigger={<Button type="primary">Select</Button>}
                      />
                    )
                  }
                  itemExtra={{
                    render: (dom, record, index) => {
                      if (
                        form.getFieldValue(
                          RoundSettingsFields.challengeSelectorType,
                        ) ===
                        getChallengeSelectorTypeKeyName(
                          ChallengeSelectorType.specific,
                        )
                      ) {
                        return (
                          isGameMaster && (
                            <ChooseChallenge
                              gameId={gameId}
                              trigger={<Button type="primary">Reselect</Button>}
                            />
                          )
                        );
                      }
                    },
                  }}
                  staticChallenges={
                    currentRound?.challenge && [
                      {
                        id: currentRound?.challenge.id,
                        createdByUserId: currentRound?.challenge.user.id,
                        name: currentRound?.challenge.name,
                        descriptionShort:
                          currentRound?.challenge.descriptionShort,
                        difficulty: currentRound?.challenge.difficulty,
                        tags: currentRound?.challenge.tags,
                      },
                    ]
                  }
                />
              </ProCard>
            </ProCard>
          </ProForm>
        )}
      </ProCard>
    </>
  );
}

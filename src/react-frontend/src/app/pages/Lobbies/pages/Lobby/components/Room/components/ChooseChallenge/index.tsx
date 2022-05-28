import ProForm from '@ant-design/pro-form';
import { Drawer, Form, Input } from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { gameApi } from 'app/api';
import ChallengeList from 'app/components/ChallengeList';
import { ChallengeSearchFields } from 'app/pages/Challenges/pages/Index/types';
import { ChallengeSearchItem } from 'app/types/models/challenge/challengeSearchItem';
import { translations } from 'locales/translations';
import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'usehooks-ts';

type ChooseChallengeProps = {
  trigger: React.ReactElement;
  gameId: string;
};

export default function ChooseChallenge(props: ChooseChallengeProps) {
  const { trigger, gameId } = props;

  const { t } = useTranslation();
  const [form] = useForm();

  const searchText = useWatch(ChallengeSearchFields.searchText, form);

  const {
    value: visible,
    setFalse: setInvisible,
    setTrue: setVisible,
  } = useBoolean(false);

  const [triggerSelectChallenge] = gameApi.useSelectChallengeMutation();

  const handleOnChallengeClick = (
    record: ChallengeSearchItem,
    index: number,
  ) => {
    setInvisible();
    triggerSelectChallenge({
      gameId,
      challengeId: record.id,
    });
  };

  const triggerDom = useMemo(() => {
    return React.cloneElement(trigger, {
      key: 'trigger',
      ...trigger.props,
      onClick: async (e: any) => {
        setVisible();
        trigger.props?.onClick?.(e);
      },
    });
  }, [trigger, setVisible]);

  return (
    <>
      <Drawer
        width={800}
        title="Choose challenge"
        placement="right"
        visible={visible}
        onClose={() => setInvisible()}
      >
        <ProForm
          layout="vertical"
          form={form}
          initialValues={{
            [`${ChallengeSearchFields.searchText}`]: undefined,
          }}
          submitter={false}
        >
          <Form.Item name={ChallengeSearchFields.searchText}>
            <Input.Search
              placeholder={t(translations.Challenges.Search.Form.searchInput)}
              enterButton
              allowClear
            />
          </Form.Item>
        </ProForm>
        <ChallengeList text={searchText} onItemClick={handleOnChallengeClick} />
      </Drawer>
      {triggerDom}
    </>
  );
}

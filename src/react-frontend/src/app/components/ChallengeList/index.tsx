import ProList, { ProListMeta } from '@ant-design/pro-list';
import { ToolBarProps } from '@ant-design/pro-table/lib/components/ToolBar';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Rate, Space, Tag, Typography } from 'antd';
import { challengeApi } from 'app/api';
import { ChallengeSearchRequest } from 'app/api/challenge/types/challengeSearch';
import { OrderStyle } from 'app/types/enums/orderStyle';
import { ChallengeSearchItem } from 'app/types/models/challenge/challengeSearchItem';
import React, { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useCounter, useIsFirstRender, useUpdateEffect } from 'usehooks-ts';
import LoadingSpinner from '../LoadingSpinner';
import NoData from '../NoData';

type ChallengeListProps<T> = {
  preventFetch?: boolean;
  emptyElement?: React.ReactNode;
  staticChallenges?: ChallengeSearchItem[];
  headerTitle?: React.ReactNode;
  toolBarRender?: ToolBarProps<T>['toolBarRender'] | false;
  itemExtra?: ProListMeta<T>;
  pageSize?: number;
  sortBy?: string;
  orderStyle?: OrderStyle;
  text?: string;
  tagIds?: string[];
  difficultyRange?: [number, number];
  includeNoDifficulty?: boolean;
  onTagClick?: (tagId: string) => void;
  onItemClick?: (record: ChallengeSearchItem, index: number) => void;
};

export default function ChallengeList(
  props: ChallengeListProps<ChallengeSearchItem>,
) {
  const {
    preventFetch,
    emptyElement,
    staticChallenges,
    headerTitle,
    toolBarRender,
    itemExtra,
    pageSize,
    sortBy,
    orderStyle,
    text,
    tagIds,
    difficultyRange,
    includeNoDifficulty,
    onTagClick,
    onItemClick,
  } = props;

  const {
    count: page,
    increment: incrementPage,
    setCount: setPage,
  } = useCounter(1);

  const searchQuery: ChallengeSearchRequest = {
    page: page,
    pageSize: pageSize,
    text: text,
    sortBy: sortBy,
    orderStyle: orderStyle,
    tagIds: tagIds,
    includeNoDifficulty: includeNoDifficulty,
    minimumDifficulty: 1,
    maximumDifficulty: 5,
  };

  if (difficultyRange) {
    searchQuery.minimumDifficulty = difficultyRange[0];
    searchQuery.maximumDifficulty = difficultyRange[1];
  }

  const { data: challengesData, isLoading } =
    challengeApi.useGetChallengesQuery(preventFetch ? skipToken : searchQuery);
  const hasNextPage =
    challengesData?.value &&
    challengesData?.value?.totalPages > 0 &&
    challengesData?.value?.totalPages !== page
      ? true
      : false;

  const [challenges, setChallenges] = useState<ChallengeSearchItem[]>([]);
  const isFirstRender = useIsFirstRender();

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: () => {
      incrementPage();
    },
  });

  useUpdateEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, orderStyle, text, tagIds, difficultyRange, includeNoDifficulty]);

  useEffect(() => {
    if (!challengesData?.value) return;

    if (page === 1) {
      setChallenges(challengesData?.value?.items);
    } else {
      setChallenges(challenges.concat(challengesData?.value?.items));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengesData]);

  return (
    <>
      <ProList<ChallengeSearchItem>
        ghost
        headerTitle={headerTitle}
        toolBarRender={toolBarRender}
        itemLayout="vertical"
        split
        locale={{
          emptyText: emptyElement ? emptyElement : <NoData />,
        }}
        dataSource={preventFetch ? staticChallenges : challenges}
        rowKey={(record, index) => record.id}
        loading={{
          spinning: isLoading || isFirstRender,
          indicator: <LoadingSpinner noTip />,
        }}
        onItem={(record, index) => ({
          onClick: () => onItemClick && onItemClick(record, index),
        })}
        metas={{
          title: {
            dataIndex: 'name',
          },
          content: {
            dataIndex: 'descriptionShort',
          },

          subTitle: {
            render: (_, record) => (
              <Space size={0} wrap>
                {record.tags?.map(tag => {
                  return (
                    tag && (
                      <Tag
                        key={tag.id}
                        onClick={() => onTagClick && onTagClick(tag.id)}
                      >
                        {tag.name}
                      </Tag>
                    )
                  );
                })}
              </Space>
            ),
          },
          actions: {
            render: (_, record) => (
              <>
                <Typography.Text>Difficulty:</Typography.Text>{' '}
                {record.difficulty > 0 ? (
                  <Rate disabled value={record.difficulty} allowHalf />
                ) : (
                  '???'
                )}
              </>
            ),
          },
          extra: itemExtra,
        }}
      />
      {!isFirstRender && (isLoading || hasNextPage) && (
        <div ref={sentryRef}>
          {challenges.length > 0 && (
            <LoadingSpinner horizontallyCentered noTip />
          )}
        </div>
      )}
    </>
  );
}

import ProList, { GetComponentProps, ProListMeta } from '@ant-design/pro-list';
import { Rate, Space, Tag, Typography } from 'antd';
import {
  ChallengeSearchRequest,
  ChallengeSearchResultItem,
} from 'app/api/types/challenge';
import React, { useEffect, useState } from 'react';
import { challengeApi, challengeTagApi } from 'app/api';
import { useCounter } from 'usehooks-ts';
import { OrderStyle } from 'app/api/types';
import NoData from '../NoData';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { ToolBarProps } from '@ant-design/pro-table/lib/components/ToolBar';
import LoadingSpinner from '../LoadingSpinner';

type ChallengeListProps<T> = {
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
  onItem?: GetComponentProps<T>;
};

export default function ChallengeList(
  props: ChallengeListProps<ChallengeSearchResultItem>,
) {
  const {
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
    onItem,
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

  const { isLoading: isLoadingTags, data: tagsData } =
    challengeTagApi.useGetTagsQuery();
  const { data: challengesData, isLoading } =
    challengeApi.useGetChallengesQuery(searchQuery);
  const hasNextPage =
    challengesData?.value &&
    challengesData?.value?.totalPages > 0 &&
    challengesData?.value?.totalPages !== page
      ? true
      : false;

  const [data, setData] = useState<ChallengeSearchResultItem[]>([]);

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: () => {
      incrementPage();
      console.log(page);
    },
  });

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, text, tagIds, difficultyRange, includeNoDifficulty]);

  useEffect(() => {
    if (!challengesData?.value) return;

    if (page === 1) {
      setData(challengesData?.value?.items);
    } else {
      setData(data.concat(challengesData?.value?.items));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengesData]);

  return (
    <>
      <ProList<ChallengeSearchResultItem>
        ghost
        headerTitle={headerTitle}
        toolBarRender={toolBarRender}
        itemLayout="vertical"
        split
        locale={{
          emptyText: <NoData />,
        }}
        dataSource={data}
        rowKey={(record, index) => record.id}
        loading={{
          spinning: !challengesData || isLoading || isLoadingTags,
          indicator: <LoadingSpinner noTip />,
        }}
        onItem={onItem}
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
                {record.tagIds?.map(tagId => {
                  const tag = tagsData?.value?.find(x => x.id === tagId);
                  return (
                    tag && (
                      <Tag
                        key={tagId}
                        onClick={() => onTagClick && onTagClick(tagId)}
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
      {(isLoading || hasNextPage) && (
        <div ref={sentryRef}>
          {data.length > 0 && <LoadingSpinner horizontallyCentered noTip />}
        </div>
      )}
    </>
  );
}

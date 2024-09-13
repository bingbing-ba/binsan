'use client';
import { useEffect } from 'react';
import { NotionRenderer as Renderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import { useBlockStore } from '../store/blocks';

const area = [
  // '사용자 경험 개선을 위한 작업',
  // '개발 경험 개선을 위한 작업',
  // '시스템 설계 및 구현',
  // '목적과 결과가 잘 보이는 팀 만들기  ',
  // '강의 지원 프로그램 개발',
  // '초보자 대상 프로그래밍 강의',
  // '언어',
  // '프레임워크와 서비스',
  // '개인활동',
  '교육',
];

export const NotionRenderer = ({ recordMap }: { recordMap: Parameters<typeof Renderer>['0']['recordMap'] }) => {
  const setBlocks = useBlockStore((state) => state.setBlocks);
  useEffect(() => {
    const blocks = area
      .map((title) => {
        for (const key in recordMap.block) {
          const block = recordMap.block[key as keyof typeof recordMap.block];
          if (title === block.value.properties?.title?.[0]?.[0]) {
            return {
              id: key.replace(/-/g, ''),
              text: title,
            };
          }
        }
        return null;
      })
      .filter((x) => x !== null);
    setBlocks(blocks);
  }, [recordMap, setBlocks]);

  return <Renderer recordMap={recordMap} />;
};

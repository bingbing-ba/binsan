'use client';
import { useEffect } from 'react';
import { NotionRenderer as Renderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import { useBlockStore } from '../store/blocks';

const area: { copied_from: string; title: string }[] = [
  {
    copied_from: 'ab5158a9-fe82-49c4-b026-5b870c4b888c',
    title: '사용자 경험 개선을 위한 작업',
  },
  {
    copied_from: '381c8aba-ecbd-48e6-ab77-a7a6205b206d',
    title: '개발 경험 개선을 위한 작업',
  },
  {
    copied_from: '941f2205-a2f7-4579-b873-471698af9022',
    title: '시스템 설계 및 구현',
  },
  {
    copied_from: '6feded2c-b59d-4a0a-ad63-6baa55e31515',
    title: '목적과 결과가 잘 보이는 팀 만들기',
  },
  {
    copied_from: 'a93adad3-7ab4-4db0-bdde-8318d66a12b3',
    title: '강의 지원 프로그램 개발',
  },
  {
    copied_from: '39f9a85f-89f4-4d89-8b14-aab90c3498ce',
    title: '초보자 대상 프로그래밍 강의',
  },
  {
    copied_from: '22ecb01f-64f3-47ec-b8d0-020988571aa0',
    title: '기술',
  },
  {
    copied_from: 'f6713b4b-6142-476f-b999-83c6585618c7',
    title: '개인활동',
  },
  {
    copied_from: '71714b5d-d79d-4d9e-a695-98b87ab1ae20',
    title: '교육',
  },
];

export const NotionRenderer = ({ recordMap }: { recordMap: Parameters<typeof Renderer>['0']['recordMap'] }) => {
  const setBlocks = useBlockStore((state) => state.setBlocks);
  useEffect(() => {
    const blocks = area
      .map(({ copied_from, title }) => {
        for (const key in recordMap.block) {
          const block = recordMap.block[key as keyof typeof recordMap.block];
          // @ts-ignore
          if (copied_from === block.value.copied_from) {
            return {
              id: key.replace(/-/g, ''),
              text: title,
              element: null,
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

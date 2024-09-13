'use client';

import { throttle } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useBlockStore } from '../store/blocks';

const useScroll = () => {
  const [maxScroll, setMaxScroll] = useState(0);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    document.documentElement.getBoundingClientRect();
    window.innerHeight;

    const handleScroll = throttle(() => {
      const { height, bottom } = document.documentElement.getBoundingClientRect();
      const scrolled = Math.round(((height - bottom) / (height - window.innerHeight)) * 100) / 100;
      setScroll(scrolled);
      setMaxScroll((prev) => (prev < scrolled ? scrolled : prev));
    }, 200);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    maxScroll,
    scroll,
  };
};

const useObserver = () => {
  const blocks = useBlockStore((state) => state.blocks);
  const setReadingTime = useBlockStore((state) => state.setReadingTime);
  const elements = useMemo(() => {
    const elements = blocks.map((block) => {
      const query = '.notion-block-' + block.id;
      return document.querySelector(query);
    });
    return elements;
  }, [blocks]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const blockId = entry.target.className.match(/notion-block-(\w+)/)?.[1];
          if (!blockId) return;
          console.log({
            blockId,
            is: entry.isIntersecting,
            ratio: entry.intersectionRatio,
          })
          setReadingTime({
            blockId,
            reading: entry.isIntersecting,
            time: Math.floor(entry.time),
          });
        });
      },
      {
        rootMargin: '-10% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );
    elements.forEach((element) => element && observer.observe(element));
    return () => {
      observer.disconnect();
    };
  }, [elements, setReadingTime]);
};

export default function Statistics() {
  const { maxScroll, scroll } = useScroll();
  useObserver();
  const readingTime = useBlockStore((state) => state.readingTime);
  const blocks = useBlockStore((state) => state.blocks);

  const times = useMemo(() => {
    return blocks.map(({ id, text }) => {
      if (readingTime[id]) {
        return {
          id,
          text,
          readingTime: readingTime[id].totalTime,
        };
      }
      return {
        id,
        text,
        readingTime: 0,
      };
    });
  }, [blocks, readingTime]);
  return (
    <>
      <div className="mt-80">
        {/* 접속한지: x분 x초 스크롤: {scroll} 최대:{maxScroll} */}
        blockTime:
        {times.map(({ id, text, readingTime }) => (
          <div key={id}>
            title: {text.slice(0, 5)}, 읽은시간: {Math.floor(readingTime / 1000)}초
          </div>
        ))}
      </div>
      <div
        id="visible-area"
        className="fixed bg-[#0001]"
        style={{
          width: '100vw',
          height: '90vh',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      ></div>
    </>
  );
}

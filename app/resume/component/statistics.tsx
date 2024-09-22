'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBlockStore } from '../store/blocks';

const useObserver = () => {
  const blocks = useBlockStore((state) => state.blocks);
  const setReadingInfo = useBlockStore((state) => state.setReadingInfo);
  const renewReadingInfo = useBlockStore((state) => state.renewReadingInfo);
  const elements = useMemo(() => {
    const elements = blocks.map((block) => {
      const query = '.notion-block-' + block.id;
      return { element: document.querySelector(query), blockId: block.id };
    });
    return elements;
  }, [blocks]);
  const [paused, setPaused] = useState(false);
  const pause = useCallback(() => setPaused(true), []);
  const play = useCallback(() => setPaused(false), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const blockId = entry.target.className.match(/notion-block-(\w+)/)?.[1];
          if (!blockId) return;
          setReadingInfo({
            blockId,
            reading: entry.isIntersecting,
          });
        });
      },
      {
        rootMargin: '-15% 0px',
        threshold: [0, 1],
      }
    );
    elements.forEach(({ element }) => {
      if (element) {
        observer.observe(element);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, [elements, setReadingInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;
      renewReadingInfo();
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, renewReadingInfo]);

  return {
    pause,
    play,
    elements,
  };
};

export default function Statistics() {
  const { pause, play, elements } = useObserver();
  const readingTime = useBlockStore((state) => state.readingInfo);
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

  const [folded, setFolded] = useState(true);
  const toggleFold = useCallback(() => {
    if (folded) {
      pause();
      document.body.style.overflow = 'hidden';
    } else {
      play();
      document.body.style.overflow = '';
    }
    setFolded(!folded);
  }, [folded, pause, play]);
  return (
    <>
      <div
        className="fixed bottom-4 right-4 w-12 h-12 rounded-[24px] bg-slate-400 p-2 text-gray-800 hover:shadow-lg cursor-pointer"
        onClick={toggleFold}
      >
        <ChartSVG />
      </div>
      {folded === false && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-[#9999]"
          id="modal-bg"
          onClick={(e) => {
            const el = e.target as HTMLDivElement;
            if (el.id === 'modal-bg') {
              toggleFold();
            }
          }}
        >
          <div
            className="w-full max-w-[512px] h-[60vh] bg-white absolute p-5"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {times.map(({ id, text, readingTime }) => (
              <div key={id} className="flex gap-4 mb-4">
                <div
                  className="whitespace-nowrap overflow-hidden text-ellipsis w-32 cursor-pointer text-indigo-500 underline"
                  onClick={() => {
                    const block = elements.find(({ blockId }) => blockId === id);
                    if (block?.element) {
                      block.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                    }
                    toggleFold();
                  }}
                >
                  {text}
                </div>
                <div>읽은 시간: {Math.floor(readingTime / 1000)}초</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ChartSVG() {
  return (
    <svg className="w-full h-full" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" />
      <path d="M16 16.5H112" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M21.5 33V71.5408C21.5 75.3908 24.6091 78.5182 28.4591 78.5407L95.9357 78.9353C102.036 78.971 107 74.0358 107 67.9355V33.5"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path d="M43 47V60M64 41.5V60M85.5 36.5V60" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M64.5 79.5V101.5M64.5 101.5L38 113M64.5 101.5L91.5 113"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

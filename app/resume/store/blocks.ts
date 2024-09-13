import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type BlockStore = {
  blocks: { id: string; text: string }[];
  setBlocks: (p: BlockStore['blocks']) => void;
  readingTime: {
    [blockId: string]: {
      reading: boolean;
      readingStartedAt: number;
      totalTime: number;
    };
  };
  setReadingTime: (p: { blockId: string; reading: boolean; time: number }) => void;
};

export const useBlockStore = create<BlockStore>()(
  devtools((set) => {
    return {
      blocks: [],
      setBlocks: (p) => {
        set({ blocks: p });
      },
      readingTime: {},
      setReadingTime: ({ blockId, reading, time }) => {
        set((state) => {
          const readingTime = state.readingTime[blockId];
          if (reading) {
            if (!readingTime) {
              return {
                readingTime: {
                  ...state.readingTime,
                  [blockId]: {
                    reading: true,
                    readingStartedAt: time,
                    totalTime: 0,
                  },
                },
              };
            }
            if (!readingTime.reading) {
              return {
                readingTime: {
                  ...state.readingTime,
                  [blockId]: {
                    reading: true,
                    readingStartedAt: time,
                    totalTime: readingTime.totalTime,
                  },
                },
              };
            }
            return {};
          }
          if (!readingTime) return {};
          if (readingTime.reading) {
            const totalTime = readingTime.totalTime + (time - readingTime.readingStartedAt);
            return {
              readingTime: {
                ...state.readingTime,
                [blockId]: {
                  reading: false,
                  readingStartedAt: 0,
                  totalTime,
                },
              },
            };
          }
          return {};
        });
      },
    };
  })
);

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type BlockStore = {
  blocks: { id: string; text: string }[];
  setBlocks: (p: BlockStore['blocks']) => void;
  readingInfo: {
    [blockId: string]: {
      reading: boolean;
      readingStartedAt: number;
      totalTime: number;
    };
  };
  setReadingInfo: (p: { blockId: string; reading: boolean }) => void;
  renewReadingInfo: () => void;
};

export const useBlockStore = create<BlockStore>()(
  devtools((set) => {
    return {
      blocks: [],
      setBlocks(p) {
        set({ blocks: p });
      },
      readingInfo: {},
      setReadingInfo({ blockId, reading }) {
        set((state) => {
          const readingInfo = state.readingInfo[blockId];
          const now = Date.now();
          if (reading) {
            // entering firstTime
            if (!readingInfo) {
              return {
                readingInfo: {
                  ...state.readingInfo,
                  [blockId]: {
                    reading: true,
                    readingStartedAt: now,
                    totalTime: 0,
                  },
                },
              };
            }

            // restart reading
            if (!readingInfo.reading) {
              return {
                readingInfo: {
                  ...state.readingInfo,
                  [blockId]: {
                    reading: true,
                    readingStartedAt: now,
                    totalTime: readingInfo.totalTime,
                  },
                },
              };
            }
            return {};
          }
          if (!readingInfo) return {};

          // end reading
          if (readingInfo.reading) {
            return {
              readingInfo: {
                ...state.readingInfo,
                [blockId]: {
                  reading: false,
                  readingStartedAt: 0,
                  totalTime: readingInfo.totalTime,
                },
              },
            };
          }
          return {};
        });
      },
      renewReadingInfo() {
        set((store) => {
          const readingBlocks = Object.entries(store.readingInfo).filter(
            ([blockId, readingTime]) => readingTime.reading
          );
          const now = Date.now();
          const renewed = readingBlocks.reduce((acc, cur) => {
            const [blockId, readingBlock] = cur;
            const totalTime = now - readingBlock.readingStartedAt;
            return {
              ...acc,
              [blockId]: {
                ...readingBlock,
                totalTime,
              },
            };
          }, {} as BlockStore['readingInfo']);
          return {
            readingInfo: {
              ...store.readingInfo,
              ...renewed,
            },
          };
        });
      },
    };
  })
);

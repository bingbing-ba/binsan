import { Metadata } from 'next';
import { getNotionPage } from '../lib/getNotion';
import { NotionRenderer } from './component/Notion';
import Statistics from './component/statistics';

export default async function Resume() {
  const blocks = await getNotionPage();
  return (
    <div className="py-10">
      <header className="notion notion-page">
        <h1 className="notion notion-title mt-5">송빈산 이력서</h1>
      </header>
      <NotionRenderer recordMap={blocks} />
      <Statistics />
    </div>
  );
}

export const metadata: Metadata = {
  title: '송빈산 이력서',
  description: '데이터 기반 UX 향상 전문 프론트엔드 개발자',
  openGraph: {
    title: '송빈산 이력서',
    description: '데이터 기반 UX 향상 전문 프론트엔드 개발자',
  },
};

'use server';

import { NotionAPI } from 'notion-client';

const notion = new NotionAPI();
const resumePageId = 'fb1c6d26890940a3a9f3bd083b555671';
export const getNotionPage = async () => {
  const page = await notion.getPage(resumePageId);
  return page;
};

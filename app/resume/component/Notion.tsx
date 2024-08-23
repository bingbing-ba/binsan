'use client';
import { NotionRenderer as Renderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';

export const NotionRenderer = ({ recordMap }: { recordMap: Parameters<typeof Renderer>['0']['recordMap'] }) => {
  return <Renderer recordMap={recordMap} />;
};

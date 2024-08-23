'use client';

import { throttle } from 'lodash';
import { useEffect } from 'react';

export default function Statistics() {
  useEffect(() => {
    const documentEl = document.documentElement;
    const body = document.body;
    const scrollTop = documentEl.scrollTop || body.scrollTop;
    throttle(() => {});
  });
  return <div>접속한지: x분 x초 스크롤이 오래 머무른 영역: 어디(x초) 클릭한 링크: ~~</div>;
}

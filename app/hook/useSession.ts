'use client';

function getRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

type Session = {
  expiredAt: number;
  startedAt: number;
  sessionId: string;
};

const sessionKey = 'asl3ekkksld122aaa';

const makeNewSession = () => {
  const now = Date.now();
  const MINUTE15 = 1000 * 60 * 15;
  const newSession: Session = {
    expiredAt: now + MINUTE15,
    startedAt: now,
    sessionId: getRandomString(),
  };

  sessionStorage.setItem(sessionKey, JSON.stringify(newSession));

  return newSession;
};

/** 순수 함수가 아님. get하는 것처럼 return 하지만 내부적으로 session이 갱신되거나 새로 생성됨 */
export const getSession = () => {
  const now = Date.now();
  const MINUTE15 = 1000 * 60 * 15;

  const stringedSession = sessionStorage.getItem(sessionKey);
  if (!stringedSession) {
    return makeNewSession();
  }

  const session = JSON.parse(stringedSession) as Session;
  if (session.expiredAt < now) {
    return makeNewSession();
  }

  session.expiredAt = now + MINUTE15;
  sessionStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
};

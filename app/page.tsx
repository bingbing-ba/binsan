import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href={'/resume'}>이력서보기</Link>
    </main>
  );
}

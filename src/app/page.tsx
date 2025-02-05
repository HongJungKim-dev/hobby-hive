
export default function IntroPage() {
  return (
    <main>
     <h1>나만의 취미 공간, 여기서 시작하세요!</h1>
    </main>
  );
}

// force-static으로 설정하여 항상 SSG로 동작하도록 함
export const dynamic = 'force-static';

export const metadata = {
  title: 'Hobby Hive - 취미 생활의 시작',
  description: '취미 정보 제공 및 공유 플랫폼',
}; 
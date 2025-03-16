import { redirect } from "next/navigation";

export default function Home() {
  // 이제 메인 페이지는 introduce 페이지로 리디렉션됩니다
  redirect("/introduce");
}

// head 태그에 메타데이터 삽입
export const metadata = {
  title: "Hobby Hive - 메인 피드",
  description: "다양한 취미 활동을 공유하는 공간입니다.",
};

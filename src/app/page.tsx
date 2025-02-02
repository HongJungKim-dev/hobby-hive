import { Suspense } from "react";
import { supabase } from "@utils/supabase";
import ClientImageGrid from "@components/ClientImageGrid";

// icons
import { MdHome, MdSearch } from "react-icons/md";
import { GoPlusCircle } from "react-icons/go";

// style
import "@styles/app/page.scss";

const PAGE_SIZE = 5;

// 서버 컴포넌트
async function ImageGrid() {
  const { data: initialFiles, error } = await supabase.storage
    .from("media")
    .list("", {
      limit: PAGE_SIZE,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    return <div>에러가 발생했습니다</div>;
  }

  const initialFilesWithUrls = await Promise.all(
    initialFiles.map(async (file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(file.name);
      return {
        id: file.id,
        name: file.name,
        url: publicUrl,
        metadata: {
          mimetype: file.metadata?.mimetype || "unknown",
        },
      };
    })
  );

  return <ClientImageGrid initialFiles={initialFilesWithUrls} />;
}

// 메인 페이지
export default function Home() {
  return (
    <main className="main --font-spoqa">
      <article className="layout">
        <nav className="layout-nav --font-roboto">
          <h1 className="logo">hobby-hive</h1>
          <ul className="nav-menu">
            {[
              { icon: <MdHome size={14} />, title: "홈" },
              { icon: <MdSearch size={14} />, title: "검색" },
              { icon: <GoPlusCircle size={14} />, title: "업로드" },
            ].map((item) => (
              <li key={`menu-item-${item.title}`} className="nav-item">
                {item.icon}
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </nav>
        <section className="layout-content">
          <Suspense fallback={<div>로딩중...</div>}>
            <ImageGrid />
          </Suspense>
        </section>
      </article>
    </main>
  );
}

// head 태그에 메타데이터 삽입
export const metadata = {
  title: "Hobby Hive - 메인 피드",
  description: "다양한 취미 활동을 공유하는 공간입니다.",
};

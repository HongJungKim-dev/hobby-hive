import { Suspense } from "react";
import { supabase } from "@utils/supabase";
import ClientImageGrid from "@components/ClientImageGrid";

// icons
import { MdHome, MdSearch } from "react-icons/md";

// style
import "@styles/app/page.scss";

// modal
import ClientUploadModalButton from "@components/modal/ClientUploadModalButton";
import ClientProfileButton from "@components/ClientProfileButton";
// types
import { IFile } from "../types/types";

const PAGE_SIZE = 5;

// 메인 페이지
export default async function Home() {
  const { data: uploadedFiles, error } = await supabase
    .from("files_upload")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching files:", error);
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const initialFiles = uploadedFiles.map((file: IFile) => ({
    id: file.id,
    file_path: file.file_path,
    description: file.description,
    created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
    updated_at: file.updated_at ? new Date(file.updated_at).toLocaleDateString("ko-KR") : null,
  }));

  return (
    <section className="layout-content">
      <Suspense fallback={<div>로딩중...</div>}>
        <ClientImageGrid initialFiles={initialFiles} />
      </Suspense>
    </section>
  );
}

// head 태그에 메타데이터 삽입
export const metadata = {
  title: "Hobby Hive - 메인 피드",
  description: "다양한 취미 활동을 공유하는 공간입니다.",
};

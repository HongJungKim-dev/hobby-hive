import { Suspense } from "react";
import ClientImageGrid from "@components/ClientImageGrid";
import { IFile } from "@/types/types";
import { createClient } from "@utils/supabase/server";
import { redirect } from 'next/navigation';

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: uploadedFiles, error } = await supabase
    .from("files_upload")
    .select("*")
    .eq('user_id', user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const initialFiles = uploadedFiles.map((file: IFile) => ({
    id: file.id,
    file_path: file.file_path,
    description: file.description,
    created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
  }));

  return (
    <section className="layout-content">
      <h2>내가 올린 게시물</h2>
      <Suspense fallback={<div>로딩중...</div>}>
        <ClientImageGrid initialFiles={initialFiles} />
      </Suspense>
    </section>
  );
}


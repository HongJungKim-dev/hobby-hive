import { Suspense } from "react";
import { createClient } from "@utils/supabase/server";
import { redirect } from 'next/navigation';
import ClientGridWithModal from '@components/ClientGridWithModal';

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: files, error } = await supabase
    .from("files_upload")
    .select("*")
    .eq('user_id', user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const initialFiles = files.map(file => ({
    id: file.id,
    file_path: file.file_path,
    description: file.description,
    created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
    updated_at: file.updated_at ? new Date(file.updated_at).toLocaleDateString("ko-KR") : null,
  }));

  return (
    <section className="layout-content">
      <h2>내가 올린 게시물</h2>
      <Suspense fallback={<div>로딩중...</div>}>
        <ClientGridWithModal userId={user.id} initialFiles={initialFiles} />
      </Suspense>
    </section>
  );
}

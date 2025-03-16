import { Suspense } from "react";
import { createClient } from "@utils/supabase/server";
import { redirect } from "next/navigation";
import ClientGridWithModal from "@components/ClientGridWithModal";
import Image from "next/image";
import "./page.style.scss";
export default async function PostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 사용자 프로필 데이터 가져오기
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userAvatar =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    "/default-avatar.png";
  const userName =
    profile?.full_name || user.user_metadata?.full_name || user.email;

  const { data: files, error } = await supabase
    .from("files_upload")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const initialFiles = files.map((file) => ({
    id: file.id,
    file_path: file.file_path,
    description: file.description,
    created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
    updated_at: file.updated_at
      ? new Date(file.updated_at).toLocaleDateString("ko-KR")
      : null,
  }));

  return (
    <section className="layout-content">
      <div className="user-profile-header">
        <div className="profile-container">
          <div className="profile-image">
            <Image
              src={userAvatar}
              alt="사용자 프로필"
              width={50}
              height={50}
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <h3 className="user-name">{userName}</h3>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>로딩중...</div>}>
        <ClientGridWithModal userId={user.id} initialFiles={initialFiles} />
      </Suspense>
    </section>
  );
}

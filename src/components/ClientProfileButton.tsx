"use client";

import { MdPerson } from "react-icons/md";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import "@styles/globals.scss";
import "./ClientProfileButton.style.scss";

const PAGE_SIZE = 5;

export default function ClientProfileButton() {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleClick = () => {
    if (session) {
      router.push("/posts");
    } else {
      router.push("/login");
    }
  };

  const prefetchUserPosts = async () => {
    if (!session?.user?.id) return;

    await queryClient.prefetchQuery({
      queryKey: ['files', session.user.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("files_upload")
          .select("*")
          .eq('user_id', session.user.id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        return data.map((file) => ({
          id: file.id,
          file_path: file.file_path,
          description: file.description,
          created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
          updated_at: file.updated_at ? new Date(file.updated_at).toLocaleDateString("ko-KR") : null,
        }));
      },
    });
  };

  return (
    <li
      className="nav-item"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <MdPerson size={14} />
      <button 
        className="basic-button"
        onMouseEnter={session ? prefetchUserPosts : undefined}
      >
        {session ? "올린글" : "로그인"}
      </button>
      {session && (
        <div onClick={handleSignOut} style={{ marginLeft: "1.2rem" }}>
          <button className="basic-button">로그아웃</button>
        </div>
      )}
    </li>
  );
}

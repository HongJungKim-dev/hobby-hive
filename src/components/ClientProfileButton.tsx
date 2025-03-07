"use client";

import { MdPerson } from "react-icons/md";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientProfileButton() {
  const session = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleClick = () => {
    if (session) {
      router.push('/posts');
    } else {
      router.push('/login');
    }
  };

  return (
    <li className="nav-item" style={{ cursor: "pointer" }}>
      <div onClick={handleClick}>
        <MdPerson size={14} />
        <span>{session ? "올린글" : "로그인"}</span>
      </div>
      {session && (
        <div onClick={handleSignOut}>
          <span>로그아웃</span>
        </div>
      )}
    </li>
  );
}

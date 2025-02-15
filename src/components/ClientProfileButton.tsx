"use client";

import { MdPerson } from "react-icons/md";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@utils/supabase";
import Link from "next/link";

export default function ClientProfileButton() {
  const session = useSession();

  return (
    <li className="nav-item" style={{ cursor: "pointer" }}>
      {session ? (
        <>
          <MdPerson size={14} />
          <span onClick={() => supabase.auth.signOut()}>로그아웃</span>
        </>
      ) : (
        <Link href="/login">
          <MdPerson size={14} />
          <span>프로필</span>
        </Link>
      )}
    </li>
  );
}

"use client";

import { MdPerson } from "react-icons/md";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@styles/globals.scss";
import "./ClientProfileButton.style.scss";
export default function ClientProfileButton() {
  const session = useSession();
  const router = useRouter();

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

  return (
    <li
      className="nav-item"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <MdPerson size={14} />
      <button className="basic-button">{session ? "올린글" : "로그인"}</button>
      {session && (
        <div onClick={handleSignOut} style={{ marginLeft: "1.2rem" }}>
          <button className="basic-button">로그아웃</button>
        </div>
      )}
    </li>
  );
}

"use client";

import { useState } from "react";
import { MdPerson } from "react-icons/md";
import LoginModal from "./LoginModal";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@utils/supabase";

export default function ClientProfileButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();

  return (
    <>
      <li
        className="nav-item"
        onClick={() => (session ? null : setIsModalOpen(true))}
        style={{ cursor: "pointer" }}
      >
        {session ? (
          <>
            <MdPerson size={14} />
            <span onClick={() => supabase.auth.signOut()}>로그아웃</span>
          </>
        ) : (
          <>
            <MdPerson size={14} />
            <span>프로필</span>
          </>
        )}
      </li>

      <LoginModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
}

"use client";

import { MdUpload } from "react-icons/md";
import { useState } from "react";
import ClientUploadModal from "./ClientUploadModal";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

export default function ClientUploadModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (!session) {
      // 로그인하지 않은 경우 로그인 모달로 이동
      router.push("/login");
      return;
    }
    // 로그인한 경우 업로드 모달 열기
    setIsModalOpen(true);
  };

  return (
    <>
      <li
        className="nav-item"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <MdUpload size={14} />
        <button className="basic-button" tabIndex={0}>
          업로드
        </button>
      </li>
      {session && (
        <ClientUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

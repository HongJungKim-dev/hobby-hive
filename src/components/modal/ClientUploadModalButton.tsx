"use client";

import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import ClientUploadModal from "./ClientUploadModal";

export default function ClientUploadModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <li className="nav-item" onClick={() => setIsModalOpen(true)}>
        <GoPlusCircle size={14} />
        <span>업로드</span>
      </li>
      {isModalOpen && (
        <ClientUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

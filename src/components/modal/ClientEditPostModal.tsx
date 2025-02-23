"use client";

import ClientEditModal from "./ClientEditModal";
import { IFile } from "@/types/types";

interface ClientEditPostModalProps {
  file: IFile;
  onClose: () => void;
}

export default function ClientEditPostModal({
  file,
  onClose,
}: ClientEditPostModalProps) {
  return (
    <ClientEditModal
      isOpen={true}
      onClose={onClose}
      editMode={true}
      initialData={file}
    />
  );
}

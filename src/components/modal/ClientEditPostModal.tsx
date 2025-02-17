"use client";

import ClientEditModal from "./ClientEditModal";
import { IFile } from "@/types/types";

interface ClientEditPostModalProps {
  file: IFile | null;
  onClose: () => void;
}
  
export default function ClientEditPostModal({ file, onClose }: ClientEditPostModalProps) {
  return (
    <>
      <ClientEditModal
        isOpen={!!file}
        onClose={onClose}
        editMode={true}
        initialData={{
          id: file?.id || 0,
          file_path: file?.file_path || "",
          description: file?.description || "",
          created_at: file?.created_at || "",
          updated_at: file?.updated_at || "",
        }}
      />
    </>
  );
}
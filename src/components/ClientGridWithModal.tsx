"use client";

import { useState } from "react";
import ClientImageGrid from "./ClientImageGrid";
import ClientEditPostModal from "./modal/ClientEditPostModal";
import { IFile } from "@/types/types";
interface ClientGridWithModalProps {
  initialFiles: IFile[];
}

export default function ClientGridWithModal({ initialFiles }: ClientGridWithModalProps) {
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

  return (
    <>
      <ClientImageGrid 
        initialFiles={initialFiles}
        onClick={(file) => setSelectedFile(file)}
      />
      {
        selectedFile && (
          <ClientEditPostModal 
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )
      }
    </>
  );
} 
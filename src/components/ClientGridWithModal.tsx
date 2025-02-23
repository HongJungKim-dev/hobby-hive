"use client";

import { useState } from "react";
import ClientImageGrid from "./ClientImageGrid";
import ClientEditPostModal from "./modal/ClientEditPostModal";
import { IFile } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@utils/supabase";

interface ClientGridWithModalProps {
  userId: string;
  initialFiles: IFile[];
}

export default function ClientGridWithModal({ userId, initialFiles }: ClientGridWithModalProps) {
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

  const { data: files } = useQuery({
    queryKey: ['files', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files_upload")
        .select("*")
        .eq('user_id', userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data.map((file: IFile) => ({
        id: file.id,
        file_path: file.file_path,
        description: file.description,
        created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
        updated_at: file.updated_at ? new Date(file.updated_at).toLocaleDateString("ko-KR") : null,
      }));
    },
    initialData: initialFiles // 서버에서 받은 초기 데이터 사용
  });

  return (
    <>
      <ClientImageGrid 
        initialFiles={files}
        onClick={(file) => setSelectedFile(file)}
      />
      {selectedFile && (
        <ClientEditPostModal 
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </>
  );
} 

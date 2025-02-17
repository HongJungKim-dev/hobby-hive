"use client";

import { Modal, message, Button, Input } from "antd";
import { supabase } from "@utils/supabase";
import { useState } from "react";
import Image from "next/image";
import { IFile } from "@/types/types";
// style
import "./ClientUploadModal.scss";

interface ClientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode?: boolean;
  initialData?: IFile;
}

// TODO ClientUploadModal 와 공통 분리하기
export default function ClientEditModal({
  isOpen,
  onClose,
  editMode = false,
  initialData,
}: ClientEditModalProps) {
  const [uploadedImageUrl] = useState<string | null>(
    initialData?.file_path || null
  );
  const [description, setDescription] = useState(initialData?.description || "");

  const handleUpdateDescription = async () => {
    if (!initialData?.id) return;

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        message.error("인증 정보를 확인할 수 없습니다.");
        return;
      }

      const { error: dbError } = await supabase
        .from("files_upload")
        .update({ 
            description: description,
            updated_at: new Date().toISOString()
        })
        .eq('id', initialData.id)
        .eq('user_id', user.id); // 현재 로그인한 사용자의 ID 사용

      if (dbError) throw dbError;

      message.success("설명이 성공적으로 수정되었습니다.");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      message.error("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal
      title={
        <div className="header">
          <span>{"게시물 수정"}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      
        <div className="content-wrapper">
          <Image
            src={uploadedImageUrl!}
            alt="업로드된 이미지"
            width={200}
            height={200}
            objectFit="contain"
          />
          <div className="text-save-area">
            <Input.TextArea
              rows={4}
              placeholder="이미지에 대한 설명을 입력해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              type="primary"
              style={{ marginTop: "10px" }}
              onClick={handleUpdateDescription}
            >
              {editMode ? "수정하기" : "저장하기"}
            </Button>
          </div>
        </div>
    </Modal>
  );
}

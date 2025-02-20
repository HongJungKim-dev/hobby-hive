"use client";

import { Modal, message, Button, Input, Upload } from "antd";
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    initialData?.file_path || null
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [uploading, setUploading] = useState(false);

  const handleUpdateDescription = async () => {
    if (!initialData?.id) return;

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        message.error("인증 정보를 확인할 수 없습니다.");
        return;
      }

      const { error: dbError } = await supabase
        .from("files_upload")
        .update({
          file_path: uploadedImageUrl,
          description: description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", initialData.id)
        .eq("user_id", user.id);

      if (dbError) throw dbError;

      message.success("게시물이 성공적으로 수정되었습니다.");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      message.error("수정 중 오류가 발생했습니다.");
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // 1. 기존 이미지 URL에서 파일명 추출
      if (initialData?.file_path) {
        const existingFileName = initialData.file_path.split("/").pop();
        if (existingFileName) {
          // 2. 기존 이미지 삭제
          const { error: deleteError } = await supabase.storage
            .from("media")
            .remove([existingFileName]);

          if (deleteError) {
            console.error("기존 이미지 삭제 실패:", deleteError);
          }
        }
      }

      // 3. 새 이미지 업로드
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 4. 새 이미지의 public URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(fileName);

      setUploadedImageUrl(publicUrl);
      message.success(
        "이미지가 업로드되었습니다. 저장하려면 수정하기를 클릭하세요."
      );
    } catch (error) {
      console.error("Error:", error);
      message.error("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
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
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleImageUpload(file);
            return false;
          }}
        >
          <div>
            {uploadedImageUrl ? (
              <Image
                src={uploadedImageUrl}
                alt="업로드된 이미지"
                width={200}
                height={200}
                objectFit="contain"
              />
            ) : (
              <div>클릭하여 이미지 업로드</div>
            )}
          </div>
        </Upload>
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
            loading={uploading}
          >
            {editMode ? "수정하기" : "저장하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

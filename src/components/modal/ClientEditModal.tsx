"use client";

import { Modal, message, Button, Input, Upload } from "antd";
import { supabase } from "@utils/supabase";
import { useState } from "react";
import Image from "next/image";
import { IFile } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // 이미지 업로드 mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // 1. 기존 이미지 삭제
      if (initialData?.file_path) {
        const existingFileName = initialData.file_path.split("/").pop();
        if (existingFileName) {
          await supabase.storage.from("media").remove([existingFileName]);
        }
      }

      // 2. 새 이미지 업로드
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(fileName);

      return publicUrl;
    },
    onSuccess: (publicUrl) => {
      setUploadedImageUrl(publicUrl);
      message.success(
        "이미지가 업로드되었습니다. 저장하려면 수정하기를 클릭하세요."
      );
    },
    onError: () => {
      message.error("이미지 업로드 중 오류가 발생했습니다.");
    },
  });

  // 설명 수정 mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!initialData?.id) throw new Error("데이터 ID가 없습니다.");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user)
        throw new Error("인증 정보를 확인할 수 없습니다.");

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
    },
    onSuccess: () => {
      message.success("게시물이 성공적으로 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["mediaFiles"],
        exact: true,
        refetchType: "all",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error:", error);
      message.error("수정 중 오류가 발생했습니다.");
    },
  });

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!initialData?.id) throw new Error("데이터 ID가 없습니다.");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user)
        throw new Error("인증 정보를 확인할 수 없습니다.");

      const { error: dbError } = await supabase
        .from("files_upload")
        .delete()
        .eq("id", initialData.id)
        .eq("user_id", user.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      message.success("게시물이 성공적으로 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["mediaFiles"],
        exact: true,
        refetchType: "all",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error:", error);
      message.error("삭제 중 오류가 발생했습니다.");
    },
  });

  return (
    <>
      <Modal
        title="삭제 확인"
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsConfirmModalOpen(false)}>
            취소
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            삭제
          </Button>,
        ]}
      >
        <p>정말로 이 게시물을 삭제하시겠습니까?</p>
      </Modal>

      <Modal
        title={
          <div className="header">
            <span>{"게시물 수정"}</span>
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              danger
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={deleteMutation.isPending || updateMutation.isPending}
            >
              삭제하기
            </Button>
            <Button
              type="primary"
              onClick={() => updateMutation.mutate()}
              loading={updateMutation.isPending}
              disabled={uploadMutation.isPending}
            >
              {editMode ? "수정하기" : "저장하기"}
            </Button>
          </div>
        }
        centered
      >
        <div className="content-wrapper">
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              uploadMutation.mutate(file);
              return false;
            }}
            disabled={uploadMutation.isPending}
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
              disabled={updateMutation.isPending}
              style={{ height: "200px" }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

"use client";

import { Modal, Upload, message, Button, Input } from "antd";
import {
  InboxOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { supabase } from "@utils/supabase";
import { useState } from "react";
import Image from "next/image";

// style
import "./ClientUploadModal.scss";

interface ClientUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientUploadModal({
  isOpen,
  onClose,
}: ClientUploadModalProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isNextStep, setIsNextStep] = useState(false);
  const [description, setDescription] = useState("");

  const handleUpload = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error, data } = await supabase.storage
      .from("media")
      .upload(fileName, file);

    if (error) {
      message.error("업로드 중 오류가 발생했습니다.");
      return false;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(fileName);

    setUploadedImageUrl(publicUrl);
    message.success("파일이 성공적으로 업로드되었습니다.");
    return true;
  };

  const handleSaveDescription = async () => {
    if (!uploadedImageUrl) {
      message.error("이미지를 먼저 업로드해주세요.");
      return;
    }

    try {
      const { data: dbData, error: dbError } = await supabase
        .from("files_upload")
        .insert([
          {
            file_path: uploadedImageUrl,
            description: description,
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) throw dbError;

      message.success("이미지와 설명이 성공적으로 저장되었습니다.");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      message.error("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal
      title={
        <div className="header">
          {(uploadedImageUrl || isNextStep) && (
            <ArrowLeftOutlined
              onClick={() => {
                if (isNextStep) {
                  setIsNextStep(false);
                } else {
                  setUploadedImageUrl(null);
                }
              }}
            />
          )}
          <span>{isNextStep ? "설명 입력" : "파일 업로드"}</span>
          <span>
            {uploadedImageUrl && !isNextStep && (
              <ArrowRightOutlined onClick={() => setIsNextStep(true)} />
            )}
          </span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      {isNextStep ? (
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
              onClick={handleSaveDescription}
            >
              저장하기
            </Button>
          </div>
        </div>
      ) : (
        <Upload.Dragger
          name="file"
          multiple={true}
          customRequest={async ({ file, onSuccess, onError }) => {
            try {
              const result = await handleUpload(file as File);
              if (result) {
                onSuccess?.(null);
              } else {
                onError?.(new Error("업로드 실패"));
              }
            } catch (err) {
              onError?.(err as Error);
            }
          }}
        >
          <p>
            <InboxOutlined />
          </p>
          <p>클릭하거나 파일을 이 영역으로 드래그하세요</p>
          <p>이미지 파일을 업로드할 수 있습니다</p>
        </Upload.Dragger>
      )}
    </Modal>
  );
}

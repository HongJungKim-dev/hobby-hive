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
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

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
  const router = useRouter();
  const queryClient = useQueryClient();

  // Modal이 닫힐 때 상태 초기화
  const initializeStateWhenClose = () => {
    setUploadedImageUrl(null);
    setIsNextStep(false);
    setDescription("");
    onClose();
  };

  useEffect(() => {
    return () => {
      initializeStateWhenClose();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  };

  // 파일 업로드 mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileExt = sanitizedFileName.split(".").pop();
      const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;

      const { error, data } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

      return publicUrl;
    },
    onSuccess: (publicUrl) => {
      setUploadedImageUrl(publicUrl);
      message.success("파일이 성공적으로 업로드되었습니다.");
    },
    onError: () => {
      message.error("업로드 중 오류가 발생했습니다.");
    }
  });

  // 설명 저장 mutation
  const saveMutation = useMutation({
    mutationFn: async ({ url, description }: { url: string, description: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      const { data, error } = await supabase
        .from("files_upload")
        .insert([
          {
            file_path: url,
            description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: user.id,
          },
        ]);

      if (error) throw error;
      return data;
    },
    retry: 1,  // 1번만 재시도
    retryDelay: 1000,  // 단순히 1초 후 재시도
    onSuccess: (data, variables) => {
      message.success("이미지와 설명이 성공적으로 저장되었습니다.");
      // 쿼리 무효화 및 리페치
      queryClient.invalidateQueries({
        queryKey: ['mediaFiles'],
        exact: true,
        refetchType: 'all'
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error:", error);
      message.error("저장 중 오류가 발생했습니다. 자동으로 재시도합니다.");
    },
    mutationKey: ['saveMedia'],  // mutation 식별 키
  });


  const handleSaveDescription = async () => {
    if (!uploadedImageUrl) {
      message.error("이미지를 먼저 업로드해주세요.");
      return;
    }

    // mutation이 이미 진행 중이면 새로운 요청은 무시됨
    if (saveMutation.isPending) {
      message.warning('저장 중입니다. 잠시만 기다려주세요.');
      return;
    }

    saveMutation.mutate({ 
      url: uploadedImageUrl, 
      description 
    });
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
      onCancel={initializeStateWhenClose}
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
              disabled={saveMutation.isPending}
            />
            <Button
              type="primary"
              style={{ marginTop: "10px" }}
              onClick={handleSaveDescription}
              loading={saveMutation.isPending}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? '저장중...' : '저장하기'}
            </Button>
          </div>
        </div>
      ) : (
        <Upload.Dragger
          name="file"
          multiple={true}
          customRequest={async ({ file, onSuccess, onError }) => {
            try {
              const isAuth = await checkAuth();
              if (!isAuth) {
                if (window.confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
                  router.push('/login');
                }
                return;
              }

              uploadMutation.mutate(file as File, {
                onSuccess: () => {
                  onSuccess?.(null);
                },
                onError: (err) => {
                  onError?.(err as Error);
                }
              });

            } catch (err) {
              onError?.(err as Error);
            }
          }}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <div>업로드 중...</div>
          ) : (
            <>
              <p><InboxOutlined /></p>
              <p>클릭하거나 파일을 이 영역으로 드래그하세요</p>
              <p>이미지 파일을 업로드할 수 있습니다</p>
            </>
          )}
        </Upload.Dragger>
      )}
    </Modal>
  );
}

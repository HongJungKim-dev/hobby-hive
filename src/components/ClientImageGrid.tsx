"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@utils/supabase";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Empty, Button } from "antd";
import Image from "next/image";
import "./ClientImageGrid.style.scss";
// types
import { IFile } from "../types/types";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const PAGE_SIZE = 5;

interface ClientImageGridProps {
  initialFiles: IFile[];
  onClick?: (file: IFile) => void;
}

export default function ClientImageGrid({
  initialFiles,
  onClick,
}: ClientImageGridProps) {
  const queryClient = useQueryClient();

  const fetchMediaFiles = async ({
    pageParam = 0,
    signal,
  }: {
    pageParam?: number;
    signal?: AbortSignal;
  }) => {
    if (signal?.aborted) {
      throw new Error("ABORTED");
    }

    try {
      const { data: files, error: filesError } = await supabase
        .from("files_upload")
        .select("*")
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
        .order("created_at", { ascending: false });

      if (signal?.aborted) {
        throw new Error("ABORTED");
      }

      if (filesError) throw filesError;

      return files.map((file: IFile) => ({
        ...file,
        created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
        updated_at: file.updated_at
          ? new Date(file.updated_at).toLocaleDateString("ko-KR")
          : null,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("쿼리가 취소되었습니다.");
        throw new Error("ABORTED");
      }
      if (
        signal?.aborted ||
        (error instanceof Error && error.message === "ABORTED")
      ) {
        console.log("쿼리가 취소되었습니다.");
        throw new Error("ABORTED");
      }
      throw error;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["mediaFiles"],
    queryFn: fetchMediaFiles,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    initialData: {
      pages: [initialFiles],
      pageParams: [0],
    },
    retry: (failureCount, error: Error) => {
      if (error.message === "ABORTED") {
        return false;
      }

      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const loadMoreRef = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.1 },
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  if (status === "error") {
    return (
      <section className="image-grid-wrapper" aria-label="취미 이미지 갤러리">
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description="데이터를 불러오는데 실패했습니다"
        >
          <Button type="primary" onClick={() => refetch()}>
            다시 시도
          </Button>
        </Empty>
      </section>
    );
  }

  const allFiles = data?.pages.flatMap((page) => page) || [];
  if (!isFetching && allFiles.length === 0) {
    return (
      <section className="image-grid-wrapper" aria-label="취미 이미지 갤러리">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="아직 업로드된 이미지가 없습니다"
        >
          <Button type="primary">첫 번째 이미지 업로드하기</Button>
        </Empty>
      </section>
    );
  }

  return (
    <section className="image-grid-wrapper" aria-label="취미 이미지 갤러리">
      {isFetching && !isFetchingNextPage && (
        <div className="loading-indicator" role="status" aria-live="polite">
          로딩중...
        </div>
      )}
      <ul className="image-grid" role="list">
        {data?.pages.map((group, i) =>
          group.map((file) => (
            <li
              key={file.id}
              className="image-grid-item"
              onClick={() => (onClick ? onClick(file) : undefined)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (onClick) onClick(file);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`이미지: ${file.description || "설명 없음"}`}
            >
              <div className="image-container">
                <Image
                  src={file.file_path}
                  alt={file.description || "업로드된 취미 이미지"}
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="grid-image"
                />
              </div>
              {file.description && (
                <p className="image-description">{file.description}</p>
              )}
            </li>
          ))
        )}
      </ul>

      <div ref={loadMoreRef} role="none" />
      {isFetchingNextPage && (
        <div className="loading-more" role="status" aria-live="polite">
          추가 데이터 로딩중...
        </div>
      )}
    </section>
  );
}

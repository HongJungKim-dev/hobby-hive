"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@utils/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  const fetchMediaFiles = async ({ pageParam = 0 }) => {
    const { data: files, error: filesError } = await supabase
      .from("files_upload")
      .select("*")
      .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
      .order("created_at", { ascending: false });

    if (filesError) throw filesError;

    return files.map((file) => ({
      ...file,
      created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
      updated_at: file.updated_at
        ? new Date(file.updated_at).toLocaleDateString("ko-KR")
        : null,
    }));
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
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

  if (status === "error")
    return (
      <div role="alert">에러가 발생했습니다. 페이지를 새로고침 해주세요.</div>
    );

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

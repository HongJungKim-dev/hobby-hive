"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@utils/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import "./ClientImageGrid.style.scss";
// types
import { IFile } from "../types/types";

const PAGE_SIZE = 5;

interface ClientImageGridProps {
  initialFiles: IFile[];
  onClick?: (file: IFile) => void;
}

export default function ClientImageGrid({
  initialFiles,
  onClick,
}: ClientImageGridProps) {
  const observerRef = useRef<IntersectionObserver>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (status === "error") return <div>에러가 발생했습니다</div>;

  return (
    <div className="image-grid-wrapper">
      {isFetching && !isFetchingNextPage && (
        <div className="loading-indicator">로딩중...</div>
      )}
      <div className="image-grid">
        {data?.pages.map((group, i) =>
          group.map((file) => (
            <div
              key={file.id}
              className="image-grid-item"
              onClick={() => onClick && onClick(file)}
            >
              <div className="image-container">
                <Image
                  src={file.file_path}
                  alt={file.description || "업로드된 이미지"}
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
            </div>
          ))
        )}
      </div>

      <div ref={loadMoreRef} />
      {isFetchingNextPage && (
        <div className="loading-more">추가 데이터 로딩중...</div>
      )}
    </div>
  );
}

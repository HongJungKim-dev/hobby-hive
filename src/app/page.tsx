"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 5; // 한 페이지당 9개 항목

export default function Home() {
  const observerRef = useRef<IntersectionObserver>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchMediaFiles = async ({ pageParam = 0 }) => {
    const { data: files, error: filesError } = await supabase.storage
      .from("media")
      .list("", {
        limit: PAGE_SIZE,
        offset: pageParam * PAGE_SIZE,
        sortBy: { column: "name", order: "asc" },
      });

    if (filesError) throw filesError;

    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from("media").getPublicUrl(file.name);
        return { ...file, url: publicUrl };
      })
    );

    return filesWithUrls;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["mediaFiles"],
      queryFn: fetchMediaFiles,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === PAGE_SIZE ? allPages.length : undefined,
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
    <>
      <h1 className="font-roboto">hobby-hive</h1>
      <div>
        <div>
          {data?.pages.map((group) =>
            group.map((file) => (
              <div key={file.id}>
                {file.metadata?.mimetype?.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <p>{file.name}</p>
                )}
              </div>
            ))
          )}
        </div>
        <div ref={loadMoreRef} />
        {isFetchingNextPage && <div>추가 데이터 로딩중...</div>}
      </div>
    </>
  );
}

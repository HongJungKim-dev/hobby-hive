"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@utils/supabase";

const PAGE_SIZE = 5;

export default function StartButton() {
  const queryClient = useQueryClient();

  const fetchMediaFiles = async ({ pageParam = 0 }) => {
    const { data: files, error } = await supabase
      .from("files_upload")
      .select("*")
      .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return files.map((file) => ({
      ...file,
      created_at: new Date(file.created_at).toLocaleDateString("ko-KR"),
      updated_at: file.updated_at
        ? new Date(file.updated_at).toLocaleDateString("ko-KR")
        : null,
    }));
  };

  const prefetchAllMedia = async () => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["mediaFiles"],
      queryFn: fetchMediaFiles,
      initialPageParam: 0,
      getNextPageParam: (lastPage: unknown[], allPages: unknown[][]) =>
        lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    });
  };

  return (
    <Link 
      href="/all" 
      className="start-button"
      onMouseEnter={prefetchAllMedia}
    >
      시작하기
    </Link>
  );
} 
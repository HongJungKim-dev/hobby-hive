import { useEffect, useRef, useCallback } from "react";

interface UseIntersectionObserverProps {
  onIntersect: () => void; // 관찰 대상 요소가 뷰포트와 교차할 때 실행될 콜백 함수
  options?: IntersectionObserverInit; // IntersectionObserver의 옵션
  enabled?: boolean; // 관찰을 시작할지 여부를 결정하는 조건
}

/**
 * 요소의 뷰포트 교차를 관찰하는 커스텀 훅
 */
export const useIntersectionObserver = ({
  onIntersect,
  options = { threshold: 0.1 },
  enabled = true,
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // options를 메모이제이션
  const stableOptions = useRef(options);
  stableOptions.current = options;

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) {
      // 비활성화되면 기존 observer 정리
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // 기존 observer가 있으면 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    }, stableOptions.current);

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [onIntersect, enabled]); // options 제거, onIntersect와 enabled만 의존

  return targetRef;
};

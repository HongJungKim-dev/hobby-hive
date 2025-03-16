"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ClientIntroduceFeatureSection() {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Intersection Observer 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    // 모든 feature 요소에 observer 연결
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // 컴포넌트 언마운트시 observer 해제
    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section
      className="feature-section"
      aria-labelledby="feature-section-title"
    >
      <h2 id="feature-section-title">주요 기능</h2>

      <div
        className="feature-item"
        ref={(el) => {
          featureRefs.current[0] = el;
        }}
        tabIndex={0}
      >
        <div className="feature-image-container">
          <Image
            src="/images/전체게시물.png"
            alt="취미 이미지 공유 기능 화면 예시"
            width={500}
            height={350}
            className="feature-image"
          />
        </div>
        <div className="feature-content">
          <h3 id="feature-1-title">취미 이미지 공유</h3>
          <p>
            나만의 취미 활동을 이미지로 기록하고 다른 사람들과 공유해보세요.
          </p>
          <p>
            당신의 취미 활동을 사진으로 기록하고, 다른 사람들과 함께 나눠보세요.
            취미 커뮤니티에서 새로운 아이디어를 얻거나 영감을 받을 수 있습니다.
          </p>
        </div>
      </div>

      <div
        className="feature-item reverse"
        ref={(el) => {
          featureRefs.current[1] = el;
        }}
        tabIndex={0}
      >
        <div className="feature-image-container">
          <Image
            src="/images/올린글.png"
            alt="개인 갤러리"
            width={500}
            height={350}
            className="feature-image"
          />
        </div>
        <div className="feature-content">
          <h3 id="feature-2-title">개인 갤러리</h3>
          <p>내가 올린 이미지를 한 곳에서 모아볼 수 있습니다.</p>
          <p>
            시간 순으로 정리된 나만의 갤러리에서 취미 활동의 발전 과정을
            확인해보세요. 과거의 작품들을 돌아보며 성장을 느낄 수 있습니다.
          </p>
        </div>
      </div>

      <div
        className="feature-item"
        ref={(el) => {
          featureRefs.current[2] = el;
        }}
        tabIndex={0}
      >
        <div className="feature-image-container">
          <Image
            src="/images/업로드.png"
            alt="이미지 업로드"
            width={500}
            height={350}
            className="feature-image"
          />
        </div>
        <div className="feature-content">
          <h3 id="feature-3-title">이미지 업로드</h3>
          <p>자신의 취미 작품을 쉽고 빠르게 업로드할 수 있습니다.</p>
          <p>
            원하는 사진을 선택하고 제목과 설명을 추가하여 나만의 작품을
            공유해보세요. 간편한 업로드 기능으로 언제든지 당신의 취미 활동을
            기록할 수 있습니다.
          </p>
        </div>
      </div>

      <div
        className="feature-item reverse"
        ref={(el) => {
          featureRefs.current[3] = el;
        }}
        tabIndex={0}
      >
        <div className="feature-image-container">
          <Image
            src="/images/수정.png"
            alt="게시물 수정"
            width={500}
            height={350}
            className="feature-image"
          />
        </div>
        <div className="feature-content">
          <h3 id="feature-4-title">게시물 수정</h3>
          <p>업로드한 게시물의 내용을 언제든지 수정할 수 있습니다.</p>
          <p>
            내용이나 제목에 변경이 필요할 때 간편하게 수정할 수 있어요. 더
            정확한 정보나 추가 설명이 필요할 때 게시물을 업데이트해보세요.
          </p>
        </div>
      </div>

      <div
        className="feature-item"
        ref={(el) => {
          featureRefs.current[4] = el;
        }}
        tabIndex={0}
      >
        <div className="feature-image-container">
          <Image
            src="/images/삭제.png"
            alt="게시물 삭제"
            width={500}
            height={350}
            className="feature-image"
          />
        </div>
        <div className="feature-content">
          <h3 id="feature-5-title">게시물 삭제</h3>
          <p>더 이상 필요하지 않은 게시물을 쉽게 삭제할 수 있습니다.</p>
          <p>
            삭제 기능을 통해 갤러리를 정리하고 원하는 콘텐츠만 유지할 수 있어요.
            실수로 올린 게시물이나 오래된 작품을 간편하게 관리하세요.
          </p>
        </div>
      </div>
    </section>
  );
}

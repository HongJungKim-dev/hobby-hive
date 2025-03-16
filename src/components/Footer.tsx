import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo" aria-label="사이트 정보">
      <div className="footer-content">
        <div className="footer-section">
          <h2 id="footer-heading-about">Hobby Hive</h2>
          <p>다양한 취미를 공유하는 커뮤니티입니다.</p>
        </div>

        <div className="footer-section">
          <h2 id="footer-heading-links">사이트 링크</h2>
          <nav aria-labelledby="footer-heading-links">
            <ul>
              <li>
                <Link href="/" aria-label="홈 페이지로 이동">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/introduce" aria-label="서비스 소개 페이지로 이동">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/all" aria-label="모든 게시물 둘러보기">
                  둘러보기
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-section">
          <h2 id="footer-heading-contact">문의하기</h2>
          <address>
            <p>
              이메일:{" "}
              <a
                href="mailto:contact@hobbyhive.com"
                aria-label="이메일로 문의하기"
              >
                contact@hobbyhive.com
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          <small>
            &copy; {new Date().getFullYear()} Hobby Hive. All rights reserved.
          </small>
        </p>
      </div>
    </footer>
  );
}

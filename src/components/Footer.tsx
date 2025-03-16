import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Hobby Hive</h3>
          <p>다양한 취미를 공유하는 커뮤니티입니다.</p>
        </div>

        <div className="footer-section">
          <h3>링크</h3>
          <ul>
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>
              <Link href="/introduce">서비스 소개</Link>
            </li>
            <li>
              <Link href="/all">둘러보기</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>문의</h3>
          <p>이메일: contact@hobbyhive.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Hobby Hive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

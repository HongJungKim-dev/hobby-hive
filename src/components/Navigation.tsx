"use client";

import { MdHome, MdSearch, MdInfo } from "react-icons/md";
import Link from "next/link";
import ClientUploadModalButton from "./modal/ClientUploadModalButton";
import ClientProfileButton from "./ClientProfileButton";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={`header-nav ${isScrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="메인 내비게이션"
      >
        <div className="nav-container">
          <Link
            href="/"
            className="logo"
            aria-label="홈페이지로 이동"
            tabIndex={0}
          >
            <h1>hobby-hive</h1>
          </Link>
          <div className="nav-actions">
            <Suspense
              fallback={
                <div role="status" aria-live="polite">
                  로딩중...
                </div>
              }
            >
              <ClientUploadModalButton />
              <ClientProfileButton />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  );
}

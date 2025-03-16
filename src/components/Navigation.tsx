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
    <nav className={`header-nav ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link href="/" className="logo">
          <h1>hobby-hive</h1>
        </Link>
        <div className="nav-actions">
          <Suspense fallback={<div>로딩중...</div>}>
            <ClientUploadModalButton />
            <ClientProfileButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

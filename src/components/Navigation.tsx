"use client";

import { MdHome, MdSearch, MdInfo } from "react-icons/md";
import Link from 'next/link';
import ClientUploadModalButton from "./modal/ClientUploadModalButton";
import ClientProfileButton from "./ClientProfileButton";
import { Suspense } from "react";

export default function Navigation() {
  return (
    <nav className="layout-nav --font-roboto">
      <h1 className="logo">hobby-hive</h1>
      <ul className="nav-menu">
        {[
          {
            icon: <MdHome size={14} />,
            title: "홈",
            href: "/"
          },
          // {
          //   icon: <MdSearch size={14} />,
          //   title: "검색",
          //   href: "/search"
          // },
          {
            icon: <MdInfo size={14} />,
            title: "서비스 소개",
            href: "/introduce"
          }
        ].map((item) => (
          <li key={`menu-item-${item.title}`}>
            <Link href={item.href} className="nav-item">
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
        <Suspense fallback={<div>로딩중...</div>}>
          <ClientUploadModalButton />
          <ClientProfileButton />
        </Suspense>
      </ul>
    </nav>
  );
} 

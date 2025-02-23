"use client";

import { MdHome, MdSearch } from "react-icons/md";
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
          },
          {
            icon: <MdSearch size={14} />,
            title: "검색",
          },
        ].map((item) => (
          <li key={`menu-item-${item.title}`} className="nav-item">
            {item.icon}
            <span>{item.title}</span>
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

"use client";

import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./page.module.css";

export default function HeaderNav() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <div className={styles.topbar}>
      <nav className={styles.nav}>
        <a
          className={`${styles.navLink} ${
            pathname === "/" ? styles.navLinkActive : ""
          }`}
          href="/"
        >
          Habits
        </a>
        <a
          className={`${styles.navLink} ${
            pathname?.startsWith("/goals") ? styles.navLinkActive : ""
          }`}
          href="/goals"
        >
          Goals
        </a>
      </nav>
      <LogoutButton />
    </div>
  );
}

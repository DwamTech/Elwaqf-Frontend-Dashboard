'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.css";
import {
  FaHome,
  FaLandmark,
  FaThumbtack,
  FaPhone,
  FaChevronDown,
  FaInfoCircle,
  FaBook,
  FaCoins,
  FaChartBar,
  FaCalendarAlt,
  FaSmile,
  FaLightbulb,
  FaExclamationTriangle,
  FaClipboard,
} from "react-icons/fa";

export default function HeaderNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isNews = pathname.startsWith("/news");

  return (
    <nav>
      <ul className={styles.nav}>
        <li className={`${styles.navItem} ${isHome ? styles.navItemActive : ""}`}>
          <Link href="/"><FaHome className={styles.navIcon} aria-hidden />الرئيسية</Link>
        </li>
        <li className={`${styles.navItem} ${styles.hasDropdown}`}>
          <a href="#"><FaLandmark className={styles.navIcon} aria-hidden />الحكومه<FaChevronDown className={styles.chevron} aria-hidden /></a>
          <div className={styles.dropdownMenu}>
            <Link href="/about"><FaInfoCircle className={styles.iconPrimary} />عن الوقف</Link>
            <a href="#policies"><FaBook className={styles.iconSecondary} />اللوائح والسياسات</a>
            <a href="#"><FaCoins className={styles.iconPrimary} />مصارف الريع</a>
            <Link href="/reports/financial"><FaChartBar className={styles.iconSecondary} />التقارير المالية</Link>
            <Link href="/reports/annual"><FaCalendarAlt className={styles.iconPrimary} />التقارير السنوية</Link>
          </div>
        </li>
        <li className={`${styles.navItem} ${isNews ? styles.navItemActive : ""}`}>
          <Link href="/news"><FaThumbtack className={styles.navIcon} aria-hidden />أخبار الوقف</Link>
        </li>
        <li className={`${styles.navItem} ${styles.hasDropdown}`}>
          <a href="#"><FaPhone className={styles.navIcon} aria-hidden />تواصل معنا<FaChevronDown className={styles.chevron} aria-hidden /></a>
          <div className={`${styles.dropdownMenu} ${styles.dropdownWide}`}>
            <a href="#"><FaSmile className={styles.iconSuccess} />تقييم رضا المستفيدين</a>
            <a href="#"><FaLightbulb className={styles.iconIdea} />صندوق الاقتراحات</a>
            <a href="#"><FaExclamationTriangle className={styles.iconSuccess} />صندوق الشكاوي</a>
          </div>
        </li>
        <li className={styles.navItem}>
          <a href="#"><FaClipboard className={styles.navIcon} aria-hidden />طلبات الدعم</a>
        </li>
      </ul>
    </nav>
  );
}

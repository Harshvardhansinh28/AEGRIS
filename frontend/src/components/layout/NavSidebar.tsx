'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PieChart,
  ShieldAlert,
  BrainCircuit,
  Rocket,
  Activity,
  BarChart3,
  Cpu,
  Database,
  Settings,
  Menu,
  ChevronLeft,
} from 'lucide-react';
import styles from './NavSidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: PieChart, label: 'Portfolio', href: '/portfolio' },
  { icon: ShieldAlert, label: 'Risk Engine', href: '/risk' },
  { icon: BrainCircuit, label: 'Training Gym', href: '/training' },
  { icon: Rocket, label: 'Deployment', href: '/deployment' },

  { icon: Activity, label: 'Live Signals', href: '/signals' },
  { icon: BarChart3, label: 'Backtests', href: '/backtests' },
  { icon: Cpu, label: 'Models', href: '/models' },
  { icon: Database, label: 'Datasets', href: '/datasets' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function NavSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      className={styles.sidebar}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/aegris.png" alt="AEGRIS" width={32} height={32} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className={styles.logoText}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
              >
                AEGRIS<span className={styles.brandAccent}>™</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className={styles.navStack}>
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className={styles.link}>
              <div className={`${styles.navItem} ${active ? styles.active : ''}`}>
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}

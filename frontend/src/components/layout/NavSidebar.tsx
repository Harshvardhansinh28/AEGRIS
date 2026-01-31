'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    PieChart,
    ShieldAlert,
    BrainCircuit,
    Rocket,
    Settings,
    Menu,
    ChevronLeft
} from 'lucide-react';
import styles from './NavSidebar.module.css';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: PieChart, label: 'Portfolio', href: '/portfolio' },
    { icon: ShieldAlert, label: 'Risk Engine', href: '/risk' },
    { icon: BrainCircuit, label: 'Training Gym', href: '/training' },
    { icon: Rocket, label: 'Deployment', href: '/deployment' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function NavSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <motion.div
            className={styles.sidebar}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
            <div className={styles.header}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoIcon} />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                className={styles.logoText}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                AegisRL™
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    className={styles.collapseBtn}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className={styles.navStack}>
                {navItems.map((item, index) => {
                    // Simple check: active if strict match or starts with (except root)
                    const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                    return (
                        <Link key={index} href={item.href} style={{ textDecoration: 'none' }}>
                            <div
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <item.icon size={22} className={isActive ? styles.activeIcon : ''} />

                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            className={styles.navLabel}
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && !collapsed && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className={styles.activeIndicator}
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className={styles.footer}>
                {!collapsed && (
                    <div className={styles.statusBadge}>
                        <span className={styles.statusDot}></span>
                        Online
                    </div>
                )}
            </div>
        </motion.div>
    );
}


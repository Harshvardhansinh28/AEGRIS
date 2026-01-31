'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={styles.toggleButton}
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={styles.iconWrapper}
            >
                {theme === 'dark' ? (
                    <Moon size={20} stroke="var(--accent-primary)" />
                ) : (
                    <Sun size={20} className="text-yellow-500" stroke="var(--accent-secondary)" />
                )}
            </motion.div>
        </button>
    );
}

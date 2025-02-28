import React from 'react';
import { useTheme } from './ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    return (
        <button onClick={toggleTheme}>
            {theme === 'dark' ? t("День") : t("Ночь")}
        </button>
    );
};

export default ThemeToggle;
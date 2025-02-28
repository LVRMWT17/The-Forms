import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const changeLanguage = (lng) => {
        console.log(`Changing language to: ${lng}`);
        i18n.changeLanguage(lng);
    };
    return (
        <div>
            <button onClick={() => changeLanguage('en')} style={{color: 'rgb(0, 0, 0)'}}>En</button>
            <button onClick={() => changeLanguage('ru')} style={{color: 'rgb(0, 0, 0)', margin: '3px'}}>Ru</button>
        </div>
    );
};

export default LanguageSwitcher;
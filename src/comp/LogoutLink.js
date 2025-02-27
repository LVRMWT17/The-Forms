import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const LogoutLink = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/Home');
    };

    return (
        <span onClick={handleLogout} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
            {t("Выйти")}
        </span>
    );
};

export default LogoutLink;
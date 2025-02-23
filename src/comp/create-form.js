import React from 'react';
import { Link } from 'react-router-dom';
import FormBuilder from './FormBuilder'
import { useTranslation } from 'react-i18next';

const Creation = () => {
    const userId = localStorage.getItem('userId');
    const { t, i18n } = useTranslation();
    if (!userId) {
        return (
            <div>
                <p>{t("Пожалуйста, войдите в систему, чтобы создать форму")}</p>
                <ul>
                    <li><Link to="/comp/login">{t("Login")}</Link></li>
                    <li><Link to="/comp/register">{t("Register")}</Link></li>
                </ul>
            </div>
        ); 
    }
    return (
        <div>
            <h1>{t("Ваша форма")}</h1>
            <FormBuilder userId={userId} />
        </div>
    );
};

export default Creation;
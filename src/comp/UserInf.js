import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserInf = ({ user }) => {
    const {t} = useTranslation();
    return (
        <div style={{fontFamily: 'Calibri'}}>
            <h1>{t("Профиль пользователя")}</h1>
            <p>ID: {user.id}</p>
            <p>{t("First Name")}: {user.first_name}</p>
            <p>{t("Last Name")}: {user.last_name}</p>
            <p>Email: {user.email}</p>
            <Link to='/UserInfEdit'>
                <button aria-label={t("Edit User Info")}>{t("Edit")}</button>
                </Link>
        </div>
    );
};

export default UserInf;
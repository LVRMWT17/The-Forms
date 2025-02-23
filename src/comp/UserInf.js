import React from 'react';
import { useTranslation } from 'react-i18next';

const UserInf = ({ user }) => {
    const { t, i18n } = useTranslation();
    return (
        <div>
            <h1>{t("Профиль пользователя")}</h1>
            <p>ID: {user.id}</p>
            <p>{t("First Name")}: {user.first_name}</p>
            <p>{t("Last Name")}: {user.last_name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default UserInf;
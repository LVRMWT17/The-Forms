import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserInf from './UserInf'
import { useTranslation } from 'react-i18next';
function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();
const { t, i18n } = useTranslation();
    const getUserById = async (id) => {
        const response = await fetch(`http://localhost:5001/users/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Ошибка при получении данных пользователя: ${errorMessage}`);
        }
        return await response.json();
    };
    const goBack = () => {
        navigate(-1);
    };
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true); 
    useEffect(() => {
        const fetchUser  = async () => {
            try {
                const userData = await getUserById(id);
                setUser (userData);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser ();
    }, [id]);

    if (loading) {
        return <div>{t("Загрузка")}</div>;
    }

    if (!user) {
        return <div>{t("Пользователь не найден")}</div>;
    }

    return (
        <div>
        <button onClick={goBack}>{t("Назад")}</button>
        <UserInf user={user} />
        </div>
    );
};

export default ProfilePage;
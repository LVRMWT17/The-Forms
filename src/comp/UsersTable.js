import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const currentUserId = 41;
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://pond-catkin-supermarket.glitch.me/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleToggleAdmin = async (userId, isAdmin) => {
        if (userId === currentUserId) {
            return navigate('/'); 
        }
        try {
            await fetch(`https://pond-catkin-supermarket.glitch.me/api/users/${userId}/toggleAdmin`, {
                method: 'PUT',
                body: JSON.stringify({ isAdmin: !isAdmin }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setUsers(users.map(user => 
                user.id === userId ? { ...user, isAdmin: !isAdmin } : user
            ));
        } catch (error) {
            console.error('Ошибка при изменении статуса админа:', error);
        }
    };

    return (
        <div className="users-table-container">
            <h2>{t("Users")}</h2>
            <table className="users-table">
            <thead>
                    <tr>
                        <th>ID</th>
                        <th>{t("Name")}</th>
                        <th>{t("Admin status")}</th>
                        <th>{t("Action")}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{`${user.first_name} ${user.last_name}`}</td>
                            <td>{user.isAdmin ? t('Да') : t('Нет')}</td>
                            <td>
                            <button 
                                    className={`toggle-admin-button ${user.isAdmin ? 'remove' : 'add'}`} 
                                    onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                                >
                                    {user.isAdmin ? t('Снять статус админа') : t('Назначить админом')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
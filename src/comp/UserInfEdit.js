import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UserInfEdit = ({ user }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://pond-catkin-supermarket.glitch.me/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении данных');
            }
            alert(t("Success!"));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Calibri', width: '400px', margin: '0 auto' }}>
            <h1>{t("Профиль пользователя")}</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <p>ID: {user.id}</p>
                    <div style={{ marginBottom: '15px' }}>
                        <label>{t("First Name")}:</label>
                        <input
                         style={{ width: '100%', padding: '8px', marginTop: '5px'}}
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>{t("Last Name")}:</label>
                        <input
                         style={{ width: '100%', padding: '8px', marginTop: '5px'}}
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>{t("Password")}:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '7px', marginTop: '5px'}}
                        />
                                                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: 'pointer' }}
                        >
                            {showPassword ? t("Скрыть") : t("Показать")}
                            </button>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Email:</label>
                        <input
                         style={{ width: '100%', padding: '8px', marginTop: '5px'}}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                <button type="submit" disabled={loading}>
                    {loading ? t("Сохранение...") : t("Сохранить изменения")}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default UserInfEdit;
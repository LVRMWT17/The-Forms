import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = ({ setIsAuthenticated, handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { t } = useTranslation();
    const goBack = () => {
        navigate(-1);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://pond-catkin-supermarket.glitch.me/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed. Please try again.');
            }

            const data = await response.json();
            console.log('Response data:', data);
            if (data.message === 'Successfully') {
                handleLogin(data.user); 
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('isAdmin', data.user.isAdmin ? 'true' : 'false');

            navigate(data.user.isAdmin ? `/Ap/${data.user.id}` : `/Apa/${data.user.id}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-container">
            <h2 style={{fontFamily: 'Calibri'}}>{t("Login")}</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Password")}
                required
            />
            <button type="submit">{t("Login")}</button>
            <button onClick={goBack} className="back-button">{t("Назад")}</button>
        </form>
        
    );
};

export default Login;

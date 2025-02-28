import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Register.css';

const Register = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const { t } = useTranslation();
    const goBack = () => {
        navigate(-1);
    };
    const handleRegister = async (event) => {
        event.preventDefault();
        
        const registrationTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        try {
            const response = await fetch('https://pond-catkin-supermarket.glitch.me/api/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, firstName, lastName, registrationTime }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed. Please try again.');
            }

            const data = await response.json();
            if (data.message === 'Successfully') {
                setIsAuthenticated(true);
                localStorage.setItem('userId', data.id);
                navigate(`/Apa/${data.id}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="register-container">
        <button className="back-button" onClick={() => navigate(-1)}>{t("Назад")}</button>
        <h2 style={{fontFamily: 'Calibri'}}>{t("Registration")}</h2>
        <form onSubmit={handleRegister}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("Password")} required />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t("First Name")} required />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t("Last Name")} required />
            <button type="submit">{t("Register")}</button>
        </form>
    </div>
    )
};

export default Register;
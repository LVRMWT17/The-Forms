import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const EmailSelector = ({ setSelectedUsers }) => {
    const [emails, setEmails] = useState([]);
    const [emailInput, setEmailInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUsers, setSelectedUsersLocal] = useState([]);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/emails');
                const data = await response.json();
                setEmails(data);
            } catch (error) {
                console.error('Ошибка при загрузке адресов электронной почты:', error);
            }
        };

        fetchEmails();
    }, []);
    useEffect(() => {
        setSelectedUsersLocal(selectedUsers);
    }, [selectedUsers]);

    const handleEmailInputChange = async (e) => {
        const value = e.target.value;
        setEmailInput(value);

        if (value.trim() === '') {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/emails?search=${encodeURIComponent(value)}`);
            const filteredEmails = await response.json();
            setSuggestions(filteredEmails);
        } catch (error) {
            console.error('Ошибка при загрузке адресов электронной почты:', error);
        }
    };

    const handleSelectUser  = (user) => {
        if (typeof setSelectedUsers === 'function') {
            setSelectedUsersLocal((prevUsers) => [...prevUsers, user]);
            setEmailInput('');
            setSuggestions([]);
            setSelectedUsers((prevUsers) => [...prevUsers, user]);
        } else {
            console.error('setSelectedUsers не является функцией');
        }
    };

    const handleRemoveUser  = (userToRemove) => {
        setSelectedUsersLocal(selectedUsers.filter(user => user !== userToRemove));
        setSelectedUsers(selectedUsers.filter(user => user !== userToRemove));
    };

    return (
        <div>
            <label>
                <p style={{fontSize: '20px'}}>{t('If you want to make your form private, select the email of a user:')}</p>
                <input
                    type="text"
                    value={emailInput}
                    onChange={handleEmailInputChange}
                    placeholder={t("Введите email")}
                    style={{width: '250px'}}
                />
            </label>
            <div className="list-container">
            <ul className="suggestion-list" >
            {suggestions.map((user, index) => (
                <li key={index} onClick={() => handleSelectUser (user)} >
                    {user.fullName}
                </li>
            ))}
            </ul>
            </div>
            {selectedUsers.map((user, index) => (
                    <li key={index}>{user.fullName}
                    <button onClick={() => handleRemoveUser (user)} style={{width: '60px', height: '31px', padding: '5px', marginLeft: '5px'}}>{t('Delete')}</button></li> 
                ))}
        </div>
    );
};

export default EmailSelector;
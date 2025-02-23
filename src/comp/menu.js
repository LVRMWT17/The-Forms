import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const UserMenu = ({ userId }) => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/forms');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке форм');
                }
                const data = await response.json();
                setForms(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchForms();
    }, [userId]);

    if (loading) {
        return <div>{t("Загрузка")}</div>;
    }

    const userForms = forms.filter(form => form.is_public || (form.user_id === userId));
    const recentForms = userForms.slice(-5);

    return (
        <div>
            <Link to="/create-form"><button>{t("Создать форму")}</button></Link>
            {recentForms.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {recentForms.map(form => (
                        <Link to={`/FormDetails/${form.id}`} style={{ textDecoration: 'none' }} key={form.id}>
                            <div style={{
                                border: '1px rgb(220, 220, 220) solid',
                                width: '300px',
                                height: '350px',
                                textAlign: 'justify',
                                margin: '10px',
                                backgroundColor: 'rgb(255, 250, 250)'
                                , borderRadius: '5px'
                            }}>
                                <img src={form.image_url} alt={form.form_title} style={{ width: '100%', height: '80%', objectFit: 'cover', borderRadius: '5px' }} />
                                <div style={{ textAlign: "center", color: 'black' }}>{form.form_title}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div>{t("У вас нет созданных форм")}</div>
            )}
        </div>
    );
};

export default UserMenu;
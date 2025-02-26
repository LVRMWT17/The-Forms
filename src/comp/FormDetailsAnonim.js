import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FormDetailsAnonim = () => {
    const { id } = useParams();
    const [form, setForm] = useState();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const [accessList, setAccessList] = useState([]);
    const navigate = useNavigate();
    const {t} = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const formResponse = await fetch(`http://localhost:5000/api/formDetails/${id}`);
                const formData = await formResponse.json();
                
                if (typeof formData.tags === 'string') {
                    try {
                        formData.tags = JSON.parse(formData.tags);
                    } catch (e) {
                        console.error('Ошибка при парсинге tags:', e);
                        formData.tags = [];
                    }
                }
                setForm(formData);
                const questionsResponse = await fetch(`http://localhost:5000/api/questions?formId=${id}`);
                const questionsData = await questionsResponse.json();
                setQuestions(questionsData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/getUserAccess?formId=${id}&userId=${userId}`);
                const data = await response.json();
                console.log('Полученные данные:', data);
                setAccessList(data);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя и формы:', error);
            }
        };
        if (userId) {
            fetchAccess();
        }
    }, [id, userId]);

    const goBack = () => {
        navigate(-1);
    };
    if (loading) {
        return <div>{t("Загрузка")}</div>;
    }

    if (!form) {
        return <div>{t("Форма не найдена")}</div>;
    }

    const hasAccess = form.is_public || (form.user_id && form.user_id.toString() === userId);
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', width: '900px', textAlign: 'center', marginLeft: '300px'}} className='forms'>
            <h1>{form.form_title}</h1>
            <img
                src={form.image_url}
                alt={form.form_title}
                style={{ width: '50%', maxHeight: '300px', objectFit: 'cover' }}
            />
            <div>
            <div dangerouslySetInnerHTML={{ __html: form.form_description }} />
</div>
            <div>
                {Array.isArray(form?.tags) && form.tags.map((tag, index) => (
                    <span key={index} style={{ marginRight: '5px', padding: '5px', backgroundColor: '#e0e0e0', borderRadius: '3px', color: 'black' }}>
                        {tag}
                    </span>
                ))}
            </div>
            <p style={{fontSize: '20px', marginBottom: '30px'}}>{form.theme}</p>

            <div>
                <h1>{t("Вопросы")}</h1>
                {questions.map((question) => {
                    const { question_title, question_type, options } = question;
                    let parsedOptions = [];
                    try {
                        parsedOptions = JSON.parse(options);
                    } catch (error) {
                        console.error('Ошибка при парсинге опций:', error);
                    }
                    if (Array.isArray(parsedOptions) && parsedOptions.length === 1 && Array.isArray(parsedOptions[0])) {
                        parsedOptions = parsedOptions[0];
                    }
                    return (
                        <div key={question.id} style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                            <div>
                                <h3>{question_title}</h3>
                                {question_type === 'checkbox' ? (
                                    <div style={{flexDirection: 'column',display: 'flex', marginRight: '200px'}}>
                                        {Array.isArray(parsedOptions) && parsedOptions.length > 0 ? (
                                            parsedOptions.map((option, idx) => (
                                                <label key={idx}>
                                                    <input type="checkbox" value={option} disabled />
                                                    {option}
                                                </label>
                                            ))
                                        ) : (
                                            <p>Нет доступных опций</p>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        type={question_type === 'positiveInteger'}
                                        defaultValue={parsedOptions[0] || ''}
                                        readOnly
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div>
                <button onClick={goBack}>{t("Назад")}</button></div>
        </div>
        
    );
};

export default FormDetailsAnonim;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Answers = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const [accessList, setAccessList] = useState([]);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const formResponse = await fetch(`http://localhost:5001/api/formDetails/${id}`);
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
                const questionsResponse = await fetch(`http://localhost:5001/api/questions?formId=${id}`);
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

    const handleResponseChange = (questionId, value) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [questionId]: value,
        }));
    };

    if (loading) {
        return <div>{t("Загрузка")}</div>;
    }

    if (!form) {
        return <div>{t("Форма не найдена")}</div>;
    }

    console.log('Questions:', questions);

    const hasAccess = accessList.includes(userId) || form.in_public;
    const handleSubmit = async () => {
        const answersToSubmit = Object.entries(responses).map(([questionId, response]) => ({
            question_id: questionId,
            user_id: userId,
            response: Array.isArray(response) ? response.join(', ') : response,
        }));
        try {
            const response = await fetch('http://localhost:5001/api/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answersToSubmit),
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }
    
            const result = await response.json();
            console.log('Ответы успешно отправлены:', result);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    return (
        <div>
            <h1>{form.form_title}</h1>
            <img src={form.image_url} alt={form.form_title} style={{ width: '50%', maxHeight: '300px', objectFit: 'cover' }} />
            <p>{form.form_description}</p>
            <div>
                {Array.isArray(form.tags) && form.tags.map((tag, index) => (
                    <span key={index} style={{ marginRight: '5px', padding: '5px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
                        {tag}
                    </span>
                ))}
            </div>
            <p>{form.theme}</p>

            <h2>{t("Вопросы")}</h2>
            {questions.map((question) => {
                const { question_title, options, question_type } = question;
                let parsedOptions = [];
                try {
                    if (typeof options === 'string') {
                        parsedOptions = JSON.parse(options);
                    }
                } catch (error) {
                    console.error('Ошибка при парсинге опций:', error);
                }

                return (
                    <div key={question.id} style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
    <strong>{question_title}</strong>

    {question_type === 'singleLine' && (
        <>
        <p>{parsedOptions}</p>
            <input
                type="text"
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder={t("Введите ответ")}
            />
        </>
    )}
    {question_type === 'multiLine' && (
        <>
        <p>{parsedOptions}</p>
            <textarea
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder={t("Введите ответ")}
            />
        </>
    )}
    {question_type === 'positiveInteger' && (
        <>
        <p>{parsedOptions}</p>
            <input
                type="number"
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder={t("Введите ответ")}
            />
        </>
    )}
    {question_type === 'checkbox' && (
        <div>
            {Array.isArray(parsedOptions) && parsedOptions.flat().map((option, idx) => (
                <label key={idx} style={{ display: 'block' }}>
                    <input
                        type="checkbox"
                        value={option}
                        onChange={(e) => {
                            const newValue = e.target.checked
                                ? [...(responses[question.id] || []), option]
                                : (responses[question.id] || []).filter((item) => item !== option);
                            handleResponseChange(question.id, newValue);
                        }}
                    />
                    {option}
                </label>
            ))}
        </div>
    )}
</div>
                    );
                })}
                    <Link to={"/comp/forms"}>
                    <button onClick={handleSubmit}>{t("Отправить данные")}</button>
                    </Link>
            </div>
        );
    };

export default Answers;
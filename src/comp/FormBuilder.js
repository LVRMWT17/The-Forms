import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownForm from './Markdown';
import UploadImg from './UploadImg';
import TagSelector from './TagSelector';
import EmailSelector from './EmailSelector';
import { useTranslation } from 'react-i18next';

const MAX_QUESTIONS = 20;

const FormBuilder = () => {
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [theme, setTheme] = useState('');
    const [questions, setQuestions] = useState([{ id: Date.now().toString(), title: '', description: '', type: 'singleLine', checkboxes: [{ id: String(Date.now()), description: [''] }] }]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const userId = localStorage.getItem('userId');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const addQuestion = () => {
        if (questions.length >= MAX_QUESTIONS) {
            return;
        }
        setQuestions([...questions, { id: Date.now(), title: '', description: '', type: 'singleLine', checkboxes: [] }]);
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(question => question.id !== id));
    };

    const handleQuestionChange = (id, field, value) => {
        setQuestions(questions.map(question => {
            if (question.id === id) {
                return { ...question, [field]: value };
            }
            return question;
        }));
    };

    const addCheckbox = (questionId) => {
        const newCheckbox = {
            id: String(Date.now()),
            description: [''],
        };

        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    checkboxes: [...q.checkboxes, newCheckbox]
                };
            }
            return q;
        });
    
        setQuestions(updatedQuestions);
    };

    const removeCheckbox = (questionId, checkboxId) => {
        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                return { ...q, checkboxes: q.checkboxes.filter(cb => cb.id !== checkboxId) };
            }
            return q;
        });
        setQuestions(updatedQuestions);
    }

    const renderQuestionInput = (question) => {
        switch (question.type) {
            case 'singleLine':
                return (
                    <div>
                        <input
                        className='in'
                            type="text"
                            placeholder={t("Описание вопроса")}
                            value={question.text}
                            onChange={(e) => handleQuestionChange(question.id, 'description', e.target.value)}
                        /></div>
                );
            case 'multiLine':
                return (
                    <input
                    className='in'
                            type="text"
                            placeholder={t("Описание вопроса")}
                            value={question.text}
                            onChange={(e) => handleQuestionChange(question.id, 'description', e.target.value)}
                        />
                );
            case 'positiveInteger':
                return (
                    <input
                    className='in'
                        type="text"
                        placeholder={t("Описание вопроса")}
                        min="1"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, 'description', e.target.value)}
                    />
                );
            case 'checkbox':
                return (
                    <div key={question.id}>
            {Array.isArray(question.checkboxes) && question.checkboxes.length > 0 ? (
                question.checkboxes.map(checkbox => (
                                <div key={checkbox.id}>
                        <input type="checkbox"
                        disabled style={{width: '12px', height: '12px', marginLeft: '50px'}}/>
                                    <input
                                        type="text"
                                        placeholder={t("Описание варианта")}
                                        value={question.text} 
                                        style={{marginLeft: '5px', height: '3px'}}
                                        onChange={(e) => {
                                            const updatedQuestions = questions.map(q => {
                                                if (q.id === question.id) {
                                        return {
                                            ...q,
                                            checkboxes: q.checkboxes.map(cb => 
                                                cb.id === checkbox.id 
                                                ? { ...cb, description: e.target.value } 
                                                : cb
                                            )
                                        };
                                                }
                                                return q;
                                            });
                                            setQuestions(updatedQuestions);
                                        }}
                                    />
                        <button onClick={() => removeCheckbox(question.id, checkbox.id)}>{t("Удалить")}</button>
                                </div>
                            ))
                        ) : (
                            <p>{t("Добавить чекбоксы")}</p>
            )
            }
            <button type="button" onClick={() => addCheckbox(question.id)}>{t("Добавить чекбоксы")}</button>
                    </div>
    ); }}
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
    
        try {
            const formResponse = await fetch('https://pond-catkin-supermarket.glitch.me/api/creation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    form_title: formTitle,
                    form_description: formDescription,
                    image_url: imageUrl,
                    is_public: isPublic,
                    tags: selectedTags,
                    theme: theme,
                }),
            });
    
            if (!formResponse.ok) {
                const errorMessage = await formResponse.text();
                console.error('Ошибка сервера:', errorMessage);
                throw new Error('Ошибка при создании формы');
            }
            const formData = await formResponse.json();
            const formId = formData.id;
            await Promise.all(questions.map((question) => handleQuestionSubmission(formId, question)));
            await sendUserIds(selectedUsers, formId);
            setSuccessMessage('Форма успешно создана!');
            setSelectedUsers([]);
        } catch (error) {
            console.error('Ошибка:', error);
            setError('Произошла ошибка. Попробуйте еще раз.');
        }
    };
    
    const handleQuestionSubmission = async (formId, question) => {
        let options;
        if (question.type === "checkbox") {
            options = question.checkboxes.map(checkbox => checkbox.description || '');
        }
        if (selectedUsers.length > 0) {
            setIsPublic(false);
        }
        const questionResponse = await fetch('https://pond-catkin-supermarket.glitch.me/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                form_id: formId,
                question_title: question.title,
                question_type: question.type,
                options: options || question.description,
            }),
        });
    
        if (!questionResponse.ok) {
            const errorMessage = await questionResponse.text();
            console.error('Ошибка при создании вопроса:', errorMessage);
            throw new Error('Ошибка при создании вопроса');
        }
    };
    const sendUserIds = async (selectedUsers, formId) => {
        const userIds = selectedUsers.map(user => user.id);
        const response = await fetch('https://pond-catkin-supermarket.glitch.me/api/form_users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formId, userIds })
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error('Ошибка при отправке данных: ' + errorMessage);
        }
    alert('Success!');
    navigate('/comp/forms')
    };

    const handleImageUpload = (imageUrl) => {
        setImageUrl(imageUrl);
    };
    const handleTagsChange = (newTags) => {
        setSelectedTags(newTags);
    };
    const handleDescriptionChange = (description) => {
        setFormDescription(description);
    };
    return (
        <form onSubmit={handleSubmit} className='forms'>
            <h2>{t("Создание формы")}</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <div>
                <label></label>
                <input
                className='in'
                    type="text"
                    placeholder={t("Название формы")}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                />
            </div>
            <UploadImg onUpload={handleImageUpload} />
            <div>
            <MarkdownForm formDescription={formDescription} onDescriptionChange={handleDescriptionChange} />
            </div>
            <div>
                <label>
                <input
                className='in'
                    type="text"
                    placeholder={t("Тема")}
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    required
                /></label>
            </div>
            <div>
            <TagSelector selectedTagsString={selectedTags} onChange={handleTagsChange} /> 
            </div>
            {questions.map((question, index) => (
                <div key={question.id} className='question-container'>
                    <div>
                    <label>
                           <input
                           className='in'
                           type="text"
                           value={question.title || `${t("Question")} №${index + 1}`}
                           onChange={(e) => handleQuestionChange(question.id, 'title', e.target.value)}
                           required/>
                    </label>
                    </div>
                    <div>
                        <label>
                        <select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                            style={{ width: '220px', height: '30px', borderRadius: '5px'}}
                        >
                            <option value="singleLine">{t("Однострочный")}</option>
                            <option value="multiLine">{t("Многострочный")}</option>
                            <option value="positiveInteger">{t("Положительное число")}</option>
                            <option value="checkbox">{t("Флажок")}</option>
                        </select></label>
                    </div>
                    <div>
                        <label></label>
                        <div>
            {renderQuestionInput(question)}
        </div>
                    </div>
                    <button type="button" onClick={() => removeQuestion(question.id)}>{t("Удалить")}</button>
                </div>
            ))}
            <button type="button" onClick={addQuestion} disabled={questions.length >= 20}>
            {t("Добавить вопрос")}
</button>
<EmailSelector 
    setSelectedUsers={(users) => {
        setSelectedUsers(users);
        if (users.length > 0) {
            setIsPublic(false);
        }
    }} 
/>
<label>
                    <input
                    style={{marginRight: '5px'}}
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => {
                            setIsPublic(prevIsPublic => {
                                if (prevIsPublic) {
                                    setSelectedUsers([]);
                                }
                                return !prevIsPublic;
                            });
                        }}
                    />
                   {t("Общедоступная форма")}
                </label>

            <div><button type="submit">{t("Создать форму")}</button></div>
        </form>
    );
};

export default FormBuilder;
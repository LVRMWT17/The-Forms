import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MarkdownForm from './Markdown';
import UploadImg from './UploadImg';
import TagSelector from './TagSelector';
import EmailSelector from './EmailSelector';
import { useTranslation } from 'react-i18next';

const EditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [theme, setTheme] = useState('');
    const [error, setError] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { t, i18n } = useTranslation();

    const addQuestion = () => {
        const newQuestion = {
            id: String(Date.now()),
            question_title: '',
            question_type: 'singleLine',
            options: '[]'
        };
        setQuestions([...questions, newQuestion]);
    };

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/EditForm/${id}`);
                const data = await response.json();
                setFormTitle(data.form.form_title);
                setFormDescription(data.form.form_description); 
                setImageUrl(data.form.image_url);
                if (typeof data.form.tags === 'string') {
                    const parsedTags = JSON.parse(data.form.tags);
                    setSelectedTags(parsedTags);
                    console.log('Parsed selectedTags:', parsedTags);
                } else {
                    setSelectedTags(data.form.tags);
                }
                setTheme(data.form.theme);
                setQuestions(data.questions);

            } catch (error) {
                console.error('Ошибка при загрузке данных формы:', error);
            }
        };

        fetchFormData();
    }, [id]);

    const handleQuestionChange = (id, field, value) => {
        setQuestions(questions.map((question) => {
            if (question.id === id) {
                return { ...question, [field]: value };
            }
            return question;
        }));
    };

    const handleImageUpload = (imageUrl) => {
        setImageUrl(imageUrl);
    };

    const handleTagsChange = (newSelectedTags) => {
        if (typeof newSelectedTags === 'string') {
            try {
            } catch (error) {
                console.error("Ошибка при парсинге тегов:", error);
            }
        } else if (Array.isArray(newSelectedTags)) {
                setSelectedTags(newSelectedTags);
            } else {
                console.error("Полученные данные не являются массивом:", newSelectedTags);
            }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            title: formTitle,
            description: formDescription,
            image: imageUrl,
            is_public: isPublic,
            tags: selectedTags, 
            theme,
            questions: questions,
            selectedUsers,
        };
        try {
            const response = await fetch(`http://localhost:5001/api/edit-the-form/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Форма успешно обновлена!');
                navigate(-1);
            } else {
                const errorData = await response.json();
            console.error('Ошибка от сервера:', errorData);
            setError('Ошибка при обновлении формы: ' + errorData.message);
            }
        } catch (error) {
            setError('Ошибка при отправке данных');
            console.error(error);
        }
    };
    const handleDescriptionChange = (description) => {
        setFormDescription(description);
    };

    const renderQuestionInput = (questions) => {
        let parsedOptions;
        if (typeof questions.options === 'string') {
            try {
                parsedOptions = JSON.parse(questions.options);
            } catch (e) {
                console.error('Ошибка парсинга:', e);
                parsedOptions = [];
            }
        } else if (Array.isArray(questions.options)) {
            if (Array.isArray(questions.options[0]) && questions.options[0].length > 0) {
                parsedOptions = questions.options[0];
            } else {
                parsedOptions = questions.options;
            }
        } else {
            parsedOptions = [];
        }
    
        const handleInputChange = (questionId, index, value) => {
            const updatedOptions = [...parsedOptions];
            updatedOptions[index] = value;
            handleQuestionChange(questionId, 'options', updatedOptions);
        };
    
        const addCheckbox = (questionId) => {
            const updatedOptions = [...parsedOptions, ''];
            handleQuestionChange(questionId, 'options', updatedOptions);
        };
    
        const removeCheckbox = (questionId, index) => {
            const updatedOptions = parsedOptions.filter((_, i) => i !== index);
            handleQuestionChange(questionId, 'options', updatedOptions);
        };
    
        switch (questions.question_type) {
            case 'singleLine':
            case 'multiLine':
            case 'positiveInteger':
                return (
                    <input
                        type="text"
                        placeholder={t("Описание вопроса")}
                        value={parsedOptions[0] || ''}
                        onChange={(e) => handleQuestionChange(questions.id, 'options', [e.target.value])}
                    />
                );
    
            case 'checkbox':
                return (
                    <div key={questions.id}>
                        {parsedOptions.length > 0 ? (
                            parsedOptions.map((option, index) => (
                                <div key={index}>
                                    <input type="checkbox" disabled />
                                    <input
                                        type="text"
                                        placeholder={t("Описание варрианта")}
                                        value={option}
                                        onChange={(e) => handleInputChange(questions.id, index, e.target.value)}
                                    />
                                    <button onClick={(e) => removeCheckbox(questions.id, index, e.target.value)}>{t("Удалить")}</button>
                                </div>
                            ))
                        ) : (
                            <p>{t("Добавить чекбоксы")}</p>
                        )}
                        <button type="button" onClick={() => addCheckbox(questions.id)}>{t("Добавить чекбоксы")}</button>
                    </div>
                );
    
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>{t("Редактировать форму")}</h2>
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <div>
                <input
                    type="text"
                    placeholder={t("Название формы")}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                />
            </div>
            <img src={imageUrl} alt={formTitle} style={{ width: '50%', maxHeight: '300px', objectFit: 'cover' }} />
            <UploadImg onUpload={handleImageUpload} />
            <div>
            <MarkdownForm formDescription={formDescription} onDescriptionChange={handleDescriptionChange} />
            </div>
            <div>
                <label>{t("Тема")}
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    required
                /></label>
            </div>
            <TagSelector selectedTagsString={selectedTags} onChange={handleTagsChange}/>

            <h3>{t("Вопросы")}</h3>
            {questions.length > 0 ? (
                questions.map((question, index) => (
                <div key={question.id} style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <div>
                    <label>
                           <input
                           type="text"
                                    placeholder={t("Название впроса")}
                                    value={question.question_title || ` ${index + 1}`}
                                    onChange={(e) => handleQuestionChange(question.id, 'question_title', e.target.value)}
                                    required
                                />
                    </label>
                    </div>
                    <div>
                        <label>
                        <select
                                    value={question.question_type}
                                    onChange={(e) => handleQuestionChange(question.id, 'question_type', e.target.value)}
                        >
                            <option value="singleLine">{t("Однострочный")}</option>
                            <option value="multiLine">{t("Многострочный")}</option>
                            <option value="positiveInteger">{t("Положительное число")}</option>
                            <option value="checkbox">{t("Флажок")}</option>
                                </select>
                            </label>
        <div>
                            {renderQuestionInput(question)}
                        </div>
                    </div>
                    <button type="button" onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}>
                    {t("Удалить")}
                    </button>
                </div>
            ))
        ) : (
            <p>{t("Нет вопросов")}</p>
        )}
        
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
        <div>
            <button type="submit">{t("Сохранить изменения")}</button>
        </div>
    </form>
);
};
export default EditForm;
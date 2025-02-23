import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
const TagSelector = ({ selectedTagsString, onChange }) => {
    const [availableTags, setAvailableTags] = useState([]);
    const [localSelectedTags, setLocalSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchTags = async () => {
            const response = await fetch('http://localhost:5001/api/tags'); 
            const data = await response.json();
            setAvailableTags(data);
        };

        fetchTags();
    }, []);

    useEffect(() => {
                setLocalSelectedTags(selectedTagsString);
    });
    
    const handleTagChange = (tag) => {
        const newSelectedTags = localSelectedTags.includes(tag)
            ? localSelectedTags.filter(t => t !== tag) 
            : [...localSelectedTags, tag];

        setLocalSelectedTags(newSelectedTags);
        onChange(newSelectedTags);
    };

    const handleAddTag = async () => {
        if (newTag) {
            try {
                const response = await fetch('http://localhost:5001/api/tags', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newTag }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка при добавлении тега: ' + response.status);
                }

                const newTagData = await response.json();
                setAvailableTags([...availableTags, newTagData]);
                setNewTag('');
            } catch (error) {
                console.error('Ошибка при добавлении тега:', error);
            }
        }
    };

    return (
        <div>
            <h3>{t("Выберите теги")}</h3>
            {availableTags.map(tag => (
                <label key={tag.id}>
                    <input
                        type="checkbox"
                        checked={localSelectedTags.includes(tag.name)}
                        onChange={() => handleTagChange(tag.name)}
                    />
                    {tag.name}
                </label>
            ))}
            <div>
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={t("Добавьте новый тег")}
                />
                <button onClick={handleAddTag}>{t("Добавить")}</button>
            </div>
        </div>
    );
};

export default TagSelector;
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
const TagSelector = ({ selectedTagsString, onChange }) => {
    const [availableTags, setAvailableTags] = useState([]);
    const [localSelectedTags, setLocalSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchTags = async () => {
            const response = await fetch('https://pond-catkin-supermarket.glitch.me/api/tags'); 
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
                const response = await fetch('https://pond-catkin-supermarket.glitch.me/api/tags', {
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
    <h2>{t("Выберите теги")}</h2>
    <div className="tag-cloud">
        {availableTags.map(tag => (
            <span
                key={tag.id}
                className={`tag ${localSelectedTags.includes(tag.name) ? 'selected' : ''}`}
                onClick={() => handleTagChange(tag.name)}
            >
                {tag.name}
            </span>
        ))}</div>
        <div>
                <input
                style={{width: '200px'}}
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={t("Добавьте новый тег")}
                />
                <button type="button" onClick={handleAddTag}>{t("Добавить")}</button>
            </div>
        </div>
    );
};

export default TagSelector;
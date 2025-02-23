import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Responses = ({ formId }) => {
    const [responses, setResponses] = useState([]);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responsesResponse = await fetch(`http://localhost:5001/api/forms/${formId}/responses`);
                const responsesData = await responsesResponse.json();
                setResponses(responsesData);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
        }
    };
        fetchData();
    }, [formId]);
    return (
        <div>
            <h3>{t("Ответы на форму")}</h3>
        <ul>
            {responses.map(response => (
                    <li key={response.id}>{response.response}
                        <Link to={`/User  Responses/${formId}/${response.userId}`}>
                    {response.userName}
                        </Link>
                            </li>
                        ))}
                </ul>
            </div>
);
};

export default Responses;
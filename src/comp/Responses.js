import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Responses = ({ formId }) => {
    const [responses, setResponses] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responsesResponse = await fetch(`http://localhost:5000/api/forms/${formId}/responses`);
                const responsesData = await responsesResponse.json();
                setResponses(responsesData);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };
        fetchData();
    }, [formId]);
    const groupedResponses = responses.reduce((acc, response) => {
        const userId = response.userId;
        if (!acc[userId]) {
            acc[userId] = {
                userId: userId,
                userName: response.user_id,
                responses: [],
            };
        }
        acc[userId].responses.push(response.response);
        return acc;
    }, {});
    return (
        <div>
            <h3>{t("Ответы на форму")}</h3>
            <div className="responses-grid">
                {Object.values(groupedResponses).map(user => (
                    <div className="response-tile" key={user.userName}>
                        <h4>(User ID: {user.userName})</h4>
                        <ul>
                            {user.responses.map((response, index) => (
                                <li key={index}>{response}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Responses;

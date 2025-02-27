import React from 'react';
import { Link } from 'react-router-dom';
import FormBuilder from './FormBuilder'
import { useTranslation } from 'react-i18next';

const Creation = () => {
    const userId = localStorage.getItem('userId');
    const { t, i18n } = useTranslation();

    return (
        <div>
            <FormBuilder userId={userId} />
        </div>
    );
};

export default Creation;
import React from 'react';
import FormBuilder from './FormBuilder'

const Creation = () => {
    const userId = localStorage.getItem('userId');

    return (
        <div>
            <FormBuilder userId={userId} />
        </div>
    );
};

export default Creation;
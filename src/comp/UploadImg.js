import React, { useState } from 'react';
import { FileUploaderMinimal } from '@uploadcare/react-uploader';
import { uploadFile } from '@uploadcare/upload-client';
import '@uploadcare/react-uploader/core.css';

function UploadImg({ onUpload }) {
    const [fileUrl, setFileUrl] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = async (file) => {

        if (file && file.allEntries && file.allEntries.length > 0) {
            const entry = file.allEntries[0];

            if (entry.isSuccess) {
                const uuid = entry.uuid;

                try {
                    const result = await uploadFile(uuid, {
                        publicKey: 'd37976c8e2c1d51e2ff7',
                        store: 'auto',
                        metadata: {
                            subsystem: 'js-client',
                            pet: 'cat'
                        }
                    });

                    if (result && result.cdnUrl) {
                        const cdnUrl = result.cdnUrl;
                        setFileUrl(cdnUrl);
                        onUpload(cdnUrl);
                    } else {
                        throw new Error('Не удалось получить URL загруженного файла.');
                    }
                } catch (err) {
                    console.error('Ошибка:', err);
            }
        } else {
            setMessage('Файл все еще загружается. Пожалуйста, подождите.');
            } } else {
                setMessage('Пожалуйста, выберите правильный файл для загрузки.');
            }
        };
    return (
        <div>
            <FileUploaderMinimal
                cameraModes="photo, video"
                classNameUploader="uc-light"
                pubkey="d37976c8e2c1d51e2ff7"
                onChange={handleFileChange}
            />
        </div>
    );
}

export default UploadImg;
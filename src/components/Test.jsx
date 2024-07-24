import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:8000/room/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="file" onChange={onFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
};

export default FileUpload;

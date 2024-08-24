
import React, { useState } from 'react';

const ImageForm = () => {
    const [objects, setObjects] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const imageFile = event.target.image.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('/api/image/classify-image', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        setObjects(JSON.stringify(data, null, 2));
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl mb-4">Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" name="image" accept="image/*" className="block mb-4 p-2 border rounded" />
                <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded">Submit</button>
            </form>
            <pre className="mt-4">{objects}</pre>
        </div>
    );
};

export default ImageForm;

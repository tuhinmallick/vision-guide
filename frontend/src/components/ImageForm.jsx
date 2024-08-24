import React, { useState } from 'react';

const ImageForm = () => {
    const [objects, setObjects] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const imageFile = event.target.image.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch('/api/yolo/detect-objects-yolo', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            const objectList = data.objects.map(obj => `${obj.class}: ${(obj.score * 100).toFixed(2)}%`).join(', ');
            setObjects(objectList || 'No objects detected.');
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(objectList || 'No objects detected.');
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Error detecting objects with YOLO:', error);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl mb-4">Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" name="image" accept="image/*" className="block mb-4 p-2 border rounded" />
                <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded">Submit</button>
            </form>
            <p className="mt-4">{objects}</p>
        </div>
    );
};

export default ImageForm;

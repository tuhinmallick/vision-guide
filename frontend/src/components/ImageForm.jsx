import React, { useState } from 'react';

const ImageForm = () => {
    const [objects, setObjects] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const imageFile = event.target.image.files[0];
        const formData = new FormData();
        formData.append('image', imageFile); // Match the server-side field name

        try {
            const response = await fetch('http://localhost:5000/api/yolo/detect', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json().catch(() => ({})); // Default to empty object if parsing fails

            // Log raw response for debugging
            console.log(data);

            // Format and display results
            const objectList = data.map(obj => `${obj[4]}: ${(obj[5] * 100).toFixed(2)}%`).join(', ');
            setObjects(objectList || 'No objects detected.');

            // fead out the detected objects
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(objectList || 'No objects detected.');
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Error detecting objects with YOLO:', error);
            setObjects('Error detecting objects.');
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

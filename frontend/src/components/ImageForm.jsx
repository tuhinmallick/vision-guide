// ImageForm.js
import React, { useState } from 'react';

export const ImageForm = ({ setYoloResults }) => {
    const [objects, setObjects] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const imageFile = event.target.image.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('image', imageFile);

        try {
            const response = await fetch('http://localhost:5000/api/yolo/detect', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json().catch(() => ({}));
            const data = await response.json().catch(() => ({}));
            const objectList = data.map(obj => `${obj[4]}: ${(obj[5] * 100).toFixed(2)}%`).join(', ');
            setObjects(objectList || 'No objects detected.');
            setYoloResults(objectList || 'No objects detected.');
        } catch (error) {
            console.error('Error detecting objects with YOLO:', error);
            setObjects('Error detecting objects.');
        }
    };

    const convertTextToAudio = (text) => {
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Speech synthesis not supported');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto ">
            <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="block mb-4 p-2 border rounded-lg border-gray-300"
                />
                <button
                    type="submit"
                    className="bg-purple-700 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
                >
                    Submit
                </button>
            </form>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Detected Objects:</h3>
                <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{objects}</p>
            </div>
        </div>
    );
};

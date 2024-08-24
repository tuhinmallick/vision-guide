import React, { useState } from 'react';

const ImageForm = () => {
    const [objects, setObjects] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const imageFile = event.target.image.files[0];
        if (!imageFile) {
            alert('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('image_file', imageFile); // Ensure this matches the field name expected by the server

        setLoading(true); // Start loading indicator

        try {
            const response = await fetch('/api/yolo/detect', { // Ensure the endpoint URL matches your server route
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.length === 0) {
                setObjects('No objects detected.');
            } else {
                const objectList = data.map(obj => `${obj[4]}: ${(obj[5] * 100).toFixed(2)}%`).join(', '); // Adjust indexing based on response structure
                setObjects(objectList);

                // Read out the detected objects
                if (window.speechSynthesis) {
                    const utterance = new SpeechSynthesisUtterance(objectList || 'No objects detected.');
                    utterance.lang = 'en-US';
                    window.speechSynthesis.speak(utterance);
                }
            }
        } catch (error) {
            console.error('Error detecting objects with YOLO:', error);
            setObjects('Error detecting objects.');
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl mb-4">Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" name="image" accept="image/*" className="block mb-4 p-2 border rounded" />
                <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded" disabled={loading}>
                    {loading ? 'Processing...' : 'Submit'}
                </button>
            </form>
            <p className="mt-4">{objects}</p>
        </div>
    );
};

export default ImageForm;

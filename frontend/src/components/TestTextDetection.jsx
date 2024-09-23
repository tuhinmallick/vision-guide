import React, { useState } from 'react';

function OCRUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://localhost:3000/ocr', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            const extractedText = data.detected_text.map(item => item.text);

            // Set the extracted text to the state or wherever you want to use it
            setResult(extractedText);
            console.log(extractedText);
        } catch (error) {
            console.error("Error uploading the image", error);
        }
    };

    return (
        <div>
            <h1>OCR Image Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Upload and Run OCR</button>
            </form>
            {result && (
                <div>
                    <h2>OCR Results:</h2>
                    <ul>
                        {result.map((text, index) => (
                            <li key={index}>
                                {result.map((text, index) => (
                                    <li key={index}>{text}</li>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default OCRUploader;

import { createWorker } from 'tesseract.js';
import React, { useEffect, useState } from 'react';

const TesseractExample = (props) => {
    const [text, setText] = useState('');

    useEffect(() => {
        const worker = createWorker({
            logger: m => console.log(m), // Log progress
        });

        const recognizeText = async () => {
            try {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(props.imageUrl);
                setText(text);
            } catch (error) {
                console.error('Error during Tesseract processing:', error);
            } finally {
                await worker.terminate();
            }
        };

        recognizeText();
    }, []);

    return (
        <div>
            <h1>Detected Text</h1>
            <p>{text}</p>
        </div>
    );
};

export default TesseractExample;

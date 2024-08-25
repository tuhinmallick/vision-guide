import React from 'react';

const AskButton = ({ yoloResults, transcription }) => {

    const handleClick = async () => {
        const prompt = `Consider that you are a guide for a blind person and you have to answer the question based
        on the attached image detection results. Strictly answer the question based on the image results and the question and say nothing else.Give positive response if you see something relevant otherwise tell that you dont see something relevant in the image. In case the question is not relevant, please say: "Sorry I cannot help you with this at the moment, would you mind asking something else
        Image Results: ${yoloResults}\n Question: ${transcription}"`;
        console.log('Prompt:', prompt);

        try {
            const response = await fetch('https://7335-2400-adc5-16a-a200-1060-7de4-8e99-9cf.ngrok-free.app/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const generatedText = result.results[0]?.generated_text || "No response received.";

            console.log('Generated Text:', generatedText); // Debugging

            // Display the result to the user or in a UI component
            alert(`Response from Chat Assistant: ${generatedText}`);
        } catch (error) {
            console.error('Error sending data to chat assistant:', error);
            alert('Failed to get response from Chat Assistant. Please try again.');
        }
    };

    return (
        <button
            onClick={handleClick}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
            Ask Chat Assistant
        </button>
    );
};

export default AskButton;

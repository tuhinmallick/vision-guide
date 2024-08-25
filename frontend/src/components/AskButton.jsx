import React from 'react';

const AskButton = ({ yoloResults, transcription }) => {
    const handleClick = async () => {
        const prompt = `Consider that you are a guide for a blind person and you have to answer the question based
        on the attached image detection results. Image Results: ${yoloResults}\n Question: ${transcription}
        Strictly answer the question based on the image results and this context. In case the question is not relevant, please say: "Sorry I cannot help you with this at the moment, would you mind asking something else"`;
        console.log('Prompt:', prompt); // Debugging

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
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

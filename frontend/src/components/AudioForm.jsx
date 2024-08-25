import React, { useState } from 'react';

function AudioForm({ yoloResults }) {
    const [transcription, setTranscription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);

                recorder.ondataavailable = async (event) => {
                    const audioBlob = new Blob([event.data], { type: 'audio/wav' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob);

                    try {
                        const response = await fetch('http://localhost:5000/api/speech-to-text', {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await response.json();
                        setTranscription(data.transcription || 'No transcription detected.');
                        console.log('Received transcription:', data.transcription); // Debugging
                    } catch (error) {
                        console.error('Error:', error);
                    }
                };

                recorder.start();
                setMediaRecorder(recorder);
                setIsRecording(true);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        } else {
            console.error('getUserMedia not supported on this browser.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleClick = async () => {
        const prompt = `Consider that you are a guide for a blind person and you have to answer the question based
        on the attached image detection results. Image Results: ${yoloResults}\n Question: ${transcription}
        Strictly answer the question based on the image results and this context. In case the question is not relevant, please say: "Sorry I cannot help you with this at the moment, would you mind asking something else"`;
        console.log('Prompt:', prompt);
        console.log('Transcription:', transcription);

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
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Audio Transcription</h2>
            <div className="flex items-center mb-4">
                <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`bg-blue-500 text-white py-2 px-4 rounded transition-transform duration-300 transform ${isRecording ? 'scale-95' : 'scale-100'}`}
                >
                    Start Recording
                </button>
                <button
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className={`ml-4 bg-red-500 text-white py-2 px-4 rounded transition-transform duration-300 transform ${!isRecording ? 'scale-95' : 'scale-100'}`}
                >
                    Stop Recording
                </button>
                {isRecording && <span className="ml-4 text-red-500 font-semibold">Recording...</span>}
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Transcription:</h3>
                <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{transcription}</p>
            </div>
            <button
                onClick={handleClick}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 mt-4"
            >
                Ask Chat Assistant
            </button>
        </div>
    );
}

export default AudioForm;

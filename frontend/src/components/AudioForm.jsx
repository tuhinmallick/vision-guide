import React, { useState } from 'react';

function AudioForm({ yoloResults }) {
    const [transcription, setTranscription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [loading, setLoading] = useState(false); // For loading states
    const [error, setError] = useState(''); // For error messages
    const [assistantResponse, setAssistantResponse] = useState(''); // To store assistant's response

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);

                recorder.ondataavailable = async (event) => {
                    const audioBlob = new Blob([event.data], { type: 'audio/wav' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob);

                    setLoading(true); // Set loading state to true

                    try {
                        const response = await fetch('https://7335-2400-adc5-16a-a200-1060-7de4-8e99-9cf.ngrok-free.app/speech-to-text', {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await response.json();
                        setTranscription(data.transcription || 'No transcription detected.');
                        console.log('Received transcription:', data.transcription); // Debugging
                    } catch (error) {
                        setError('Failed to transcribe audio.');
                        console.error('Error:', error);
                    } finally {
                        setLoading(false); // Set loading state to false
                    }
                };

                recorder.start();
                setMediaRecorder(recorder);
                setIsRecording(true);
            } catch (error) {
                setError('Error accessing microphone.');
                console.error('Error accessing microphone:', error);
            }
        } else {
            setError('getUserMedia not supported on this browser.');
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
        on the attached image detection results. Strictly answer the question based on the image results and the question and say nothing else.Give positive response if you see something relevant otherwise tell that you dont see something relevant in the image. In case the question is not relevant, please say: "Sorry I cannot help you with this at the moment, would you mind asking something else
        Image Results: ${yoloResults.match(/\b[a-zA-Z]+\b/g)}\n Question: ${transcription}"`;
        console.log('Prompt:', prompt);
        console.log('Transcription:', transcription);

        setLoading(true); // Set loading state to true
        setError(''); // Clear previous errors

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

            setAssistantResponse(generatedText); // Update state with assistant's response
            speakText(generatedText); // Call the text-to-speech function

        } catch (error) {
            setError('Failed to get response from Chat Assistant.');
            console.error('Error sending data to chat assistant:', error);
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    const speakText = (text) => {
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Speech synthesis not supported');
            setError('Speech synthesis not supported on this browser.');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Audio Transcription</h2>
            <div className="flex items-center mb-4">
                <button
                    onClick={startRecording}
                    disabled={isRecording || loading}
                    className={`bg-blue-500 text-white py-2 px-4 rounded transition-transform duration-300 transform ${isRecording ? 'scale-95' : 'scale-100'}`}
                >
                    Start Recording
                </button>
                <button
                    onClick={stopRecording}
                    disabled={!isRecording || loading}
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
            {error && <p className="mt-4 text-red-500">{error}</p>} {/* Display error message */}
            <button
                onClick={handleClick}
                disabled={loading}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 mt-4"
            >
                {loading ? 'Processing...' : 'Ask Chat Assistant'}
            </button>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Assistant Response:</h3>
                <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{assistantResponse}</p>
            </div>
        </div>
    );
}

export default AudioForm;

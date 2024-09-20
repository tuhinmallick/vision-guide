import React, { useState, useEffect, useRef } from 'react';

function AudioForm({ yoloResults }) {
    const [transcription, setTranscription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const recognitionRef = useRef(null); // Speech recognition reference

    useEffect(() => {
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
                setTranscription(transcript);
                if (transcript.includes('what is')) {
                    handleAskAssistant();
                }
            };
        }
    }, []);

    const startVoiceRecognition = () => {
        recognitionRef.current.start();
        setIsRecording(true);
    };

    const stopVoiceRecognition = () => {
        recognitionRef.current.stop();
        setIsRecording(false);
    };

    const handleAskAssistant = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: transcription, detectedObjects: yoloResults }),
            });

            if (!response.ok) {
                throw new Error('Error communicating with the assistant');
            }

            const data = await response.json();
            setAssistantResponse(data.answer);
        } catch (err) {
            setError('Error getting a response from the assistant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>

            <button
                onClick={startVoiceRecognition}
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105 ${isRecording ? 'bg-red-500' : ''}`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Question:</h3>
                <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{transcription || 'No question recorded yet.'}</p>
            </div>

            {loading && <p className="text-white mt-2">Asking assistant...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {assistantResponse && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Assistant Response:</h3>
                    <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{assistantResponse}</p>
                </div>
            )}
        </div>
    );
}

export default AudioForm;

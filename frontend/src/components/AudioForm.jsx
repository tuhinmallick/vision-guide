import React, { useState } from 'react';

function AudioForm({ yoloResults, onTranscriptionChange }) {
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
                        setTranscription(data.transcription);
                        console.log('Received transcription:', data.transcription); // Debugging
                        if (onTranscriptionChange) {
                            onTranscriptionChange(data.transcription); // Notify parent about transcription change
                        }
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
            {/* AskButton will be added in ParentComponent */}
        </div>
    );
};

export default AudioForm;

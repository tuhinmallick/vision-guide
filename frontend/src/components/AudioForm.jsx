// AudioForm.js
import React, { useState } from 'react';

function AudioForm({ yoloResults }) {
    const [transcription, setTranscription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
                    console.log(data.transcription);
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Audio Transcription</h2>
            <button
                onClick={startRecording}
                disabled={isRecording}
                className={`transition-transform duration-300 ease-in-out transform ${isRecording ? 'scale-95' : 'scale-100'} bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300`}
            >
                Start Recording
            </button>
            <button
                onClick={stopRecording}
                disabled={!isRecording}
                className={`transition-transform duration-300 ease-in-out transform ${!isRecording ? 'scale-100' : 'scale-95'} bg-red-500 text-white py-2 px-4 rounded ${isRecording ? 'animate-pulse' : ''} focus:outline-none focus:ring-2 focus:ring-red-300`}
            >
                Stop Recording
            </button>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Transcription:</h3>
                <p className="text-white">{transcription}</p>
            </div>
            {/* AskButton will be added in ParentComponent */}
        </div>
    );
}

export default AudioForm;

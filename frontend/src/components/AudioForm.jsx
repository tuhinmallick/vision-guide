import React, { useState } from 'react';

function AudioForm({ yoloResults }) {
    const [transcription, setTranscription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state for generating transcription
    const [error, setError] = useState('');

    const handleToggleRecording = async () => {
        if (!isRecording) {
            // Start recording
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const recorder = new MediaRecorder(stream);

                    recorder.ondataavailable = (event) => {
                        setAudioBlob(new Blob([event.data], { type: 'audio/wav' }));
                    };

                    recorder.start();
                    setMediaRecorder(recorder);
                    setIsRecording(true);
                    setIsPaused(false);
                } catch (error) {
                    setError('Error accessing microphone.');
                    console.error('Error accessing microphone:', error);
                }
            } else {
                setError('getUserMedia not supported on this browser.');
            }
        } else {
            // Pause recording (stop recording without stopping the media recorder)
            mediaRecorder.stop();
            setIsPaused(true);
            setIsRecording(false);
        }
    };

    const handleSubmitAudio = async () => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('audio', audioBlob);

            setIsLoading(true);
            setError('');

            // Simulate loading for 1-2 seconds
            setTimeout(async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/speech-to-text', {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json();
                    setTranscription(data.transcription || 'No transcription detected.');
                    console.log('Received transcription:', data.transcription);
                } catch (error) {
                    setError('Failed to transcribe audio.');
                    console.error('Error:', error);
                } finally {
                    setIsLoading(false);
                }
            }, 2000);
        } else {
            setError('No audio recorded.');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Audio Transcription</h2>
            <div className="flex items-center mb-4">
                <button
                    onClick={handleToggleRecording}
                    className={`bg-blue-500 text-white py-2 px-4 rounded transition-transform duration-300 transform ${isRecording ? 'scale-95' : 'scale-100'
                        }`}
                >
                    {isRecording ? 'Pause' : 'Play'}
                </button>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Transcription:</h3>
                {isLoading ? (
                    <div className="text-blue-500 font-semibold">Generating transcription...</div>
                ) : (
                    <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{transcription}</p>
                )}
            </div>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {isPaused && (
                <button
                    onClick={handleSubmitAudio}
                    disabled={isLoading}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 mt-4"
                >
                    Submit Audio
                </button>
            )}
        </div>
    );
}

export default AudioForm;

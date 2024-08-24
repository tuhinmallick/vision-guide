
import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';

const AudioForm = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcript, setTranscript] = useState('');
    const recorderRef = useRef(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = RecordRTC(stream, { type: 'audio' });
            recorder.startRecording();
            recorderRef.current = recorder;
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing audio devices:', error);
        }
    };

    const handleStopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stopRecording(() => {
                const blob = recorderRef.current.getBlob();
                setAudioBlob(blob);
                setIsRecording(false);
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!audioBlob) {
            alert('Please record audio before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('audioBlob', audioBlob, 'audio.wav');

        const response = await fetch('/api/audio/speech-to-text', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        setTranscript(data.results ? data.results[0].alternatives[0].transcript : 'Error processing audio.');
    };

    return (
        <div>
            <h2 className="text-xl mb-4">Record Audio</h2>
            <div className="mb-4">
                {!isRecording ? (
                    <button onClick={handleStartRecording} className="bg-purple-700 text-white py-2 px-4 rounded">
                        Start Recording
                    </button>
                ) : (
                    <button onClick={handleStopRecording} className="bg-purple-700 text-white py-2 px-4 rounded">
                        Stop Recording
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded">
                    Submit
                </button>
            </form>
            <p className="mt-4">{transcript}</p>
        </div>
    );
};

export default AudioForm;

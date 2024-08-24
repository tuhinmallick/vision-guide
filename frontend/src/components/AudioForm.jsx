import React, { useState } from 'react';

const AudioForm = () => {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcript, setTranscript] = useState('');

    const handleStartRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    const audioChunks = [];

                    recorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    recorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        setAudioBlob(audioBlob);
                        const reader = new FileReader();
                        reader.onload = () => {
                            fetch('/api/audio/transcribe', {
                                method: 'POST',
                                body: reader.result
                            })
                                .then(response => response.json())
                                .then(data => {
                                    setTranscript(data.transcript);
                                    if (window.speechSynthesis) {
                                        const utterance = new SpeechSynthesisUtterance(data.transcript);
                                        utterance.lang = 'en-US';
                                        window.speechSynthesis.speak(utterance);
                                    }
                                })
                                .catch(error => console.error('Error transcribing audio:', error));
                        };
                        reader.readAsArrayBuffer(audioBlob);
                    };

                    recorder.start();
                    setMediaRecorder(recorder);
                    setRecording(true);
                })
                .catch(error => console.error('Error accessing media devices:', error));
        } else {
            console.error('Media devices not supported.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl mb-4">Record Audio</h2>
            {!recording ? (
                <button
                    onClick={handleStartRecording}
                    className="bg-purple-700 text-white py-2 px-4 rounded"
                >
                    Start Recording
                </button>
            ) : (
                <button
                    onClick={handleStopRecording}
                    className="bg-red-700 text-white py-2 px-4 rounded"
                >
                    Stop Recording
                </button>
            )}
            <p className="mt-4">{transcript}</p>
        </div>
    );
};

export default AudioForm;

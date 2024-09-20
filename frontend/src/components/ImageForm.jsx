import React, { useState, useRef, useEffect } from 'react';

export const ImageForm = ({ setYoloResults }) => {
    const [objects, setObjects] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [useBackCamera, setUseBackCamera] = useState(false);
    const [awaitingCameraChoice, setAwaitingCameraChoice] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize voice recognition and TTS on component mount
    useEffect(() => {
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
                console.log('Voice Command:', transcript);

                if (awaitingCameraChoice) {
                    // If awaiting for front/back camera selection
                    if (transcript.includes('front') || transcript.includes('the front') || transcript.includes('front camera') || transcript.includes('from front') || transcript.includes('from front camera') || transcript.includes('from the front camera') || transcript.includes('take from the front camera') || transcript.includes('take from front camera') || transcript.includes('i want to take image from front camera') || transcript.includes('i want to take pic from front camera') || transcript.includes('i want to use front camera')) {
                        setUseBackCamera(false);
                        startCamera();
                        setAwaitingCameraChoice(false);
                    } else if (transcript.includes('back') || transcript.includes('back camera') || transcript.includes('from back camera') || transcript.includes('take image from back camera') || transcript.includes('from the back camera') || transcript.includes('take from the back camera') || transcript.includes('take from back camera') || transcript.includes('i want to take image from back camera') || transcript.includes('i want to take pic from back camera') || transcript.includes('i want to use back camera')) {
                        setUseBackCamera(true);
                        startCamera();
                        setAwaitingCameraChoice(false);
                    } else {
                        // talkBack('Sorry, I didn’t get that. Please try again!');
                    }
                    setAwaitingCameraChoice(false);
                }
                // General voice commands
                if (transcript.includes('upload from device') || transcript.includes('upload image from device') || transcript.includes('open file manager') || transcript.includes('open the file manager') || transcript.includes('upload pic from device') || transcript.includes('upload picture from device') || transcript.includes('i want to upload image from device') || transcript.includes('i want to upload from device')) {
                    openFileManager();
                } else if (transcript.includes('capture from camera') || transcript.includes('capture from the camera') || transcript.includes('open the camera') || transcript.includes('open camera') || transcript.includes('i want to capture from camera') || transcript.includes('i want to capture from the camera') || transcript.includes('capture from front camera') || transcript.includes('capture from back camera') || transcript.includes('capture image from the camera') || transcript.includes('capture from picture the camera') || transcript.includes('capture pic from the camera')) {
                    askCameraChoice();
                } else if (transcript.includes('capture image') || transcript.includes('take image') || transcript.includes('capture pic') || transcript.includes('capture picture') || transcript.includes('take picture') || transcript.includes('capture the pic') || transcript.includes('capture the picture') || transcript.includes('capture') || transcript.includes('capture the image') || transcript.includes('take the image') || transcript.includes('take the pic') || transcript.includes('take the picture')) {
                    captureImage();
                } else if (transcript.includes('stop camera') || transcript.includes('stop the camera') || transcript.includes('stop') || transcript.includes('turn off  camera')) {
                    stopCamera();
                }
                //  else {
                //     // Incorrect command
                //     talkBack('Hmmmm, that doesn’t seem right. Try again!');
                // }
            };
        }
    }, [awaitingCameraChoice]);

    // Start listening for voice commands
    const startVoiceRecognition = () => {
        recognitionRef.current.start();
        console.log('Voice recognition started');
    };

    // Speak a message to the user
    const talkBack = (message) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.onend = () => recognitionRef.current.start(); // Restart listening after feedback
        synth.speak(utterance);
    };


    // Ask user for camera choice (front or back)
    const askCameraChoice = () => {
        talkBack('Which camera would you like to use, front or back?');
        setAwaitingCameraChoice(true);
    };

    // Start the camera
    const startCamera = () => {
        setIsCameraOpen(true);
        const constraints = {
            video: {
                facingMode: useBackCamera ? "environment" : "user"
            }
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((error) => {
                console.error('Error accessing the camera:', error);
                setIsCameraOpen(false);
            });
    };

    // Automatically open file manager
    const openFileManager = () => {
        document.querySelector('input[name="image"]').click();
    };

    // Capture image and submit for detection
    const captureImage = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            setImagePreview(imageUrl);
            handleImageUpload(blob);
        }, 'image/jpeg');
        stopCamera();
    };

    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        setIsCameraOpen(false);
    };

    const handleImageUpload = async (imageBlob) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', imageBlob, 'uploaded-image.jpg');

        try {
            const response = await fetch('https://a8b3-2400-adc5-16a-a200-fdc3-22cf-e142-b6e5.ngrok-free.app/api/yolo/detect', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const objectList = data.map(obj => obj[4]).join(', ');
            const resultText = objectList || 'No objects detected.';
            speakObjects(resultText);
            setObjects(resultText);
            setYoloResults(resultText);
        } catch (error) {
            console.error('Error detecting objects with YOLO:', error);
            setObjects('Error detecting objects.');
        } finally {
            setIsLoading(false);
        }
    };

    // Text-to-Speech function to speak detected objects
    const speakObjects = (objects) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(objects);
        synth.speak(utterance);
    };


    return (
        <div className="max-w-lg mx-auto">
            {/* <h2 className="text-2xl font-bold mb-4">Select Image</h2> */}

            <button
                onClick={startVoiceRecognition}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105 mb-4"
            >
                Start Voice Commands
            </button>

            {isCameraOpen && (
                <div className="mt-4">
                    <video ref={videoRef} className="w-full max-w-lg h-auto border rounded-lg mb-4"></video>
                    <canvas ref={canvasRef} className="hidden" width={640} height={480}></canvas>
                </div>
            )}

            <form onSubmit={handleImageUpload} className="flex flex-col">
                <input type="file" name="image" accept="image/*" className="hidden" />
            </form>

            {isLoading && (
                <div className="text-center mt-4">
                    <p className="text-white font-semibold">Processing image, please wait...</p>
                </div>
            )}

            {imagePreview && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Image Preview:</h3>
                    <img src={imagePreview} alt="Preview" className="w-full max-w-lg h-auto border rounded-lg mb-4" />
                </div>
            )}

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Detected Objects:</h3>
                <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{objects}</p>
            </div>
        </div>
    );
};

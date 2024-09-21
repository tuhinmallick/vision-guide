import React, { useState, useRef, useEffect } from 'react';

export const ImageForm = ({ setYoloResults }) => {
    const [objects, setObjects] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [assistantResponse, setAssistantResponse] = useState(''); // Assistant's response state
    const [useBackCamera, setUseBackCamera] = useState(true); // Control which camera to use
    const [awaitingCameraChoice, setAwaitingCameraChoice] = useState(false);
    const [awaitingQuestion, setAwaitingQuestion] = useState(false); // Waiting for user to ask questions
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const recognitionRef = useRef(null);
    const [conversation, setConversation] = useState([]);
    const [countdown, setCountdown] = useState(0);

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

                // Add the user's query to the conversation log
                addToConversation('User', transcript);

                // if (awaitingCameraChoice) {
                //     if (transcript.includes('front')) {
                //         // setUseBackCamera(false);
                //         talkBack('Opening front camera');
                //         startFrontCamera();
                //     } else if (transcript.includes('back')) {
                //         // setUseBackCamera(true);
                //         talkBack('Opening back camera');
                //         startBackCamera();
                //     } else {
                //         talkBack('Sorry, I didn’t get that. Please try again!');
                //     }
                //     setAwaitingCameraChoice(false);
                // }

                if (awaitingQuestion) {
                    handleClick(transcript); // Send question to assistant
                    setAwaitingQuestion(false);
                }

                // General voice commands
                if (transcript.includes('upload from device') || transcript.includes('device') || transcript.includes('file manager')) {
                    openFileManager();
                } else if (transcript.includes('capture from camera') || transcript.includes('capture from the camera') || transcript.includes('open the camera') || transcript.includes('open camera') || transcript.includes('i want to capture from camera') || transcript.includes('i want to capture from the camera') || transcript.includes('capture from front camera') || transcript.includes('capture from back camera') || transcript.includes('capture image from the camera') || transcript.includes('capture from picture the camera') || transcript.includes('capture pic from the camera')) {
                    talkBack("Opening camera")
                    startBackCamera();
                    startCountdown();
                    captureImage();
                }
                //  else if (transcript.includes('capture image') || transcript.includes('take image') || transcript.includes('capture pic') || transcript.includes('capture picture') || transcript.includes('take picture') || transcript.includes('capture the pic') || transcript.includes('capture the picture') || transcript.includes('capture') || transcript.includes('capture the image') || transcript.includes('take the image') || transcript.includes('take the pic') || transcript.includes('take the picture')) {
                //     captureImage();
                // } 
                else if (transcript.includes('stop camera') || transcript.includes('stop the camera') || transcript.includes('stop') || transcript.includes('turn off  camera')) {
                    stopCamera();
                    talkBack("Camera is turned off");
                }
                else if (transcript.includes('who made you')) {
                    talkBack("I was made by team zeroes and ones");
                }
                //  else {
                //     // Incorrect command
                //     talkBack('Hmmmm, that doesn’t seem right. Try again!');
                // }
            };
        }
    }, [awaitingCameraChoice, awaitingQuestion]);

    const startCountdown = () => {
        setCountdown(5);
        let count = 5;

        talkBack(`Taking picture in ${count} seconds...`);
        talkBack(" 5, 4, 3, 2, 1")
        const countdownInterval = setInterval(() => {
            if (count > 0) {

                setCountdown(count);
                count--;
            } else {
                clearInterval(countdownInterval);
                captureImage(); // Capture image after countdown
            }
        }, 1000);
    };

    const addToConversation = (speaker, message) => {
        setConversation(prev => [...prev, { speaker, message }]);
    };

    const startVoiceRecognition = () => {
        recognitionRef.current.start();
        console.log('Voice recognition started');
        talkBack('Go ahead... i am listening...');
    };

    // Provide voice feedback to the user
    const talkBack = (message) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.onend = () => recognitionRef.current.start();
        synth.speak(utterance);
        addToConversation('Assistant', message);
    };

    // Ask user for camera choice (front or back)
    const askCameraChoice = () => {
        talkBack('Which camera would you like to use, front or back?');
        setAwaitingCameraChoice(true);
    };

    // Start the camera based on the user's choice (front/back)
    // const startFrontCamera = () => {
    //     setIsCameraOpen(true);
    //     const constraints = {
    //         video: {
    //             facingMode: 'user'
    //         }
    //     };
    //     navigator.mediaDevices.getUserMedia(constraints)
    //         .then((stream) => {
    //             videoRef.current.srcObject = stream;
    //             videoRef.current.play();
    //         })
    //         .catch((error) => {
    //             console.error('Error accessing the camera:', error);
    //             setIsCameraOpen(false);
    //         });
    // };

    const startBackCamera = () => {
        setIsCameraOpen(true);
        const constraints = {
            video: {
                facingMode: 'environment'
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
        talkBack('Opening file manager');
    };

    // Capture image and submit for detection
    const captureImage = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            setImagePreview(imageUrl);
            talkBack('Image captured. Processing for detection.');
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

    const handleImageUpload = async (image) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', image, image.name || 'uploaded-image.jpg');

        try {
            const response = await fetch('http://localhost:5000/api/yolo/detect', {
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
            if (resultText === 'No objects detected.') {
                setObjects(resultText);
                talkBack('No objects detected.');
            } else {
                talkBack(`Detected objects are: ${resultText}`);
                talkBack('What Question do you have about the image?');
                setAwaitingQuestion(true); // Now we wait for the user's question
            }
            setObjects(resultText);
            setYoloResults(resultText);
            addToConversation('Assistant', `Detected objects: ${resultText}`);
        } catch (error) {
            console.error('Error detecting objects with YOLO:', error);
            setObjects('Error detecting objects.');
            talkBack('Error detecting objects.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = async (transcription) => {
        const prompt = `Consider that you are a guide for a blind person and you have to answer the question based on the attached image detection results. Strictly answer the question based on the image results and the question and say nothing else. Image Results: ${objects.match(/\b[a-zA-Z]+\b/g)}\n Question: ${transcription}`;

        setIsLoading(true); // Set loading state to true
        setAssistantResponse(''); // Clear previous response
        talkBack("waiting for assistant response...");

        try {
            const response = await fetch('/api/chat', {
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
            const generatedText = result.results[0]?.generated_text || 'No response received.';

            setAssistantResponse(generatedText);
            talkBack(generatedText); // Speak the assistant's response
        } catch (error) {
            console.error('Error sending data to chat assistant:', error);
            talkBack('Failed to get a response from the assistant.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];  // Get the selected file
        if (file) {
            setImagePreview(URL.createObjectURL(file));  // Show the preview of the selected image
            talkBack('Image selected from device. Processing for detection.');
            handleImageUpload(file);  // Send the selected file for detection
        }
    };


    return (
        <div className="max-w-lg mx-auto">
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

            <form className="flex flex-col">
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelection(e)}  // Listen for file selection
                />
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
            {(imagePreview &&
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Detected Objects:</h3>
                    <p className="text-white">{objects}</p>
                </div>
            )}


            {assistantResponse && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Assistant Response:</h3>
                    <p className="text-white">{assistantResponse}</p>
                </div>
            )}

            {/* Chat Display */}
            <div className="mt-4 bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2 text-gray-950">Conversation:</h3>
                {conversation.map((entry, index) => (
                    <div key={index} className="mb-2 text-gray-700">
                        <strong>{entry.speaker}: </strong>
                        <span>{entry.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

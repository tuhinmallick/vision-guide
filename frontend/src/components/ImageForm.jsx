import React, { useState, useRef } from 'react';

export const ImageForm = ({ setYoloResults }) => {
    const [objects, setObjects] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [useBackCamera, setUseBackCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Start the camera
    const startCamera = () => {
        setIsCameraOpen(true);
        setIsModalOpen(false);
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

    // Capture an image from the video feed
    const captureImage = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            setImagePreview(imageUrl);
            handleImageUpload(blob);
        }, 'image/jpeg');

        // Stop camera after capture
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        setIsCameraOpen(false);
    };

    // Handle image upload for captured or selected image
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

            const data = await response.json().catch(() => ({}));
            const objectList = data.map(obj => `${obj[4]}: ${(obj[5] * 100).toFixed(2)}%`).join(', ');
            setObjects(objectList || 'No objects detected.');
            setYoloResults(objectList || 'No objects detected.');
            setIsModalOpen(false); // Close modal after successful upload
        } catch (error) {
            console.error('Error detecting objects with YOLO:', error);
            setObjects('Error detecting objects.');
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    // Handle form submission for file input
    const handleSubmit = async (event) => {
        event.preventDefault();
        const imageFile = event.target.image.files[0];
        setImagePreview(URL.createObjectURL(imageFile)); // Set image preview for selected image
        handleImageUpload(imageFile);
        setIsModalOpen(false); // Close modal after image selection
    };

    // Convert text to audio using Speech Synthesis
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
        <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Select Image</h2>

            {/* Button to open modal for upload options */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-700 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105 mb-4"
            >
                Upload Image
            </button>

            {/* Modal for choosing upload options */}
            {isModalOpen && (
                <div className="absolute text-black inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm"> {/* Responsive modal for mobile */}
                        <h3 className="text-xl font-bold mb-4">Choose Image Source</h3>
                        <button
                            onClick={() => setUseBackCamera(!useBackCamera)}
                            className="bg-blue-300 text-white py-1 px-2 rounded-lg mb-2"
                        >
                            Switch to {useBackCamera ? "Front" : "Back"} Camera
                        </button>
                        <button
                            onClick={startCamera}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105 mb-2"
                        >
                            Capture from Camera
                        </button>
                        <p className='text-xl font-semibold mt-4'>Upload from device</p>
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="block mb-4 p-2 border rounded-lg border-gray-300"
                            />
                            <button
                                type="submit"
                                className="bg-purple-700 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
                            >
                                Submit
                            </button>
                        </form>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Video feed and capture button */}
            {isCameraOpen && (
                <div className="mt-4">
                    <video ref={videoRef} className="w-full max-w-lg h-auto border rounded-lg mb-4"></video>
                    <button
                        onClick={captureImage}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
                    >
                        Capture Image
                    </button>
                    <canvas ref={canvasRef} className="hidden" width={640} height={480}></canvas>
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="text-center mt-4">
                    <p className="text-blue-500 font-semibold">Processing image, please wait...</p>
                </div>
            )}

            {/* Image preview section */}
            {imagePreview && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Image Preview:</h3>
                    <img src={imagePreview} alt="Preview" className="w-full max-w-lg h-auto border rounded-lg mb-4" />
                </div>
            )}

            {/* Detected objects display */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Detected Objects:</h3>
                <p className="bg-gray-100 text-gray-900 p-4 rounded-lg border border-gray-300">{objects}</p>
                {/* Button to play detected objects audio */}
                <button
                    onClick={() => convertTextToAudio(objects)}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
                >
                    Hear Detected Objects
                </button>
            </div>
        </div>
    );
};

import React from 'react';
import { useState } from 'react';
import { ImageForm } from './components/ImageForm';
import AudioForm from './components/AudioForm';
import AskButton from './components/AskButton';
import logo from './assets/logo.png';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [yoloResults, setYoloResults] = useState('');
  const [transcription, setTranscription] = useState('');

  return (
    <div className="p-4 min-h-screen flex  justify-center items-center  bg-gray-500 w-screen ">
      <div className='w-full max-w-md p-8 text-white  bg-gradient-to-br from-blue-400 via-purple-600 to-purple-300 bg-opacity-40 border-pink-800 rounded-lg shadow-lg'>
        <div className=" flex justify-center">
          <img src={logo} alt="App Logo" className="h-[7rem]" />
        </div>
        <ImageForm setYoloResults={setYoloResults} />
        <ErrorBoundary>
          <AudioForm setTranscription={setTranscription} yoloResults={yoloResults} />
        </ErrorBoundary>
        {/* <AskButton yoloResults={yoloResults} transcription={transcription} /> */}
      </div>
    </div>
  );
};

export default App;

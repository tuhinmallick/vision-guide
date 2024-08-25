import React from 'react';
import { useState } from 'react';
import { ImageForm } from './components/ImageForm';
import AudioForm from './components/AudioForm';
import AskButton from './components/AskButton';
import logo from './assets/logo.png';

const App = () => {
  const [yoloResults, setYoloResults] = useState('');
  const [transcription, setTranscription] = useState('');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-500 w-screen">
      {/* Logo Section */}
      <div className="mb-6">
        <img src={logo} alt="App Logo" className="h-16" />
      </div>

      <div className='bg-gray-50 rounded-lg shadow-md p-8 text-gray-900 py-8'>

        <ImageForm setYoloResults={setYoloResults} />
        <AudioForm setTranscription={setTranscription} yoloResults={yoloResults} />
        {/* <AskButton yoloResults={yoloResults} transcription={transcription} /> */}
      </div>
    </div>
  );
};

export default App;

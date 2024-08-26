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
    <div className="min-h-screen flex flex-col justify-center items-center  bg-gray-500 w-screen ">
      <div className='bg-gradient-to-br from-blue-500 via-purple-600 to-purple-300 rounded-lg shadow-md p-8 text-black'>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="App Logo" className="h-16" />
        </div>
        <ImageForm setYoloResults={setYoloResults} />
        <AudioForm setTranscription={setTranscription} yoloResults={yoloResults} />
        {/* <AskButton yoloResults={yoloResults} transcription={transcription} /> */}
      </div>
    </div>
  );
};

export default App;

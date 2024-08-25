
import React from 'react';
import { useState } from 'react';
import { ImageForm } from './components/ImageForm';
import AudioForm from './components/AudioForm';
import AskButton from './components/AskButton';

const App = () => {
  const [yoloResults, setYoloResults] = useState('');
  const [transcription, setTranscription] = useState('');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-500 w-screen">
      <div className='bg-gray-50 rounded-lg shadow-md p-8 text-gray-900  py-8'>
        <ImageForm setYoloResults={setYoloResults} />
        <AudioForm setTranscription={setTranscription} yoloResults={yoloResults} />
        {/* <AskButton yoloResults={yoloResults} transcription={transcription} /> */}
      </div>
    </div>
  );
};

export default App;



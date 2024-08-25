
import React from 'react';
import { useState } from 'react';
import { ImageForm } from './components/ImageForm';
import AudioForm from './components/AudioForm';
import AskButton from './components/AskButton';

const App = () => {
  const [yoloResults, setYoloResults] = useState('');
  const [transcription, setTranscription] = useState('');

  return (
      <div>
          <ImageForm setYoloResults={setYoloResults} />
          <AudioForm setTranscription={setTranscription} yoloResults={yoloResults} />
          <AskButton yoloResults={yoloResults} transcription={transcription} />
      </div>
  );
};

export default App;



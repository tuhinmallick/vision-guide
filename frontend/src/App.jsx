
import React from 'react';
import AudioForm from './components/AudioForm';
import ImageForm from './components/ImageForm';

function App() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Vision Guide</h1>
      <AudioForm />
      <ImageForm />
    </div>
  );
}

export default App;

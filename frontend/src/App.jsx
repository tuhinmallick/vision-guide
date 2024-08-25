
import React from 'react';
import AudioForm from './components/AudioForm';
import ImageForm from './components/ImageForm';

function App() {
  return (
    <>
      <div className=' bg-gray-900 min-h-screen w-screen flex flex-col justify-center items-center'>
        <h1 className="text-3xl font-bold text-center mb-8">Vision Guide</h1>
        <div className='bg-white rounded-lg shadow-lg shadow-gray-800'>
          <AudioForm />
          <ImageForm />
        </div>
      </div>
    </>
  );
}

export default App;

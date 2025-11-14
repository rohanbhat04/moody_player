import React from 'react'
import FacialExpression from './FacialExpression'
import Playlist from './Playlist'
import {useState} from 'react';


const App = () => {
  const [songs, setSongs] = useState([ ]);
  const [detectedEmotion, setDetectedEmotion] = useState(null);

  return (
    <div className='bg-gray-800 p-[4rem] '>
      <h1 className="text-4xl font-mono py-[2rem]">Live Mood Detection</h1>
      <FacialExpression setSongs={setSongs} onEmotionDetected={setDetectedEmotion} />
      <Playlist songs = {songs} detectedEmotion={detectedEmotion} /> 
    </div>
  )
}

export default App
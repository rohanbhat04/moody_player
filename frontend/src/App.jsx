import React from 'react'
import FacialExpression from './FacialExpression'
import Playlist from './Playlist'

const App = () => {
  return (
    <div className='bg-gray-800 p-[4rem] '>
      <h1 className="text-4xl font-mono py-[2rem]">Live Mood Detection</h1>
      <FacialExpression />
      <Playlist /> 
    </div>
  )
}

export default App
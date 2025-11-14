import { useState, useEffect } from "react";

const Playlist = ({ songs, detectedEmotion }) => {
  const [isPlaying, setIsPlaying] = useState(null);

  const handlePlayPause = (index) => {
    if (isPlaying === index) {
      setIsPlaying(null);
    } else {
      setIsPlaying(index);
    }
  };

  useEffect(() => {
    console.log("Current songs:", songs);
    console.log("Current emotion:", detectedEmotion);
  }, [songs, detectedEmotion]);

  return (
    <div>
      {detectedEmotion && (
        <h1 className="py-[2rem] text-4xl font-mono">
          Recommended Tracks for {detectedEmotion} Mood
        </h1>
      )}

      {songs.length > 0 ? (
        songs.map((song, index) => (
          <div
            key={index}
            className="my-[1rem] flex justify-between items-center bg-gray-700 p-4 rounded-lg"
          >
            <div>
              <h1 className="text-2xl text-white">{song.title}</h1>
              <h4 className="text-gray-300">{song.artist}</h4>
              <p className="text-sm text-gray-400">Mood: {song.mood}</p>
            </div>
            <div>
              {isPlaying === index && (
                <audio
                  src={song.audio}
                  autoPlay
                  controls
                  className="hidden"
                  onEnded={() => setIsPlaying(null)}
                />
              )}
              <button
                onClick={() => handlePlayPause(index)}
                className="bg-blue-500 p-2 rounded-full hover:bg-blue-600"
              >
                {isPlaying === index ? (
                  <i className="ri-pause-line text-white"></i>
                ) : (
                  <i className="ri-play-fill text-white"></i>
                )}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No songs available for this mood</p>
      )}
    </div>
  );
};

export default Playlist;

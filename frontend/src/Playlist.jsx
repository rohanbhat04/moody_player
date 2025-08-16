import { useState } from "react";

const Playlist = () => {
  const [songs, setSongs] = useState([
    {
      title: "test-title",
      artist: "test-artist",
      url: "test-url",
    },
    {
      title: "test-title-2",
      artist: "test-artist-2",
      url: "test-url-2",
    },
    {
      title: "test-title-3",
      artist: "test-artist-3",
      url: "test-url-3",
    },
    {
      title: "test-title-4",
      artist: "test-artist-4",
      url: "test-url-4",
    },
  ]);

  return (
    <div>
      <h1 className="py-[2rem] text-4xl font-mono">Recommended Tracks</h1>
      {songs.map((song,index) => (
        <div key={index} className="my-[1rem] flex justify-between items-center">
          <div>
            <h1 className="text-2xl">{song.title}</h1>
            <h4>{song.artist}</h4>
          </div>

          <div className="text-3xl">
            <i class="ri-play-fill"></i>
            <i class="ri-pause-line"></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Playlist;

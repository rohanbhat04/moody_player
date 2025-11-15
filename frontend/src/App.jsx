import React from "react";
import FacialExpression from "./FacialExpression";
import Playlist from "./Playlist";
import { useState } from "react";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8 ">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text">
              Live Mood Detection
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Realtime facial-expression → mood-based playlist
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-xs text-gray-400">Camera:</div>
            <div className="px-3 py-1 rounded-full bg-green-600 text-xs font-semibold">
              Enabled
            </div>
          </div>
        </header>

        {/* layout: left = detector, right = playlist sidebar */}
        <style>{`::-webkit-scrollbar { display: none; } * { scrollbar-width: none; -ms-overflow-style: none; }`}</style>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: detector (takes two columns on lg) */}
          <section className="lg:col-span-2 bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-lg">
            <FacialExpression
              setSongs={setSongs}
              onEmotionDetected={setDetectedEmotion}
            />
          </section>

          {/* Right: playlist. make it sticky and scrollable when content is long */}
          <aside className="lg:block">
            <div
              className="sticky top-6"
              style={{
                maxHeight: "calc(100vh - 4rem)",
                overflow: "auto",
                paddingRight: "0.5rem",
              }}
            >
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-semibold">Session</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Detected mood and quick controls
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Current mood</span>
                    <span className="font-medium">
                      {detectedEmotion ? detectedEmotion : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tracks</span>
                    <span className="font-medium">{songs.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-700/30 to-indigo-900/10 border border-gray-700 rounded-xl p-4">
                <h4 className="text-sm text-gray-300 mb-3">Playlist</h4>
                {/* Make inner playlist container independent scroll when sidebar is tall */}
                <div
                  style={{
                    maxHeight: "calc(100vh - 12rem)",
                    overflowY: "auto",
                    paddingRight: "0.25rem",
                  }}
                >
                  <Playlist songs={songs} detectedEmotion={detectedEmotion} />
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Mobile: show playlist below detector with collapse area to avoid very long pages */}
        <div className="lg:hidden mt-6">
          <div className="bg-gray-800/50 border hidden border-gray-700 rounded-lg p-4">
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <Playlist songs={songs} detectedEmotion={detectedEmotion} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

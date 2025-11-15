const express = require("express");
const multer = require("multer");
const uploadFile = require("../services/storage.service");
const Song = require("../models/songs.model"); 
const songModel = require("../models/songs.model");

const upload = multer({ storage: multer.memoryStorage() });
const routes = express.Router();

routes.post("/songs", upload.single("audio"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const fileData = await uploadFile(req.file);


    const newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      emotion: req.body.emotion || req.body.mood, // <- accept either
      audio: fileData.url
    });

    await newSong.save(); 

    res.status(201).json({
      message: "Song uploaded successfully",
      song: newSong,
    });
  } catch (error) {
    console.error(error);
    res.status(406).json({ error: error.message });
  }
});


routes.get('/songs', async (req,res)=>{
  const { mood } = req.query;

  const songs = await songModel.find({
    mood: mood
  })

  res.status(200).json({
    message:"songs fetched successfully",
    songs
  })
})

routes.get('/songs/:emotion', async (req, res) => {
  try {
    const { emotion } = req.params;
    console.log('Searching songs for mood:', emotion);

    const songs = await Song.find({ 
      mood: emotion.toLowerCase() 
    });

    console.log('Found songs:', songs);
    res.status(200).json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = routes;
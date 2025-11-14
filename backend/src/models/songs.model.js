const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audio: String,
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'neutral', 'surprised'], // add all emotions you want to support
    required: true
  }
});

const songModel = mongoose.model("songs",songSchema);

module.exports = songModel;
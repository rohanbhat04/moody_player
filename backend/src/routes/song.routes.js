const express = require("express");
const multer = require("multer");
const uploadFile = require("../services/storage.service");

const upload = multer({ storage: multer.memoryStorage() });

const routes = express.Router();

routes.post("/songs", upload.single("audio"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const fileData = await uploadFile(req.file);
    console.log(fileData);

    res.status(500).json({
      message: "Song uploaded successfully",
      file: fileData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = routes;

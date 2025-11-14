 var ImageKit = require("imagekit");

var imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT
});

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: file.buffer, // audio buffer
        fileName: `${Date.now()}${file.originalname}`, // unique file name
        folder: "moody-audio"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

module.exports = uploadFile;
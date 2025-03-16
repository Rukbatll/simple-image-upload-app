const express = require("express");
const multer = require("multer");
const app = express();

const upload = multer({ storage: multer.memoryStorage()});

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      message: 'Image uploaded successfully',
      filename: req.file.originalname,
      size: req.file.size,
    });
  });
  
  module.exports = app;

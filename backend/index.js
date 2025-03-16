const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(os.tmpdir(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.use(cors({ origin: ['http://localhost:5173', 'https://simple-image-upload-app.vercel.app'] }));
app.use(express.json());
app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));

app.get('/', (req, res) => {
  res.send('Image Uploader Backend is running!');
});

app.post('/upload', (req, res) => {
  console.log('Received POST to /upload');
  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).send('Server error: ' + err.message);
    }
    if (!req.file) return res.status(400).send('No file uploaded.');
    const host = req.headers.host;
    const imageUrl = `https://${host}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
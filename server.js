import express from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables for local testing
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Configure Multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// POST endpoint for uploading images
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.originalname,
      url, // URL of the uploaded file
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Export for Vercel serverless functions
export default app;

// Optional: Local testing server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
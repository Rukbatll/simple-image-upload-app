import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false); // For drag feedback

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true); // Highlight drop zone
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false); // Reset highlight
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select or drop a file!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://simple-image-upload-app.vercel.app/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
        return;
      }
      setMessage(data.message);
      setImageUrl(data.url);
      setFile(null);
    } catch (error) {
      setMessage('Network error');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Image Uploader</h1>
      <form onSubmit={handleSubmit}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #00f' : '2px dashed #ccc',
            padding: '20px',
            marginBottom: '10px',
            backgroundColor: isDragging ? '#e0e0ff' : '#fff',
          }}
        >
          <p>Drag and drop an image here, or:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
}

export default App;
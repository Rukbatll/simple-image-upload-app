import React, { useState } from 'react';
import exitIconUrl from "./assets/exit.svg";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const uploadFile = async (fileToUpload) => {
    if (!fileToUpload) {
      setMessage('Please select or drop a file!');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(fileToUpload.type)) {
      setMessage('Invalid file type! Please use JPG, PNG, or GIF.');
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (fileToUpload.size > maxSize) {
      setMessage('File size exceeds 2MB! Please use a smaller file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', fileToUpload); // Reverted to 'image' to match backend

    try {
      const response = await fetch('https://simple-image-upload-app.vercel.app/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        setMessage('Server error: Unexpected response format');
        return;
      }

      if (!response.ok) {
        setMessage(data.message || `Upload failed: ${response.status}`);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      uploadFile(droppedFile);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >

      <header>Image Uploader</header>
      <label htmlFor="fileInput">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #007bff' : '2px dashed #d1d5db',
            outline: "8px solid #ffffff",
            borderRadius: "8px",
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            backgroundColor: '#FFFFFF',
            cursor: "pointer",
            height: "300px",
            width: "500px",
            alignContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={exitIconUrl}
              alt="Upload icon"
              style={{
                width: "32px",
                height: "32px",
                marginBottom: "10px",
              }}
            />
            <p>
              Drag & drop a file or{" "}
              <span style={{ color: '#007bff', textDecoration: 'underline' }}>
                browse files
              </span>
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              JPG, PNG or GIF - Max file size 2MB
            </p>
          </div>
        </div>
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
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
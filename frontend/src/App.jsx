import { useState } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        setImages((prev) => [...prev, data.imageUrl]);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
      }
    } else {
      alert('Please upload a valid image file.');
    }
  };

  return (
    <div className="App">
      <h1>Image Uploader</h1>
      <input type="file" onChange={handleImageUpload} />
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Preview ${index}`} style={{ maxWidth: '300px' }} />
      ))}
    </div>
  );
}

export default App;
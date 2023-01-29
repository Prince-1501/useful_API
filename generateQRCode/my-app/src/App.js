import React, { useState } from 'react';
import axios from 'axios';
import './styles/main.css'

function App() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [quote, setQuote] = useState({});

  const [image, setImage] = useState(null);
  const [className, setClassName] = useState('');
  const [probability, setProbability] = useState('');

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  }

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    try {
      // Create a FormData object to send the image in the POST request
      const formData = new FormData();
      formData.append('image', image);

      // Send the POST request
      const response = await fetch('https://url-to-qr.onrender.com/recognize', {
        method: 'POST',
        body: formData
      });

      // Parse the JSON response
      const jsonResponse = await response.json();

      // Extract the first class name and probability from the response
      const firstClass = jsonResponse[0];
      setClassName(firstClass.className);
      setProbability(firstClass.probability);

    } catch (error) {
      console.log(error);
    }
  }

  const handleQuoteSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('https://url-to-qr.onrender.com/quote');
      setQuote(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (event) => {
    setUrl(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://url-to-qr.onrender.com/qr-code/${url}`);
      const qrCode = await response.url;
      setQrCode(qrCode);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1 className="heading">URL to QR Code Generator</h1>
      <form onSubmit={handleSubmit} className='form'>
        <input type="text" value={url} onChange={handleChange} placeholder="Enter URL" className='input'/>
        <button type="submit" className='button'>Generate QR Code</button>
      </form>

      <div className="qr-code-container">
        {qrCode && <img src={qrCode} alt="QR Code" />}
      </div>

      <h1 className="heading">Image Recognition</h1>
      <form onSubmit={handleImageSubmit} className='form'>
        <input type="file" onChange={handleImageChange} accept="image/*" className='input'/>
        <button type="submit" className='button'>Recognize</button>
      </form>

      <div className="image-container">
        {className && <p>Class Name: {className}</p>}
        {probability && <p>Probability: {probability}</p>}
        {image && <img src={URL.createObjectURL(image)} alt="Selected Image" />}
      </div>

      <h1 className="heading">Random Quote Generator</h1>
      <form onSubmit={handleQuoteSubmit} className='form'>
        <button type="submit" className='button'>Generate Quote</button>
      </form>

      <div className="quote-container">
        {quote.content && <p className="quote-content">"{quote.content}"</p>}
        {quote.author && <p className="quote-author">- {quote.author}</p>}
      </div>

    </div>

  );
}

export default App;

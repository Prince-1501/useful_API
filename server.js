const express = require('express');
const qrcode = require('qrcode');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const quotable = require('quotable');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const upload = multer();

app.get('/', (req, res) => {
    res.send("Welcome to QR Code API. Please hit the endpoint /qr-code/:url with a valid URL to generate QR code.");
});

app.get('/qr-code/:url', async (req, res) => {
    try {
        const url = req.params.url;
        const qr_code = await qrcode.toDataURL(url,{ width: 500, color: { dark: '#0373c6', light: '#ffffff' } });
        res.setHeader('Content-Type', 'image/png');
        console.log(`QR code generated for ${url}`);
        res.send(Buffer.from(qr_code.split(',')[1], 'base64'));
    }catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

const validateImage = (req, res, next) => {
  // check if an image was provided
  if (!req.file) {
    return res.status(400).json({ error: 'Please provide an image' });
  }
  
  // check if the uploaded file is an image
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ error: 'Please provide a valid image' });
  }
  next();
};

app.post('/recognize', validateImage, async (req, res) => {
  try {
      // read the image file
      const image = await tf.node.decodeImage(req.file.buffer);
      // load the MobileNet model
      const model = await mobilenet.load();
      // perform image recognition
      const predictions = await model.classify(image);
      res.status(200).json(predictions);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.get('/quote', async (req, res) => {
  try{
    let quotes = await quotable.getQuotes().then(data => data.results);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log(randomQuote);
    res.status(200).send(randomQuote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/// --legacy-peer-deps

const port = 3000;
app.listen(port, () => console.log(`QR code API running on port ${port}`));

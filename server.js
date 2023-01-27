const express = require('express');
const qrcode = require('qrcode');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

const port = 3000;
app.listen(port, () => console.log(`QR code API running on port ${port}`));

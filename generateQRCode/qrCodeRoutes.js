const qrCode = require('./qrCode');

const qrCodeRoutes  = (app)  => {
    app.get('/', async (req, res) => {
        try {
            console.log(req.params.url);
            if (!req.params.url || typeof req.params.url !== 'string') {
                return res.status(400).send('Invalid URL');
            }
            const qr_code = await qrCode.generateQRCode(req.params.url);
            res.setHeader('Content-Type', 'image/png');
            console.log(`QR code generated for ${req.params.url}`);
            res.send(Buffer.from(qr_code.split(',')[1], 'base64'));
        }catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    });
};

module.exports = { qrCodeRoutes };

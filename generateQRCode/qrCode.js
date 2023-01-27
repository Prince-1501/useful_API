const qrcode = require('qrcode')

const generateQRCode = async (url) => {
    try {
        url = encodeURIComponent(url);
        const qr_code = await qrcode.toDataURL(url,{ width: 500, color: { dark: '#0373c6', light: '#ffffff' } });
        return qr_code;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = {
    generateQRCode
}

const crypto = require('crypto');
const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a',
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  sandbox: process.env.PAYFAST_SANDBOX !== 'false',
  getUrl() {
    return this.sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
  }
};
function generateSignature(data, passphrase = '') {
  const payload = {};
  Object.keys(data).sort().forEach(key => {
    if (key !== 'signature' && data[key] !== '' && data[key] != null) payload[key] = data[key];
  });
  const paramString = Object.keys(payload)
    .map(key => `${key}=${encodeURIComponent(payload[key]).replace(/%20/g, '+')}`)
    .join('&');
  const stringToHash = passphrase ? `${paramString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}` : paramString;
  return crypto.createHash('md5').update(stringToHash).digest('hex');
}
function verifySignature(data, signature, passphrase = '') {
  return generateSignature(data, passphrase) === signature;
}
module.exports = { PAYFAST_CONFIG, generateSignature, verifySignature };
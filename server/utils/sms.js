const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendSMS = async (to, body) => {
  try {
    let formatted = to;
    if (formatted.startsWith('0')) formatted = '+27' + formatted.substring(1);
    if (!formatted.startsWith('+')) formatted = '+' + formatted;
    const message = await client.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to: formatted });
    console.log('📱 SMS sent:', message.sid);
    return true;
  } catch (err) { console.error('SMS Error:', err.message); return false; }
};
module.exports = { sendSMS };
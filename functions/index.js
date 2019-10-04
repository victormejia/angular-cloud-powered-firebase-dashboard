const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// for sending email:
// 1. enable access to less secure apps:
//    https://www.google.com/settings/security/lesssecureapps
// 2. Display Unlock Captcha:
//    https://accounts.google.com/DisplayUnlockCaptcha
// For a gmail account with 2-step verification enabld, you will need to use
// an app password:
//    https://support.google.com/accounts/answer/185833

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
})

const APP_NAME = 'The Grid Dashboard';

async function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <thegrid.manager@gmail.com>`,
    to: email
  }

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName || ''}! Welcome to the elite team of secret agents`;

  await mailTransport.sendMail(mailOptions);

  console.log('New welcome email sent to: ', email);

  return null;
}

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const displayName = user.displayName;
  
  return sendWelcomeEmail(email, displayName);
})
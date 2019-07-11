'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

 // Create the transporter with the required configuration for Outlook
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: 'jonathan@gojourneylife.com',
        pass: 'Journey$17'
    }
})

exports.sendPulse = functions.https.onRequest((req, res) => {
    if(req.body.pulseUrl == null || req.body.pulseTitle == null) {
        return null;
    }

    // setup e-mail data, even with unicode symbols
    const mailOptions = {
        from: '"JourneyLIFE " <jonathan@gojourneylife.com>', // sender address (who sends)
        to: 'jonathan@kairosgarage.com', // list of receivers (who receives)
        subject: req.body.pulseTitle, // Subject line
        text: 'Hello world', // plaintext body
        html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
        res.status(200).json('Pulse Sent')
    });
});
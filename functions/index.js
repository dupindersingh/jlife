const admin = require('firebase-admin')
const functions = require('firebase-functions')
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });


admin.initializeApp(functions.config().firebase)

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
        pass: 'Pursue$17'
    }
})

exports.sendPulse = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.body.pulseUrl == null || req.body.pulseTitle == null || req.body.employees == null || req.body.company == null) {
            console.log("pulseUrl: " + req.body.pulseUrl);
            console.log("pulseTitle: " + req.body.pulseTitle);
            console.log("employees: " + req.body.employees);
            console.log("company: " + req.body.company);
            return res.status(404).json("data not found");
        }

        // // setup e-mail data, even with unicode symbols
        // const mailOptions = {
        //     from: '"JourneyLIFE " <jonathan@gojourneylife.com>', // sender address (who sends)
        //     cc: req.body.employees, // list of receivers (who receives)
        //     subject: req.body.pulseTitle, // Subject line
        //     html: `
        //     <b>Hi there! </b>
        //     <br><br> It's time for a JourneyLIFE Pulse! 
        //     <br> Go here: <a href=${req.body.pulseUrl} + '?email=' + ${req.body.email} >${req.body.pulseTitle}</a>
        //     <br><br><br>Thanks!
        //     <br>JourneyLIFE Team
        //     `, // html body
        // };

        // // send mail with defined transport object
        // return transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         return res.send(error.toString());
        //     }

        //     console.log('Message sent: ' + info.response);
        //     return res.status(200).json('Pulse Sent')
        // });

        for (let i = 0; i < req.body.employees.length; i++) {
            // setup e-mail data, even with unicode symbols
            const mailOptions = {
                from: '"JourneyLIFE " <jonathan@gojourneylife.com>', // sender address (who sends)
                cc: req.body.employees[i], // list of receivers (who receives)
                subject: req.body.pulseTitle, // Subject line
                html: `
            Hi there!
            <br><br> It's time for a JourneyLIFE Pulse! 
            <br> Take the pulse: <a href=${req.body.pulseUrl}?email=${req.body.employees[i]}&company=${req.body.company} >${req.body.pulseTitle}</a>
            <br><br><br>Thanks!
            <br>JourneyLIFE Team
            `, // html body
            };
    
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("ERROR: " + error)
                    return res.send(error.toString());
                }
            });
        }
        return res.status(200).json('Pulse Sent');
    })
});
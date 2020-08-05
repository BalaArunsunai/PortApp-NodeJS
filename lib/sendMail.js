const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config');




var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'mamptl22@gmail.com',
        pass: ''
    }
}));

/* const transporter = nodemailer.createTransport({
    port: 465,
    host: 'gmail.com',
   
    auth: {
        user: config.mail.userEmail,
        pass: Buffer.from(config.mail.userMailPassword, 'base64').toString()
    },
     tls: {
        rejectUnauthorized: false
      }
}); */

exports.sendMail = function (sendTo, subject, content, banner, ccTo, bccTo) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: config.mail.userEmail,
            to: sendTo,
            cc: ccTo,
            bcc: bccTo,
            subject: subject,
            html: `hi`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(info);
            }
        });
    });
};
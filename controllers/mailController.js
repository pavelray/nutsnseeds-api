const pdf = require('html-pdf');
const nodemailer = require('nodemailer');

const fs = require('fs');
const { renderInvoice } = require('../utils/renderTemplate');
const catchAsync = require('../utils/catchAsync');

const templateItems = fs.readFileSync(`${__dirname}/../templates/invoice-item-template.html`, 'utf-8');
const templateInvoice = fs.readFileSync(`${__dirname}/../templates/invoice-template.html`, 'utf-8');

// This config need to read from .ENV file
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'pavel.atgstores@gmail.com',
    pass: 'jdhngykrexpzdepf'
  }
});

exports.sendMail = catchAsync(async (req, res) => {
  const { dest, subject, invoiceData, html } = req.body;

  let bufferData;
  const output = renderInvoice(templateInvoice, templateItems, invoiceData);

  pdf.create(output).toBuffer(function(err, buffer) {
    bufferData = buffer;
    const mailOptions = {
      from: 'pavel.atgstores@gmail.com', // This should read from .ENV file
      to: dest,
      subject: subject, // email subject
      html: html, // email content in HTML
      attachments: [
        {
          filename: 'invoice.pdf',
          content: bufferData,
          contentType: 'application/pdf'
        }
      ]
    };
    // returning result

    // eslint-disable-next-line no-unused-vars
    return transporter.sendMail(mailOptions, (error, _info) => {
      if (error) {
        return res.send(error.toString());
      }
      return res.send('Sended');
    });
  });
});

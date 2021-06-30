const nodemailer = require('nodemailer')
const contactRouter = require('express').Router()
const config = require('../utils/config')

contactRouter.post('/', (request, response) => {
  const body = request.body
  const transporter = nodemailer.createTransport({
    service: config.NODEMAILER_SERVICE,
    auth: {
      user: config.NODEMAILER_USER,
      pass: config.NODEMAILER_PASSWORD,
    },
  })
  const mailOptions = {
    from: body.email,
    to: 'yg97.cs@gmail.com',
    subject: `Message  from ${body.name}, email: ${body.email}, subject: ${body.subject}`,
    text: body.message,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      response.send('error')
    } else {
      console.log('Email sent: ', info.response)
      response.send('success')
    }
  })
})

module.exports = contactRouter

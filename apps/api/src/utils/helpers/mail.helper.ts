import { createTransport } from 'nodemailer'

let transporterConfig = {
  host: process.env.MailHost,
  port: parseInt(process.env.MailPort as string),
  secure: false,
  auth: {
    user: process.env.MailUser,
    pass: process.env.MailPassword,
  },
}

let transporter = createTransport(transporterConfig)

export const sendMail = async (to: string, subject: string, text: string) => {
  let mailOptions = {
    from: process.env.mailUser,
    to,
    subject,
    text,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
  })
}

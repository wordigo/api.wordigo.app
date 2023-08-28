import { SendMailOptions, createTransport } from "nodemailer";

let transporterConfig = {
  host: process.env.SMTP_MAIL_HOST,
  port: parseInt(process.env.SMTP_MAIL_PORT as string),
  secure: false,
  auth: {
    user: process.env.SMPT_MAIL_USER,
    pass: process.env.SMTP_MAIL_PASSWORD,
  },
};

let transporter = createTransport(transporterConfig);

export const sendMail = async (to: string, subject: string, html: string) => {
  let mailOptions: SendMailOptions = {
    from: process.env.SMPT_MAIL_USER,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  });
};

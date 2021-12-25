import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'bw62otlix2ttzd3o@ethereal.email',
      pass: 'ts6aVPkkPJww7aKVcH',
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: to,
    subject: subject,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

import nodemailer from 'nodemailer'

const emailSignUp = async (data: { email: string, name: string, token: string }) => {
  const transport = nodemailer.createTransport({
    host: String(process.env.EMAIL_HOST),
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: String(process.env.EMAIL_USER),
      pass: String(process.env.EMAIL_PASS)
    }
  });

  const { email, name, token } = data

  // Send email
  const info = await transport.sendMail({
    from: 'Vet App',
    to: email,
    subject: 'Confirm your account',
    text: 'Confirm your account',
    html: `
      <p>Hello ${name}, confirm your account on Vet App.</p>
      <p>Your account is ready.</p>
      <a href="${process.env.CLIENT_URL}/confirm/${token}">Confirm account</a>

      <p>If you didn't create this account, you can ignore this message.</p>
      <p>Thanks for using Vet App.</p>
    `
  });

  console.log('Message sent: %s', info.messageId);
}

export default emailSignUp
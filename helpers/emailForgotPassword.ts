import nodemailer from 'nodemailer'

const emailForgotPassword = async (data: { email: string, name: string, token: string }) => {
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
    subject: 'Reset your password',
    text: 'Reset your password',
    html: `
      <p>Hello ${name}, you're solicited to reset your password on Vet App.</p>
      <a href="${process.env.CLIENT_URL}/forgot-password/${token}">Reset password</a>

      <p>If you didn't solicited it, you can ignore this message.</p>
      <p>Thanks for using Vet App.</p>
    `
  });

  console.log('Message sent: %s', info.messageId);
}

export default emailForgotPassword
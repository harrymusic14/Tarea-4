import nodemailer from 'nodemailer'
import pug from 'pug'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendConfirmationEmail = async (
  to: string,
  name: string,
  accountNumber: string
) => {
  const templatePath = path.join(__dirname, '../templates/confirmation.pug')
  const html = pug.renderFile(templatePath, { name, accountNumber })

  await transporter.sendMail({
    from: `"Banco App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Confirmación de registro',
    html,
  })
}

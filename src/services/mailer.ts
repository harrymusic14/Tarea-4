import nodemailer from 'nodemailer'
import pug from 'pug'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
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
  try {
    const templatePath = path.join(__dirname, '../templates/confirmation.pug')
    const html = pug.renderFile(templatePath, { name, accountNumber })

    await transporter.sendMail({
      from: `"Banco App" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Confirmación de registro',
      html,
    })

    console.log(`📧 Correo enviado a ${to}`)
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error)
  }
}

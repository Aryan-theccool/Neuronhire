'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_123')

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log('--- MOCK EMAIL SENT ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Content: ${html}`)
    console.log('-----------------------')
    return { success: true, mocked: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'NeuralHire <notifications@NeuralHire.app>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Resend Error:', error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    return { error: err.message }
  }
}


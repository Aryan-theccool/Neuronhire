import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Standard Razorpay Test Keys for local development. Will use env variables if available.
const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_rYn0e6Z9q5J0S9'
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'bB9t9yXwY3g0o7V7c8f0L1'

const razorpay = new Razorpay({
  key_id,
  key_secret,
})

export async function POST(req: NextRequest) {
  try {
    const { amount_inr } = await req.json()
    
    const options = {
      amount: amount_inr * 100, // exact amount in paise
      currency: 'INR',
      receipt: `rcpt_${Math.floor(Math.random() * 10000)}`
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Razorpay Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

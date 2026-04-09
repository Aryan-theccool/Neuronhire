'use client'

import { useState } from 'react'

export default function RazorpayButton({ amountINR, buttonText = "Buy Now" }: { amountINR: number, buttonText?: string }) {
  const [loading, setLoading] = useState(false)

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    const res = await loadRazorpay()

    if (!res) {
      alert('Razorpay SDK failed to load. Check your connection.')
      setLoading(false)
      return
    }

    try {
      const dbRequest = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount_inr: amountINR }),
      })
      
      const order = await dbRequest.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_rYn0e6Z9q5J0S9', // Use fallback test key if needed
        amount: order.amount,
        currency: order.currency,
        name: 'NeuronHire India',
        description: 'Test AI Purchase',
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`)
        },
        prefill: {
          name: 'Test Indian User',
          email: 'test@neuronhire.in',
          contact: '9999999999'
        },
        theme: {
          color: '#3498db'
        }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (e) {
      console.error(e)
      alert("Payment initiation failed.")
    }
    setLoading(false)
  }

  return (
    <button onClick={handlePayment} disabled={loading} className="button button-primary" style={{width: '100%'}}>
      {loading ? 'Processing...' : buttonText}
    </button>
  )
}

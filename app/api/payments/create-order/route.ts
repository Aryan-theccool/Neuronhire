import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { amount_inr, contract_id } = await request.json()
  return NextResponse.json({ order_id: 'order_test_' + Date.now(), amount: amount_inr * 100 })
}

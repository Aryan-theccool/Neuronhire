import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  console.log('Proposal notification:', body)
  return NextResponse.json({ sent: true })
}

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ score: 940, message: 'NeuronScore recalculated' })
}

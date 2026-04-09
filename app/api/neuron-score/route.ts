import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateNeuronScore } from '@/lib/neuron-score'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const score = await calculateNeuronScore(user.id, supabase)
    return NextResponse.json({ 
      score, 
      message: 'NeuronScore recalculated successfully' 
    })
  } catch (error: any) {
    console.error('NeuronScore recalc error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

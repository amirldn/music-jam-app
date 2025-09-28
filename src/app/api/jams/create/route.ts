import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { supabase } from '@/lib/supabase'
import { generateJamCode } from '@/lib/jamUtils'

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate a unique jam code
    let code = generateJamCode()
    let attempts = 0
    const maxAttempts = 10

    // Ensure code is unique
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('jams')
        .select('id')
        .eq('code', code)
        .single()

      if (!existing) break
      code = generateJamCode()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 })
    }

    // Create the jam (no name needed)
    const { data: jam, error } = await supabase
      .from('jams')
      .insert({
        code,
        host_user_id: session.user.id || session.user.email || 'unknown'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating jam:', error)
      return NextResponse.json({ error: 'Failed to create jam' }, { status: 500 })
    }

    return NextResponse.json({ jam })
  } catch (error) {
    console.error('Error in jam creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
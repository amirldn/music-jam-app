import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await auth()
    const { code } = await params

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if jam exists
    const { data: jam, error: jamError } = await supabase
      .from('jams')
      .select('id')
      .eq('code', code.toUpperCase())
      .single()

    if (jamError || !jam) {
      return NextResponse.json({ error: 'Jam not found' }, { status: 404 })
    }

    const userId = session.user.id || session.user.email || 'unknown'

    // Remove participant from jam
    const { error: deleteError } = await supabase
      .from('jam_participants')
      .delete()
      .eq('jam_id', jam.id)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error leaving jam:', deleteError)
      return NextResponse.json({ error: 'Failed to leave jam' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in jam leave:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
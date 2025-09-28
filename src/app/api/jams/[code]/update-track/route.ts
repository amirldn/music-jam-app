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

    const { track_id, is_playing } = await request.json()

    if (typeof track_id !== 'string' && track_id !== null) {
      return NextResponse.json({ error: 'Invalid track_id' }, { status: 400 })
    }

    if (typeof is_playing !== 'boolean') {
      return NextResponse.json({ error: 'Invalid is_playing' }, { status: 400 })
    }

    // Check if jam exists and is active
    const { data: jam, error: jamError } = await supabase
      .from('jams')
      .select('id')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (jamError || !jam) {
      return NextResponse.json({ error: 'Jam not found' }, { status: 404 })
    }

    const userId = session.user.id || session.user.email || 'unknown'

    // Update participant's track
    const { data: participant, error: updateError } = await supabase
      .from('jam_participants')
      .update({
        spotify_track_id: track_id,
        is_playing,
        last_updated: new Date().toISOString()
      })
      .eq('jam_id', jam.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating track:', updateError)
      return NextResponse.json({ error: 'Failed to update track' }, { status: 500 })
    }

    return NextResponse.json({ participant })
  } catch (error) {
    console.error('Error in track update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
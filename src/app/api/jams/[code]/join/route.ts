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

    // Check if jam exists and is active
    const { data: jam, error: jamError } = await supabase
      .from('jams')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (jamError || !jam) {
      return NextResponse.json({ error: 'Jam not found' }, { status: 404 })
    }

    const userId = session.user.id || session.user.email || 'unknown'
    const userName = session.user.name || session.user.email || 'Unknown User'
    const userAvatar = session.user.image || ''

    // Join the jam (upsert in case user rejoins)
    const { data: participant, error: participantError } = await supabase
      .from('jam_participants')
      .upsert({
        jam_id: jam.id,
        user_id: userId,
        user_name: userName,
        user_avatar: userAvatar,
        spotify_track_id: null,
        is_playing: false,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'jam_id,user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (participantError) {
      console.error('Error joining jam:', participantError)
      return NextResponse.json({ error: 'Failed to join jam' }, { status: 500 })
    }

    return NextResponse.json({ jam, participant })
  } catch (error) {
    console.error('Error in jam join:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
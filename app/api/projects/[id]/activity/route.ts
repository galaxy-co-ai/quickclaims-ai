import { NextResponse } from 'next/server'
import { getActivityLog } from '@/lib/activity'

export async function GET(_: Request, { params }: any) {
  const entries = await getActivityLog(params.id, 50)
  return NextResponse.json({ activity: entries })
}

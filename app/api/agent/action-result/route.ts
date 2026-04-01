import { NextRequest, NextResponse } from 'next/server'
import { resolvePendingAction } from '@/lib/agent/bridge/ActionBridge'

export async function POST(req: NextRequest) {
  try {
    const { stepId, result } = await req.json()
    
    if (!stepId || !result) {
      return NextResponse.json({ error: 'Missing stepId or result' }, { status: 400 })
    }

    const observation = result.success ? result.data : `Lỗi: ${result.error}`
    const success = resolvePendingAction(stepId, observation)

    if (success) {
      return NextResponse.json({ ok: true })
    } else {
      return NextResponse.json({ error: 'Action not found or already resolved' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  fullName:     z.string().min(2),
  phone:        z.string().regex(/^0(5[0-9]|[2-489])\d{7,8}$/),
  email:        z.string().email(),
  businessType: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // TODO: forward to Make.com / Zapier / CRM
    console.log('[lead]', new Date().toISOString(), data)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.issues }, { status: 400 })
    }
    console.error('[lead] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

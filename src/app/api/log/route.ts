import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Esto  sale en Vercel Logs (Functions)
    console.log('[client-log]', JSON.stringify(body));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[client-log-error]', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

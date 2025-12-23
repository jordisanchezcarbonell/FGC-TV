export const runtime = 'nodejs';

export async function GET() {
  const state = globalThis.__meltyCronState ?? {
    lastRun: null,
    lastCheck: null,
    history: [],
  };
  return Response.json({ ok: true, ...state });
}

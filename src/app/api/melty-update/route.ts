export const runtime = 'nodejs';

type CronLog = {
  status: 'ran' | 'skipped';
  message: string;
  date: string; // YYYY-MM-DD (Madrid)
  time: string; // HH:mm:ss (Madrid)
  timezone: 'Europe/Madrid';
  iso: string; // UTC ISO
  hour: number;
  minute: number;
};

declare global {
  // Persistencia "best-effort" mientras el instance esté caliente
  // (NO garantizado entre invocaciones ni deployments)
  // eslint-disable-next-line no-var
  var __meltyCronState:
    | { lastRun: CronLog | null; lastCheck: CronLog | null; history: CronLog[] }
    | undefined;
}
export {};

function initState() {
  if (!globalThis.__meltyCronState) {
    globalThis.__meltyCronState = {
      lastRun: null,
      lastCheck: null,
      history: [],
    };
  }
  return globalThis.__meltyCronState;
}

function madridTimeNow() {
  const now = new Date();

  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(now)
  );
  const minute = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid',
      minute: '2-digit',
    }).format(now)
  );

  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // YYYY-MM-DD

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(now); // HH:mm:ss

  return { hour, minute, date, time, iso: now.toISOString() };
}

function assertCronAuth(req: Request) {
  const secret = process.env.CRON_SECRET || '';
  const auth = req.headers.get('authorization') || '';
  if (!secret) return { ok: false as const, reason: 'CRON_SECRET missing' };
  if (auth !== `Bearer ${secret}`)
    return { ok: false as const, reason: 'Unauthorized' };
  return { ok: true as const };
}

export async function GET(req: Request) {
  const auth = assertCronAuth(req);
  if (!auth.ok) {
    return Response.json({ ok: false, error: auth.reason }, { status: 401 });
  }

  const state = initState();
  const { hour, minute, date, time, iso } = madridTimeNow();

  // Guarda siempre "lastCheck" (POC)
  const base = {
    date,
    time,
    timezone: 'Europe/Madrid' as const,
    iso,
    hour,
    minute,
  };

  // Si NO es medianoche, guardamos un JSON "skipped"
  if (!(hour === 0 && minute === 0)) {
    const log: CronLog = {
      ...base,
      status: 'skipped',
      message: `No es medianoche en Madrid (${hour}:${String(minute).padStart(
        2,
        '0'
      )})`,
    };

    state.lastCheck = log;
    // opcional: no metas todos los skips al history (se llena rápido)
    // state.history.unshift(log);

    console.log('[CRON] skipped', log);

    return Response.json({ ok: true, skipped: true, log });
  }

  // Si SÍ es medianoche, guardamos un JSON "ran"
  const runLog: CronLog = {
    ...base,
    status: 'ran',
    message: `Se ha lanzado el cron el día ${date} a las ${time} (Europe/Madrid)`,
  };

  state.lastRun = runLog;
  state.lastCheck = runLog;
  state.history.unshift(runLog);
  state.history = state.history.slice(0, 30);

  console.log('[CRON] ran', runLog);

  // Aquí iría tu lógica real (scrape, etc.) en el futuro

  return Response.json({ ok: true, ran: true, log: runLog });
}

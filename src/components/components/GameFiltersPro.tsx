'use client';

import * as React from 'react';
import { Search, ArrowUpDown, Sparkles, X, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type FilterMode = 'ALL' | 'ONLY' | 'EXCLUDE';

type Props = {
  games: string[];
  counts: Record<string, number>; // counts.__ALL__ opcional
  mode: FilterMode;
  setMode: (m: FilterMode) => void;
  selected: string[];
  setSelected: (next: string[]) => void;
  poolSize: number;
};

function uniqSorted(list: string[]) {
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

export function GameFiltersPro({
  games,
  counts,
  mode,
  setMode,
  selected,
  setSelected,
  poolSize,
}: Props) {
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState<'popular' | 'az'>('popular');

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const items = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    const filtered = query
      ? games.filter((g) => g.toLowerCase().includes(query))
      : [...games];

    filtered.sort((a, b) => {
      if (sort === 'popular') return (counts[b] ?? 0) - (counts[a] ?? 0);
      return a.localeCompare(b);
    });

    return filtered;
  }, [games, counts, q, sort]);

  const clear = () => {
    setSelected([]);
    setMode('ALL');
    setQ('');
  };

  const toggleModeKeepSelection = () => {
    if (mode === 'ONLY') setMode('EXCLUDE');
    else if (mode === 'EXCLUDE') setMode('ONLY');
  };

  const selectTop = (n: number) => {
    const top = [...games]
      .sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))
      .slice(0, n);
    setSelected(top);
    setMode('ONLY');
  };

  const toggleGame = (g: string) => {
    // UX: si estás en ALL y clicas => pasas a ONLY con ese juego
    if (mode === 'ALL') {
      setMode('ONLY');
      setSelected([g]);
      return;
    }

    const next = new Set(selectedSet);
    if (next.has(g)) next.delete(g);
    else next.add(g);

    const nextArr = uniqSorted(Array.from(next));
    if (nextArr.length === 0) {
      setSelected([]);
      setMode('ALL');
      return;
    }

    setSelected(nextArr);
  };

  const chipBase =
    'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  const chipClass = (active: boolean) => {
    if (mode === 'EXCLUDE') {
      return active
        ? 'border-destructive/40 bg-destructive/15 text-destructive hover:bg-destructive/20'
        : 'border-border bg-background text-foreground hover:bg-muted/70';
    }
    if (mode === 'ONLY') {
      return active
        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
        : 'border-border bg-background text-foreground hover:bg-muted/70';
    }
    return 'border-border bg-background text-foreground hover:bg-muted/70';
  };

  return (
    <div className='w-full space-y-2'>
      {/* TOP BAR */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        {/* Mode segmented */}
        <div className='inline-flex overflow-hidden rounded-full border border-border bg-background'>
          <button
            type='button'
            onClick={() => {
              setMode('ALL');
              setSelected([]);
            }}
            className={cn(
              'h-8 px-3 text-xs font-medium transition',
              mode === 'ALL'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            )}
          >
            All
          </button>

          <button
            type='button'
            onClick={() => setMode('ONLY')}
            className={cn(
              'h-8 px-3 text-xs font-medium transition',
              mode === 'ONLY'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            )}
          >
            Only
          </button>

          <button
            type='button'
            onClick={() => setMode('EXCLUDE')}
            className={cn(
              'h-8 px-3 text-xs font-medium transition',
              mode === 'EXCLUDE'
                ? 'bg-destructive text-destructive-foreground'
                : 'text-foreground hover:bg-muted'
            )}
          >
            Exclude
          </button>
        </div>

        {/* Search + actions */}
        <div className='flex flex-1 items-center justify-end gap-2'>
          <div className='relative w-full max-w-[340px]'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Buscar juego…'
              className={cn(
                'h-8 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
            />
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 rounded-full px-3 text-xs'
            onClick={() => setSort((s) => (s === 'popular' ? 'az' : 'popular'))}
            title={sort === 'popular' ? 'Orden: Popular' : 'Orden: A–Z'}
          >
            <ArrowUpDown className='mr-2 h-4 w-4' />
            {sort === 'popular' ? 'Popular' : 'A–Z'}
          </Button>

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 rounded-full px-3 text-xs'
            onClick={() => selectTop(5)}
            title='Selecciona los 5 más populares (Only)'
          >
            <Sparkles className='mr-2 h-4 w-4' />
            Top 5
          </Button>

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 rounded-full px-3 text-xs'
            onClick={() => selectTop(10)}
            title='Selecciona los 10 más populares (Only)'
          >
            Top 10
          </Button>

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 rounded-full px-3 text-xs'
            onClick={toggleModeKeepSelection}
            disabled={mode === 'ALL' || selected.length === 0}
            title='Cambiar Only ↔ Exclude manteniendo selección'
          >
            {mode === 'ONLY' ? (
              <Ban className='mr-2 h-4 w-4' />
            ) : (
              <Sparkles className='mr-2 h-4 w-4' />
            )}
            Toggle
          </Button>

          <div className='flex items-center gap-2'>
            <span className='text-xs text-muted-foreground'>Pool:</span>
            <Badge variant='secondary' className='rounded-full'>
              {poolSize}
            </Badge>
          </div>

          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 rounded-full px-3 text-xs'
            onClick={clear}
            disabled={mode === 'ALL' && selected.length === 0 && !q}
          >
            <X className='mr-2 h-4 w-4' />
            Clear
          </Button>
        </div>
      </div>

      {/* CHIPS */}
      <div className='relative w-full'>
        <div
          className={cn(
            'flex w-full items-center gap-2 py-1 pr-6',
            'overflow-x-auto whitespace-nowrap scroll-smooth',
            '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'md:flex-wrap md:whitespace-normal md:pr-0 md:overflow-x-visible'
          )}
        >
          {items.map((g) => {
            const active = selectedSet.has(g);
            const c = counts[g] ?? 0;

            return (
              <button
                key={g}
                type='button'
                onClick={() => toggleGame(g)}
                className={cn(chipBase, chipClass(active))}
                aria-pressed={active}
                title={g}
              >
                <span className='max-w-[22ch] truncate'>{g}</span>

                <Badge
                  variant='outline'
                  className={cn(
                    'rounded-full px-2 py-0 text-[11px] leading-5',
                    mode === 'EXCLUDE' && active
                      ? 'border-destructive/30 text-destructive'
                      : mode === 'ONLY' && active
                      ? 'border-transparent bg-background/15 text-primary-foreground'
                      : 'border-muted-foreground/20 text-muted-foreground'
                  )}
                >
                  {c}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUMMARY */}
      {mode !== 'ALL' && selected.length > 0 ? (
        <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
          <span className='font-medium'>
            {mode === 'ONLY' ? 'Solo:' : 'Excluyendo:'}
          </span>
          <span className='truncate'>
            {selected.slice(0, 10).join(', ')}
            {selected.length > 10 ? ` +${selected.length - 10} más` : ''}
          </span>
        </div>
      ) : null}
    </div>
  );
}

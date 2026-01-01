'use client';

import { Button } from '@/components/ui/button';

type Props = {
  games: string[];
  value: string; // 'ALL' o nombre del juego
  onChange: (next: string) => void;
  counts?: Record<string, number>; // opcional: conteo por juego
};

export function GameFilters({ games, value, onChange, counts }: Props) {
  const items = ['ALL', ...games];

  return (
    <div className='flex w-full items-center gap-2 overflow-x-auto py-1'>
      {items.map((g) => {
        const active = value === g;
        const label = g === 'ALL' ? 'All' : g;
        const count = !counts
          ? null
          : g === 'ALL'
          ? counts.__ALL__ ?? null
          : counts[g] ?? null;

        return (
          <Button
            key={g}
            type='button'
            variant={active ? 'default' : 'outline'}
            size='sm'
            onClick={() => onChange(g)}
            className='shrink-0 rounded-full'
          >
            {label}
            {count != null ? (
              <span className='ml-2 opacity-70'>({count})</span>
            ) : null}
          </Button>
        );
      })}
    </div>
  );
}

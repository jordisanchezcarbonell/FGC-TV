'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  games: string[];
  value: string; // 'ALL' o nombre del juego
  onChange: (next: string) => void;
  counts?: Record<string, number>; // opcional: conteo por juego (usa __ALL__ para total)
};

export function GameFilters({ games, value, onChange, counts }: Props) {
  const items = React.useMemo(() => {
    const list = [...games];

    // Si hay counts, ordena por popularidad (desc). Si no, alfabético.
    list.sort((a, b) => {
      if (counts) return (counts[b] ?? 0) - (counts[a] ?? 0);
      return a.localeCompare(b);
    });

    return ['ALL', ...list];
  }, [games, counts]);

  return (
    <div className='relative w-full'>
      {/* Degradados laterales para sugerir scroll */}
      <div className='pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent' />
      <div className='pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent' />

      <div
        className={cn(
          'flex w-full items-center gap-2 py-1 pr-6',
          // móvil: scroll horizontal
          'overflow-x-auto whitespace-nowrap scroll-smooth',
          // oculta scrollbar (cross-browser)
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          // desktop: permite wrap si te interesa (quita esto si quieres siempre scroll)
          'md:flex-wrap md:whitespace-normal md:pr-0 md:overflow-x-visible'
        )}
        role='tablist'
        aria-label='Game filters'
      >
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
              aria-pressed={active}
              title={label}
              className={cn(
                'shrink-0 rounded-full',
                'h-8 px-3 text-xs font-medium',
                'transition-colors',
                active ? 'shadow-sm' : 'bg-background hover:bg-muted/60',
                // mejora legibilidad de borde en outline
                !active && 'border-muted-foreground/20'
              )}
            >
              <span className='max-w-[18ch] truncate'>{label}</span>

              {count != null ? (
                <Badge
                  variant={active ? 'secondary' : 'outline'}
                  className={cn(
                    'ml-2 rounded-full px-2 py-0 text-[10px] leading-5',
                    active
                      ? 'bg-background/15 text-primary-foreground border-transparent'
                      : 'border-muted-foreground/20 text-muted-foreground'
                  )}
                >
                  {count}
                </Badge>
              ) : null}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

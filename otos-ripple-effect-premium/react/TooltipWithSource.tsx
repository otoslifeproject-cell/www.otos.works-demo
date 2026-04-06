import React from 'react';

export type TooltipItem = {
  name: string;
  displayPrice: string;
  rangeNote?: string;
  sourceUrl: string;
};

export type TooltipState = {
  isOpen: boolean;
  x: number;
  y: number;
  title: string;
  totalLabel: string;
  items: TooltipItem[];
};

function shortHost(url: string) {
  try {
    const u = new URL(url);
    return u.host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function TooltipWithSource({ state }: { state: TooltipState }) {
  if (!state.isOpen) return null;

  return (
    <div
      className="ripple-tip"
      role="tooltip"
      style={{
        left: state.x + 14,
        top: state.y + 14,
      }}
    >
      <h4>{state.title}</h4>
      <div className="tip-total">{state.totalLabel}</div>
      <ul>
        {state.items.map((it, idx) => (
          <li key={`${it.name}-${idx}`}>
            {it.name} — <span style={{ color: 'var(--gold)', fontWeight: 950 }}>{it.displayPrice}</span>
            {it.rangeNote ? <div className="tip-source">{it.rangeNote}</div> : null}
            {it.sourceUrl ? (
              <div className="tip-source">
                <a href={it.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {shortHost(it.sourceUrl)}
                </a>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}


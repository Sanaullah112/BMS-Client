import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5
  );

  return (
    <div className="flex items-center justify-end gap-1 px-1 py-3">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded p-1.5 text-text-muted hover:bg-black/[0.04] disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'h-7 w-7 rounded text-xs font-medium',
            p === page ? 'bg-ink text-white' : 'text-text-muted hover:bg-black/[0.04]'
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded p-1.5 text-text-muted hover:bg-black/[0.04] disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

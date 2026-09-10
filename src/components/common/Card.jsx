import clsx from 'clsx';

export default function Card({ children, className, title, action, noPadding }) {
  return (
    <div className={clsx('bg-white border border-line rounded', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          {title && <h3 className="text-sm font-semibold text-ink">{title}</h3>}
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}

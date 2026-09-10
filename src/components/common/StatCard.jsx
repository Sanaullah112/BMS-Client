import clsx from 'clsx';

const ACCENTS = {
  brass: 'border-l-brass',
  success: 'border-l-success',
  danger: 'border-l-danger',
  warning: 'border-l-warning',
  ink: 'border-l-ink',
};

export default function StatCard({ label, value, icon: Icon, accent = 'ink', hint }) {
  return (
    <div className={clsx('bg-white border border-line border-l-[3px] rounded px-4 py-3.5', ACCENTS[accent])}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        {Icon && <Icon size={16} className="text-text-faint" />}
      </div>
      <div className="mt-1.5 text-2xl font-semibold text-ink tnum">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-text-faint">{hint}</div>}
    </div>
  );
}

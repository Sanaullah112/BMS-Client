import clsx from 'clsx';

const TONES = {
  neutral: 'bg-black/[0.04] text-text-muted',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  warning: 'bg-warning-bg text-warning',
  brass: 'bg-brass/10 text-brass-dark',
};

export default function Badge({ children, tone = 'neutral', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium capitalize',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

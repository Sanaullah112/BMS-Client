import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink-light disabled:bg-ink/50',
  brass: 'bg-brass text-white hover:bg-brass-dark disabled:bg-brass/50',
  success: 'bg-success text-white hover:brightness-95 disabled:bg-success/50',
  danger: 'bg-danger text-white hover:brightness-95 disabled:bg-danger/50',
  ghost: 'bg-transparent text-text hover:bg-black/[0.04] border border-line',
  link: 'bg-transparent text-brass hover:text-brass-dark underline-offset-2 hover:underline px-0',
};

const SIZES = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-sm px-5 py-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className,
  type = 'button',
  as: Component = 'button',
  ...props
}) {
  const isButtonEl = Component === 'button';
  return (
    <Component
      type={isButtonEl ? type : undefined}
      disabled={isButtonEl ? disabled || loading : undefined}
      aria-disabled={!isButtonEl ? disabled || loading : undefined}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : Icon ? <Icon size={15} /> : null}
      {children}
    </Component>
  );
}

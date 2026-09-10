import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder = 'Select…', className, required, ...props },
  ref
) {
  const id = props.id || props.name;
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={clsx(
            'w-full appearance-none rounded border bg-white px-3 py-2 pr-9 text-sm text-text',
            'focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass',
            error ? 'border-danger' : 'border-line'
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-faint" />
      </div>
      {error ? <span className="text-xs text-danger">{error}</span> : hint ? <span className="text-xs text-text-muted">{hint}</span> : null}
    </div>
  );
});

export default Select;

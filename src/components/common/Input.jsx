import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  { label, error, hint, type = 'text', className, required, ...props },
  ref
) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;
  const id = props.id || props.name;

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={clsx(
            'w-full rounded border bg-white px-3 py-2 text-sm text-text placeholder:text-text-faint',
            'focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass',
            error ? 'border-danger' : 'border-line'
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <span id={`${id}-error`} className="text-xs text-danger">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="text-xs text-text-muted">
          {hint}
        </span>
      ) : null}
    </div>
  );
});

export default Input;

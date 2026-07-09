import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-body-sm font-semibold text-on-surface mb-sm">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-md py-md bg-surface-container border rounded-lg text-on-surface placeholder-on-surface-variant input-glow focus:border-primary ${
            error ? 'border-error' : 'border-outline-variant'
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-error text-body-sm mt-xs">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

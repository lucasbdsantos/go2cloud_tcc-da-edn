import React, { useId } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-body-sm font-semibold text-on-surface mb-sm">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-md py-md bg-surface-container border rounded-lg text-on-surface input-glow focus:border-primary ${
            error ? 'border-error' : 'border-outline-variant'
          } ${className}`}
          {...props}
        >
          <option value="">Selecione uma opção</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} role="alert" className="text-error text-body-sm mt-xs">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

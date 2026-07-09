import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2';

  const variants = {
    primary:
      'bg-gradient-to-r from-primary to-secondary text-on-primary hover:scale-105 hover:shadow-[0_0_24px_rgba(56,189,248,0.4)] active:scale-95',
    secondary:
      'border border-outline-variant bg-surface/40 backdrop-blur-md text-on-surface hover:bg-surface-variant',
    ghost: 'text-on-surface-variant hover:text-primary',
  };

  const sizes = {
    sm: 'px-md py-sm text-body-sm',
    md: 'px-xl py-md text-body-md',
    lg: 'px-2xl py-lg text-body-lg',
  };

  const finalClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  return (
    <button className={finalClassName} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}

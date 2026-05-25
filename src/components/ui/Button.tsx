import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  };

  const variantStyles = {
    primary:
      'bg-ocean-600 text-sand-50 hover:bg-ocean-700 disabled:bg-ocean-200 disabled:text-ocean-400',
    secondary:
      'bg-terracotta-500 text-sand-50 hover:bg-terracotta-600 disabled:bg-terracotta-100 disabled:text-terracotta-400',
    outline:
      'border border-ocean-600 text-ocean-700 bg-transparent hover:bg-ocean-50 disabled:text-ink-light disabled:border-sand-300',
    ghost:
      'bg-transparent text-ocean-700 hover:bg-ocean-50 disabled:text-ink-light',
    text: 'bg-transparent text-ocean-600 hover:text-ocean-800 underline-offset-4 hover:underline disabled:text-ink-light',
  };

  const buttonStyles = [
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth ? 'w-full' : '',
    disabled || isLoading ? 'cursor-not-allowed opacity-60' : '',
    className,
  ].join(' ');

  return (
    <button className={buttonStyles} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;

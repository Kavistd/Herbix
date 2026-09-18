import React, { forwardRef } from 'react';

/**
 * Herbix Reusable Input Component
 * 
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.error]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {'pill' | 'rounded'} [props.variant='pill']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {string} [props.className]
 */
const Input = forwardRef(function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  variant = 'pill',
  size = 'md',
  className = '',
  id,
  type = 'text',
  ...rest
}, ref) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const roundedClass = variant === 'pill' ? 'rounded-full' : 'rounded-2xl';

  const sizeClasses = {
    sm: 'text-xs py-2 ' + (leftIcon ? 'pl-8 ' : 'pl-3.5 ') + (rightIcon ? 'pr-8' : 'pr-3.5'),
    md: 'text-sm py-2.5 ' + (leftIcon ? 'pl-10 ' : 'pl-4 ') + (rightIcon ? 'pr-10' : 'pr-4'),
    lg: 'text-base py-3.5 ' + (leftIcon ? 'pl-12 ' : 'pl-5 ') + (rightIcon ? 'pr-12' : 'pr-5'),
  }[size];

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 ml-1"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-charcoal-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full bg-cream-50/90 text-charcoal-900 placeholder:text-charcoal-400
            border transition-all duration-200
            focus:outline-none focus:bg-white
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
              : 'border-cream-300 hover:border-cream-400 focus:border-leaf-600 focus:ring-3 focus:ring-leaf-500/15'
            }
            shadow-soft-xs
            ${roundedClass}
            ${sizeClasses}
            ${className}
          `}
          {...rest}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-charcoal-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-600 ml-2 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-charcoal-500 ml-2">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;


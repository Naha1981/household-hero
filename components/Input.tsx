import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  Icon?: React.ElementType; // For icons within the input
  labelClassName?: string; // Added for custom label styling
}

const Input: React.FC<InputProps> = ({ label, id, error, Icon, className, labelClassName, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-sm font-medium mb-1 ${labelClassName ? labelClassName : 'text-slate-700'}`}
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={inputId}
          className={`block w-full px-3 py-2 border ${
            error ? 'border-error text-error placeholder-error/70 focus:ring-error focus:border-error' 
                  : 'border-neutral/30 text-base-content placeholder-neutral/50 focus:ring-primary/50 focus:border-primary'
          } rounded-md shadow-sm sm:text-sm disabled:bg-neutral/10 ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default Input;
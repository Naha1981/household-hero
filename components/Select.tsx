import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string; 
  labelClassName?: string; // Added for custom label styling
}

const Select: React.FC<SelectProps> = ({ label, id, options, error, className, placeholder, labelClassName, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId} 
          className={`block text-sm font-medium mb-1 ${labelClassName ? labelClassName : 'text-slate-700'}`}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-error text-error focus:ring-error focus:border-error' 
                : 'border-neutral/30 text-base-content focus:ring-primary/50 focus:border-primary'
        } rounded-md shadow-sm sm:text-sm disabled:bg-neutral/10 ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default Select;
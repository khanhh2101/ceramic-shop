import React from 'react';

export default function Textarea({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full border rounded-xl px-4 py-3 text-sm transition-all outline-none resize-y focus:ring-2 
          ${error 
            ? 'border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50/30' 
            : 'border-gray-200 focus:ring-[#b5624a]/20 focus:border-[#b5624a] bg-gray-50 hover:bg-white focus:bg-white'
          }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

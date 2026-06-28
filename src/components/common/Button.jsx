import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  icon: Icon, 
  isLoading = false, 
  disabled = false, 
  className = '',
  size = 'md' 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-xl gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-[#b5624a] hover:bg-[#9a513b] text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <div className={`w-4 h-4 border-2 rounded-full animate-spin ${
          variant === 'outline' || variant === 'secondary' ? 'border-gray-500 border-t-transparent' : 'border-white border-t-transparent'
        }`} />
      ) : Icon && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />
      )}
      {children}
    </button>
  );
}

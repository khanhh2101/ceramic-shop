export default function ActionIconButton({
  onClick,
  icon: Icon,
  title = '',
  variant = 'edit', // 'edit' | 'delete' | 'toggle-on' | 'toggle-off' | 'view'
  disabled = false,
  className = ''
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'edit':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
      case 'delete':
        return 'bg-red-50 text-red-600 hover:bg-red-100';
      case 'toggle-on':
        return 'bg-green-50 text-green-600 hover:bg-green-100';
      case 'toggle-off':
        return 'bg-orange-50 text-orange-600 hover:bg-orange-100';
      case 'view':
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
    >
      <Icon size={16} />
    </button>
  );
}



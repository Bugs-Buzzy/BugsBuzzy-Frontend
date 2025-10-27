interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
  text?: string;
  className?: string;
  spinnerClassName?: string;
  textClassName?: string;
}

const Loading = ({
  size = 'md',
  layout = 'vertical',
  text = 'در حال دریافت اطلاعات...',
  className = '',
  spinnerClassName = '',
  textClassName = '',
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-2',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const layoutClasses = layout === 'vertical' ? 'flex-col gap-4' : 'flex-row gap-3 items-center';
  const spinnerAlign = layout === 'horizontal' ? '' : 'mx-auto';
  const textAlign = layout === 'horizontal' ? '' : 'text-center';

  return (
    <div className={`flex ${layoutClasses} ${className}`}>
      <div
        className={`animate-spin rounded-full border-primary-sky ${sizeClasses[size]} ${spinnerAlign} ${spinnerClassName}`}
      ></div>
      {text && (
        <p className={`text-primary-aero ${textSizeClasses[size]} ${textAlign} ${textClassName}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;

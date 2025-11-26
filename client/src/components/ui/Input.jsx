import React from 'react';

const Input = ({ 
  label,
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`input-group ${containerClassName}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
            pointerEvents: 'none'
          }}>
            <Icon size={18} />
          </div>
        )}
        <input
          className={`input ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span style={{ 
          fontSize: 'var(--text-sm)', 
          color: 'var(--accent-danger)',
          marginTop: 'var(--spacing-xs)'
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

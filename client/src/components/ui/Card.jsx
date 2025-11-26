import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  glass = false,
  hover = true,
  padding = true,
  ...props 
}) => {
  const baseClass = glass ? 'card card-glass' : 'card';
  const hoverClass = hover ? '' : 'hover:transform-none hover:shadow-none';
  const paddingClass = padding ? '' : 'p-0';

  return (
    <div 
      className={`${baseClass} ${hoverClass} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

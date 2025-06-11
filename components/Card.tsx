import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', onClick, titleClassName }) => {
  const cardClasses = `bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-slate-200/80 ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {title && <h3 className={`text-lg font-semibold text-primary mb-4 ${titleClassName}`}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
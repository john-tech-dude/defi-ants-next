import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'beta' | 'coming-soon' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    beta: 'bg-yellow-100 text-yellow-800',
    'coming-soon': 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'} ${className}`}
    >
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
};

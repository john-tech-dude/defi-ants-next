import React from 'react';

interface RiskMeterProps {
  risk: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  className?: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ risk, className = '' }) => {
  const getRiskLevel = (riskLevel: string) => {
    const levels: Record<string, number> = { 
      'Very Low': 20, 
      'Low': 35, 
      'Medium': 50, 
      'High': 75, 
      'Very High': 90 
    };
    return levels[riskLevel] || 50;
  };

  const getRiskColor = (riskLevel: string) => {
    if (riskLevel === 'Very Low' || riskLevel === 'Low') return 'bg-green-500';
    if (riskLevel === 'Medium') return 'bg-yellow-500';
    if (riskLevel === 'High') return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getRiskColor(risk)} transition-all duration-500`}
          style={{ width: `${getRiskLevel(risk)}%` }}
        />
      </div>
      <span className="text-xs font-bold">{risk}</span>
    </div>
  );
};

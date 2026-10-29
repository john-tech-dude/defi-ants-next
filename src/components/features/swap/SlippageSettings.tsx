import Button from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export interface SlippageSettingsProps {
  slippage: number;
  onSlippageChange: (value: number) => void;
  className?: string;
}

export function SlippageSettings({
  slippage,
  onSlippageChange,
  className,
}: SlippageSettingsProps) {
  const PRESETS = [0.1, 0.5, 1];
  const [customInput, setCustomInput] = useState<string>('');
  const [warning, setWarning] = useState<string | null>(null);

  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (numValue < 0.1) {
        setWarning('Your transaction may fail due to low slippage tolerance');
      } else if (numValue > 5) {
        setWarning('Your transaction may be frontrun due to high slippage tolerance');
      } else {
        setWarning(null);
      }
      
      onSlippageChange(numValue);
    }
  };

  const handlePresetClick = (value: number) => {
    setCustomInput('');
    setWarning(null);
    onSlippageChange(value);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Slippage Tolerance</span>
      </div>
      
      <div className="flex space-x-2">
        {PRESETS.map((value) => (
          <Button
            key={value}
            type="button"
            variant={slippage === value && !customInput ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => handlePresetClick(value)}
          >
            {value}%
          </Button>
        ))}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Custom"
            value={customInput}
            onChange={(e) => handleCustomInputChange(e.target.value)}
            className="pr-6"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </div>

      {warning && (
        <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-50 text-yellow-800 text-xs">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Your transaction will revert if the price changes unfavorably by more than this percentage.
      </div>
    </div>
  );
}

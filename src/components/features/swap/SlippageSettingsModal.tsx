"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from "@/components/ui/button";
import Input from '@/components/ui/input';
import Slider from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SlippageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: number;
  onSlippageChange: (value: number) => void;
}

export function SlippageSettingsModal({ 
  isOpen, 
  onClose, 
  slippage, 
  onSlippageChange 
}: SlippageSettingsModalProps) {
  const [localSlippage, setLocalSlippage] = useState(slippage.toString());
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    setLocalSlippage(slippage.toString());
  }, [slippage]);

  const handleSave = () => {
    const numValue = parseFloat(localSlippage);
    if (!isNaN(numValue) && numValue >= 0.1 && numValue <= 50) {
      onSlippageChange(numValue);
      onClose();
    }
  };

  const handlePresetClick = (value: number) => {
    setLocalSlippage(value.toString());
    setIsCustom(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow numbers, decimal point, and empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLocalSlippage(value);
      setIsCustom(true);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setLocalSlippage(value[0].toString());
    setIsCustom(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Transaction Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Slippage tolerance</h4>
            <div className="flex space-x-2 mb-4">
              {[0.1, 0.5, 1.0].map((value) => (
                <button
                  key={value}
                  onClick={() => handlePresetClick(value)}
                  className={cn(
                    'flex-1 py-2 px-3 text-sm rounded-lg transition-colors',
                    !isCustom && parseFloat(localSlippage) === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  )}
                >
                  {value}%
                </button>
              ))}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={localSlippage}
                  onChange={handleInputChange}
                  onFocus={() => setIsCustom(true)}
                  className={cn(
                    'w-full h-full py-2 px-3 text-sm rounded-lg bg-gray-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500',
                    isCustom ? 'text-white' : 'text-gray-400'
                  )}
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
            </div>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={[parseFloat(localSlippage) || 0.1]}
              onValueChange={handleSliderChange}
              className="w-full"
            />
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-4">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  isNaN(parseFloat(localSlippage)) ||
                  parseFloat(localSlippage) < 0.1 ||
                  parseFloat(localSlippage) > 50
                }
                className="px-6"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

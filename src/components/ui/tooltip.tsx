import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: 'default' | 'premium' | 'glass';
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, variant = 'default', ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'premium':
        return 'border border-border-highlight bg-gray-900/95 backdrop-blur-md text-white shadow-xl';
      case 'glass':
        return 'bg-gray-900/70 backdrop-blur-xl border border-white/10 text-white shadow-xl';
      default:
        return 'border bg-popover text-popover-foreground shadow-md';
    }
  };

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-lg px-4 py-2.5 text-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        getVariantClasses(),
        className
      )}
      {...props}
    />
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
export type { TooltipContentProps };

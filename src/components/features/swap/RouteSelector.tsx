import { ArrowRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Route } from '@/types/swap';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export interface RouteSelectorProps {
  routes: Route[];
  selectedRouteIndex: number;
  onSelectRoute: (index: number) => void;
  className?: string;
}

export function RouteSelector({
  routes,
  selectedRouteIndex,
  onSelectRoute,
  className,
}: RouteSelectorProps) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Routes</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-[250px]">
                Multiple routes may be available for your swap. Each route may have different price impact and output amounts.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {routes.map((route, index) => (
          <button
            key={route.id || index}
            className={cn(
              'w-full text-left p-3 rounded-lg border border-border/50 transition-colors',
              selectedRouteIndex === index
                ? 'bg-primary/10 border-primary/50'
                : 'hover:bg-muted/30'
            )}
            onClick={() => onSelectRoute(index)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-medium">Route {index + 1}</span>
                <span className="text-muted-foreground">
                  ({route.marketInfos.length} hop{route.marketInfos.length > 1 ? 's' : ''})
                </span>
              </div>
              <div className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                index === 0 ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
              )}>
                {index === 0 ? 'Best' : 'Alternative'}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs mb-2">
              {route.marketInfos.map((info, i) => (
                <div key={i} className="flex items-center">
                  <span>{info.label || 'AMM'}</span>
                  {i < route.marketInfos.length - 1 && (
                    <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Output</span>
              <span className="font-medium">{parseFloat(route.outAmount).toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Price Impact</span>
              <span className={cn(
                'font-medium',
                Number(route.priceImpactPct) > 3 
                  ? 'text-red-500' 
                  : Number(route.priceImpactPct) > 1 
                    ? 'text-yellow-500' 
                    : 'text-green-500'
              )}>
                {Number(route.priceImpactPct).toFixed(2)}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

// Types
interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  variant?: 'default' | 'premium' | 'glass';
}

interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  variant?: 'default' | 'premium' | 'glass';
}

interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  variant?: 'default' | 'premium' | 'glass';
}

interface TabsContentProps extends React.ComponentProps<typeof TabsPrimitive.Content> {
  variant?: 'default' | 'premium' | 'glass';
}

// Tabs Component
export const Tabs = TabsPrimitive.Root;

// TabsList Component
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'premium':
        return 'bg-gray-900/50 backdrop-blur-md border border-border-highlight p-1 shadow-lg';
      case 'glass':
        return 'bg-gray-900/30 backdrop-blur-xl border border-white/10 p-1 shadow-lg';
      default:
        return 'bg-muted p-1';
    }
  };

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-lg text-muted-foreground',
        getVariantClasses(),
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = 'Tabs.List';

// TabsTrigger Component
export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = 'default', ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'premium':
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500/20 data-[state=active]:to-secondary-500/20 data-[state=active]:text-white data-[state=active]:shadow-lg';
      case 'glass':
        return 'data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:backdrop-blur-lg data-[state=active]:shadow-lg';
      default:
        return 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow';
    }
  };

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        getVariantClasses(),
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'Tabs.Trigger';

// TabsContent Component
export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant = 'default', ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getVariantClasses = () => {
    switch (variant) {
      case 'premium':
        return 'bg-gray-900/50 backdrop-blur-md border border-border-highlight p-6 rounded-lg shadow-xl mt-2';
      case 'glass':
        return 'bg-gray-900/30 backdrop-blur-xl border border-white/10 p-6 rounded-lg shadow-xl mt-2';
      default:
        return 'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
    }
  };

  // Don't render content during SSR to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'focus-visible:outline-none',
        getVariantClasses(),
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = 'Tabs.Content';

// Export all components as a namespace
export const TabsNamespace = {
  Root: Tabs,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};

export default TabsNamespace;

'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'premium' | 'glass';

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: Variant;
}

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: Variant;
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: Variant;
}

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  variant?: Variant;
}

// Helper functions for variant classes
const getListVariantClasses = (variant: Variant) => {
  switch (variant) {
    case 'premium':
      return 'bg-gray-900/50 backdrop-blur-md border border-border-highlight p-1 shadow-lg';
    case 'glass':
      return 'bg-gray-900/30 backdrop-blur-xl border border-white/10 p-1 shadow-lg';
    default:
      return 'bg-muted p-1';
  }
};

const getTriggerVariantClasses = (variant: Variant) => {
  switch (variant) {
    case 'premium':
      return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500/20 data-[state=active]:to-secondary-500/20 data-[state=active]:text-white data-[state=active]:shadow-lg';
    case 'glass':
      return 'data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:backdrop-blur-lg data-[state=active]:shadow-lg';
    default:
      return 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow';
  }
};

const getContentVariantClasses = (variant: Variant) => {
  switch (variant) {
    case 'premium':
      return 'bg-gray-900/50 backdrop-blur-md border border-border-highlight p-6 rounded-lg shadow-xl mt-2';
    case 'glass':
      return 'bg-gray-900/30 backdrop-blur-xl border border-white/10 p-6 rounded-lg shadow-xl mt-2';
    default:
      return 'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  }
};

// Tabs Component
const Tabs = TabsPrimitive.Root;

// TabsList Component
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <div className={cn('inline-flex h-12 items-center justify-center rounded-lg', className)} />;
    }

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          'inline-flex h-12 items-center justify-center rounded-lg text-muted-foreground',
          getListVariantClasses(variant),
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = 'TabsList';

// TabsTrigger Component
const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <button className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium', className)} />;
    }

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          getTriggerVariantClasses(variant),
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

// TabsContent Component
const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <div className={cn('focus-visible:outline-none', className)} style={{ display: 'none' }} />;
    }

    return (
      <TabsPrimitive.Content
        ref={ref}
        className={cn(
          'focus-visible:outline-none',
          getContentVariantClasses(variant),
          className
        )}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps };

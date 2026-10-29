'use client';

import { useState, useEffect, ComponentType, ReactNode } from 'react';
import { Tabs as TabsPrimitive } from './tabs';

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
};

export function ClientOnlyTabs({ children, ...props }: TabsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a simple div with the same className during SSR
    return <div className={props.className} style={{ visibility: 'hidden' }} />;
  }

  return <TabsPrimitive {...props}>{children}</TabsPrimitive>;
}

// Re-export all Tabs components with client-side only rendering
export const Tabs = ClientOnlyTabs as typeof TabsPrimitive & {
  List: typeof TabsPrimitive.List;
  Trigger: typeof TabsPrimitive.Trigger;
  Content: typeof TabsPrimitive.Content;
};

// Assign static properties
Tabs.List = TabsPrimitive.List;
Tabs.Trigger = TabsPrimitive.Trigger;
Tabs.Content = TabsPrimitive.Content;

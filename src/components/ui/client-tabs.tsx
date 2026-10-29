'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Import the Tabs components with dynamic imports and no SSR
const TabsRoot = dynamic(
  () => import('@radix-ui/react-tabs').then((mod) => mod.Root),
  { ssr: false }
);

const TabsList = dynamic(
  () => import('@radix-ui/react-tabs').then((mod) => mod.List),
  { ssr: false }
);

const TabsTrigger = dynamic(
  () => import('@radix-ui/react-tabs').then((mod) => mod.Trigger),
  { ssr: false }
);

const TabsContent = dynamic(
  () => import('@radix-ui/react-tabs').then((mod) => mod.Content),
  { ssr: false }
);

interface ClientTabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'glass';
}

export function ClientTabs({ children, ...props }: ClientTabsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a simple div with the same className during SSR and initial render
    return <div className={props.className} style={{ visibility: 'hidden' }} />;
  }

  return (
    <TabsRoot {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        // Clone the child element with the correct component type
        if (child.type === 'TabsList' || child.type?.displayName === 'Tabs.List') {
          return <TabsList {...child.props} />;
        }
        if (child.type === 'TabsTrigger' || child.type?.displayName === 'Tabs.Trigger') {
          return <TabsTrigger {...child.props} />;
        }
        if (child.type === 'TabsContent' || child.type?.displayName === 'Tabs.Content') {
          return <TabsContent {...child.props} />;
        }
        return child;
      })}
    </TabsRoot>
  );
}

// Create a namespace for the Tabs components
const TabsNamespace = Object.assign(ClientTabs, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export const Tabs = TabsNamespace;
export default Tabs;

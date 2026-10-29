'use client';

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import type { ToastT } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

// Create a wrapper around sonner's toast with our custom styling
const createToast = (type: ToastType) => (title: string, description?: string, duration = 5000) => {
  return sonnerToast[type](description ? (
    <div className="flex flex-col">
      <span className="font-medium">{title}</span>
      <span className="text-sm opacity-80">{description}</span>
    </div>
  ) : title, {
    duration,
    icon: {
      success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      error: <XCircle className="w-5 h-5 text-red-500" />,
      info: <Info className="w-5 h-5 text-blue-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    }[type],
  });
};

// Export the toast function with type-specific methods
export const toast = {
  ...sonnerToast,
  success: createToast('success'),
  error: createToast('error'),
  info: createToast('info'),
  warning: createToast('warning'),
};

// Export the Toaster component
export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      toastOptions={{
        className: 'toast',
        unstyled: true,
        classNames: {
          toast: 'bg-card text-card-foreground border rounded-lg shadow-lg p-4',
          title: 'font-medium',
          description: 'text-sm opacity-80',
        },
      }}
    />
  );
}

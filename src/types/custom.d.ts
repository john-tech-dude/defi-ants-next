// This file helps TypeScript understand the @/ path alias
declare module '@/components/ui/button' {
  import { ComponentType } from 'react';
  import { ButtonProps } from '@/components/ui/button';
  const Button: ComponentType<ButtonProps>;
  export default Button;
}

declare module '@/components/ui/input' {
  import { ComponentType, InputHTMLAttributes } from 'react';
  const Input: ComponentType<InputHTMLAttributes<HTMLInputElement>>;
  export default Input;
}

declare module '@/components/ui/label' {
  import { ComponentType, LabelHTMLAttributes } from 'react';
  const Label: ComponentType<LabelHTMLAttributes<HTMLLabelElement>>;
  export default Label;
}

declare module '@/components/ui/tabs' {
  import { ComponentType } from 'react';
  export const Tabs: ComponentType<any>;
  export const TabsList: ComponentType<any>;
  export const TabsTrigger: ComponentType<any>;
  export const TabsContent: ComponentType<any>;
}

declare module '@/components/ui/card' {
  import { ComponentType } from 'react';
  export const Card: ComponentType<any>;
  export const CardHeader: ComponentType<any>;
  export const CardTitle: ComponentType<any>;
  export const CardDescription: ComponentType<any>;
  export const CardContent: ComponentType<any>;
  export const CardFooter: ComponentType<any>;
}

declare module '@/components/ui/progress' {
  import { ComponentType } from 'react';
  interface ProgressProps {
    value?: number;
    className?: string;
  }
  const Progress: ComponentType<ProgressProps>;
  export default Progress;
}

declare module '@/components/ui/slider' {
  import { ComponentType } from 'react';
  interface SliderProps {
    value?: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
  }
  const Slider: ComponentType<SliderProps>;
  export default Slider;
}

declare module '@/components/ui/skeleton' {
  import { ComponentType } from 'react';
  interface SkeletonProps {
    className?: string;
  }
  const Skeleton: ComponentType<SkeletonProps>;
  export default Skeleton;
}

declare module '@/components/ui/tooltip' {
  import { ComponentType } from 'react';
  export const Tooltip: ComponentType<any>;
  export const TooltipTrigger: ComponentType<any>;
  export const TooltipContent: ComponentType<any>;
  export const TooltipProvider: ComponentType<any>;
}

declare module '@/components/ui/use-toast' {
  interface Toast {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
  }
  
  interface ToastReturnType {
    toast: (props: Toast) => void;
  }
  
  const useToast: () => ToastReturnType;
  export default useToast;
}

declare module '@/lib/utils' {
  export function cn(...inputs: any[]): string;
}

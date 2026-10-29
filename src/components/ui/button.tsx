'use client';

import { ReactNode, forwardRef, Ref, ComponentProps } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import Link, { LinkProps } from 'next/link';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'default';

// Button sizes
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

// Base button props that apply to both button and link variants
type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  asChild?: boolean;
};

// Button props (when used as a button)
type ButtonProps = ButtonBaseProps &
  Omit<HTMLMotionProps<'button'>, keyof ButtonBaseProps> & {
    href?: undefined;
    type?: 'button' | 'submit' | 'reset';
  };

// Link button props (when used as a link)
type LinkButtonProps = ButtonBaseProps &
  Omit<LinkProps, 'href' | 'onClick' | 'onMouseEnter' | 'onTouchStart'> & {
    href: string;
    target?: string;
    rel?: string;
  };

// Button component with support for both button and link variants
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | LinkButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      disabled = false,
      isLoading = false,
      asChild = false,
      ...rest
    },
    ref
  ) => {
    // Enhanced base styles with smooth transitions and focus states
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';

    // Enhanced variant styles with modern gradients and hover effects
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary hover:to-primary/80 shadow-lg hover:shadow-primary/20 dark:shadow-primary/20',
      secondary: 'bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary hover:to-secondary/80 shadow-md hover:shadow-secondary/20 dark:shadow-secondary/20',
      outline: 'border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent/20 hover:text-accent-foreground hover:border-accent/50 transition-all',
      ghost: 'hover:bg-accent/10 hover:text-accent-foreground hover:shadow-sm',
      default: 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-accent/10 hover:shadow-sm transition-all',
    };

    // Enhanced size styles with better proportions
    const sizes: Record<ButtonSize, string> = {
      sm: 'h-9 px-3.5 text-xs font-medium tracking-wide',
      md: 'h-10 px-5 py-2.5 text-sm font-medium tracking-wide',
      lg: 'h-12 px-8 py-3 text-base font-medium tracking-wide',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    // Combine all styles
    const buttonClasses = [
      baseStyles,
      variants[variant || 'default'],
      sizes[size || 'md'],
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ');

    // Loading state styles
    const loadingStyles = isLoading ? 'opacity-70 cursor-not-allowed' : '';

    // Enhanced animation variants with smoother transitions
    const buttonVariants = {
      hover: {
        scale: disabled ? 1 : 1.02,
        y: -1,
        transition: { duration: 0.15, ease: 'easeOut' },
      },
      tap: {
        scale: disabled ? 1 : 0.98,
        transition: { duration: 0.1, ease: 'easeIn' },
      },
    };

    // Shine effect animation
    const ShineEffect = () => (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-lg"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 3,
        }}
      >
        <motion.div
          className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-12"
          animate={{
            left: ['0%', '150%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: 3.5,
          }}
        />
      </motion.div>
    );

    // Render loading spinner if loading
    const renderLoading = () => (
      <span className="inline-flex items-center">
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </span>
    );

    // Content with icon and loading state
    const content = (
      <span className={`inline-flex items-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </span>
    );

    // Common props for both button and link
    const commonClassName = `${buttonClasses} ${loadingStyles} relative`;
    const commonAriaDisabled = disabled || isLoading;
    const commonDataLoading = isLoading;

    // If href is provided, render a link
    if ('href' in rest) {
      // Extract Next.js Link specific props
      const { 
        href, 
        as, 
        replace, 
        scroll, 
        shallow, 
        prefetch, 
        locale, 
        target, 
        rel, 
        ...linkProps 
      } = rest as LinkButtonProps;

      return (
        <motion.div
          className={`inline-block ${fullWidth ? 'w-full' : ''}`}
          whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
          whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Link
            href={href} // href is required in LinkButtonProps
            as={as}
            replace={replace}
            scroll={scroll}
            shallow={shallow}
            prefetch={prefetch}
            locale={locale}
            target={target}
            rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
            className={commonClassName}
            aria-disabled={commonAriaDisabled}
            data-loading={commonDataLoading}
            {...linkProps}
            ref={ref as Ref<HTMLAnchorElement>}
          >
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                {renderLoading()}
              </span>
            )}
            {content}
          </Link>
        </motion.div>
      );
    }

    // Otherwise render a button
    const { type = 'button', ...buttonProps } = rest as ButtonProps;

    return (
      <motion.button
        type={type}
        disabled={disabled || isLoading}
        className={commonClassName}
        aria-disabled={commonAriaDisabled}
        data-loading={commonDataLoading}
        {...buttonProps}
        ref={ref as Ref<HTMLButtonElement>}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            {renderLoading()}
          </span>
        )}
        {content}
      </motion.button>
    );
  }
);

// Set display name for debugging
Button.displayName = 'Button';

export default Button;

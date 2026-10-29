// Import Sentry with proper type imports
import * as Sentry from '@sentry/nextjs';

// Only import browserTracingIntegration in browser environment
let browserTracingIntegration: any = () => ({});
let replayIntegration: any = () => ({});

if (typeof window !== 'undefined') {
  try {
    const sentry = require('@sentry/nextjs');
    browserTracingIntegration = sentry.browserTracingIntegration || (() => ({}));
    replayIntegration = sentry.replayIntegration || (() => ({}));
  } catch (error) {
    console.warn('Failed to load Sentry integrations:', error);
  }
}

type ErrorContext = Record<string, unknown> & {
  componentStack?: string;
  userId?: string;
  walletAddress?: string;
};

class ErrorReporter {
  private static instance: ErrorReporter;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  public initialize() {
    // Skip initialization if already done or not in browser
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Skip if Sentry DSN is not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      console.warn('Sentry DSN not configured. Error reporting disabled.');
      return;
    }

    try {
      const integrations = [];
      
      // Only add browser tracing in production
      if (process.env.NODE_ENV === 'production') {
        try {
          integrations.push(
            browserTracingIntegration(),
            replayIntegration({
              maskAllText: false,
              blockAllMedia: false,
            })
          );
        } catch (error) {
          console.warn('Failed to initialize Sentry integrations:', error);
        }
      }

      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
        // Only enable tracing in production
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
        // Disable session replay in development
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
        integrations,
      });

      this.isInitialized = true;
      console.log('[ErrorReporting] Initialized');
    } catch (error) {
      console.error('[ErrorReporting] Failed to initialize:', error);
    }
  }

  public captureError(
    error: Error,
    context: ErrorContext = {},
  ) {
    if (!this.isInitialized) return;

    // Set user context if available
    if (context.userId || context.walletAddress) {
      Sentry.setUser({
        id: context.userId ? String(context.userId) : undefined,
        walletAddress: context.walletAddress
      });
    }

    // Set tags and extras
    const { userId, walletAddress, ...extras } = context;
    if (walletAddress) {
      Sentry.setTag('wallet', walletAddress);
    }

    // Capture the exception with context
    Sentry.captureException(error, {
      contexts: {
        extra: extras
      }
    });
  }

  public setUser(user: { id?: string | number; walletAddress?: string }) {
    if (this.isInitialized) {
      Sentry.setUser({
        id: user.id ? String(user.id) : undefined,
        walletAddress: user.walletAddress
      });
      
      if (user.walletAddress) {
        Sentry.setTag('wallet', user.walletAddress);
      }
    }
  }

  public clearUser() {
    if (this.isInitialized) {
      Sentry.setUser(null);
    }
  }

  private shouldFilterError(event: Sentry.Event): boolean {
    const ignoredErrors = [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Failed to execute \'observe\' on \'ResizeObserver\': [object Element] has no size',
    ];

    if (event.message) {
      return ignoredErrors.some(error => event.message?.includes(error));
    }

    return false;
  }
}

const errorReporter = ErrorReporter.getInstance();
export default errorReporter;

export const reportError = (
  error: Error | string,
  context: ErrorContext = {}
) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  errorReporter.captureError(errorObj, context);};

export const setErrorUser = (user: { id?: string | number; walletAddress?: string }) => {
  errorReporter.setUser(user);
};

export const clearErrorUser = () => {
  errorReporter.clearUser();
};

if (typeof window !== 'undefined') {
  errorReporter.initialize();
}

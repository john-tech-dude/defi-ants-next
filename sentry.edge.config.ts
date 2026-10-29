import * as Sentry from '@sentry/nextjs';
import { envVars } from './src/env';

// Only run Sentry in production
if (!envVars.NEXT_PUBLIC_SENTRY_DSN && envVars.NODE_ENV === 'production') {
  console.warn('Sentry DSN not configured. Skipping Sentry edge initialization.');
}

Sentry.init({
  dsn: envVars.NEXT_PUBLIC_SENTRY_DSN,
  environment: envVars.NODE_ENV,
  tracesSampleRate: 0.2,
});

import * as Sentry from '@sentry/nextjs';
import { Replay } from '@sentry/replay';
import { envVars } from './src/env';

// Only run Sentry in production
if (!envVars.NEXT_PUBLIC_SENTRY_DSN && envVars.NODE_ENV === 'production') {
  console.warn('Sentry DSN not configured. Skipping Sentry initialization.');
}

Sentry.init({
  dsn: envVars.NEXT_PUBLIC_SENTRY_DSN,
  environment: envVars.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [new Replay({ maskAllText: false, blockAllMedia: false })],
  beforeSend(event) {
    // Filter out common browser extension errors
    if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) {
      return null;
    }
    return event;
  },
});

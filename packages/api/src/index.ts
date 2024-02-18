import cors from 'cors';
import express, { NextFunction, Response } from 'express';
import { auth, requiresAuth } from 'express-openid-connect';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

import { Workspace } from 'types';

const app = express();
const port = 8080;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:8080',
  clientID: '4RoNjVjB6mhLZ18PmgwbQiBjjhqEW2tD',
  issuerBaseURL: 'https://dev-h2fombj9.auth0.com',
};

Sentry.init({
  dsn: 'https://bf4b55de16d1bfed6fef12122d2b1e2d@o4506703072460800.ingest.sentry.io/4506765346406400',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(auth(config));

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/workspaces', (_, response) => {
  const workspaces: Workspace[] = [
    { name: 'api', version: '1.0.0' },
    { name: 'types', version: '1.0.0' },
    { name: 'web', version: '1.0.0' },
  ];
  response.json({ data: workspaces });
});

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
app.get('/error', (req, res) => {
  throw new Error('test error');
});
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// // Optional fallthrough error handler
// app.use(function onError(_1: Error, _2: Request, res: any, next: NextFunction) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + '\n');
// });

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

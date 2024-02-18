const { sentryEsbuildPlugin } = require('@sentry/esbuild-plugin');

require('esbuild').build({
  sourcemap: true, // Source map generation must be turned on
  plugins: [
    // Put the Sentry esbuild plugin after all other plugins
    sentryEsbuildPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'home-cp5',
      project: 'interview-signals',
    }),
  ],
});

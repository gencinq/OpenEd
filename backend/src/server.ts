import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`===============================================`);
  console.log(`  OpenEd MVP backend running on port: ${env.PORT}  `);
  console.log(`  Environment: ${env.NODE_ENV}                `);
  console.log(`  Frontend Origin allowed: ${env.FRONTEND_URL}  `);
  console.log(`===============================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server shut down successfully.');
  });
});

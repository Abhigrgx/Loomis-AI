import { buildApp } from './app.js';
import { connectDb } from './config/db.js';
import { env, validateEnv } from './config/env.js';

async function start() {
  validateEnv();
  await connectDb();

  const app = buildApp();

  app.listen(env.port, () => {
    console.log(`Loomis AI backend listening on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

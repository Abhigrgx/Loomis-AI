/* eslint-disable no-console */

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:8080/api/v1';
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_REQUEST_TIMEOUT_MS || 10000);
const HEALTH_RETRIES = Number(process.env.SMOKE_HEALTH_RETRIES || 20);
const HEALTH_RETRY_DELAY_MS = Number(process.env.SMOKE_HEALTH_RETRY_DELAY_MS || 1000);
const REQUIRE_REAL_OPENAI = process.env.SMOKE_REQUIRE_REAL_OPENAI === 'true';

function fail(message, details) {
  console.error(`SMOKE TEST FAILED: ${message}`);
  if (details !== undefined) {
    console.error(JSON.stringify(details, null, 2));
  }
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const raw = await response.text();
    let body = {};

    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        body = { raw };
      }
    }

    return { response, body };
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForHealth() {
  for (let i = 1; i <= HEALTH_RETRIES; i += 1) {
    try {
      const { response, body } = await request('/health');
      if (response.ok && body.status === 'ok') {
        console.log(`Health check passed on attempt ${i}.`);
        return;
      }
    } catch {
      // Keep retrying until retries are exhausted.
    }

    if (i < HEALTH_RETRIES) {
      await sleep(HEALTH_RETRY_DELAY_MS);
    }
  }

  fail(`Health endpoint did not become ready after ${HEALTH_RETRIES} retries.`);
}

function assert(condition, message, details) {
  if (!condition) {
    fail(message, details);
  }
}

async function main() {
  console.log(`Running Loomis API smoke test against ${BASE_URL}`);
  if (REQUIRE_REAL_OPENAI) {
    console.log('Strict mode enabled: real OpenAI response is required.');
  }

  await waitForHealth();

  const unique = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const email = `smoke_${unique}@example.com`;
  const password = 'StrongPass123';
  const name = 'Smoke Tester';

  const registerResult = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name })
  });

  assert(registerResult.response.status === 201, 'Register request did not return 201.', registerResult.body);
  assert(typeof registerResult.body.token === 'string' && registerResult.body.token.length > 0, 'Register response missing token.', registerResult.body);
  assert(typeof registerResult.body.user?.id === 'string', 'Register response missing user.id.', registerResult.body);

  const loginResult = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  assert(loginResult.response.ok, 'Login request failed.', loginResult.body);
  assert(typeof loginResult.body.token === 'string' && loginResult.body.token.length > 0, 'Login response missing token.', loginResult.body);
  assert(loginResult.body.user?.email === email, 'Login response has unexpected user email.', loginResult.body);

  const token = loginResult.body.token;
  const chatResult = await request('/chat', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      prompt: 'Reply with one concise sentence about why smoke tests matter.',
      mode: 'chat'
    })
  });

  assert(chatResult.response.status === 201, 'Chat request did not return 201.', chatResult.body);
  assert(typeof chatResult.body.conversation?.id === 'string', 'Chat response missing conversation.id.', chatResult.body);
  assert(typeof chatResult.body.requestMessage?.id === 'string', 'Chat response missing requestMessage.id.', chatResult.body);
  assert(chatResult.body.requestMessage?.role === 'user', 'Chat response requestMessage.role should be user.', chatResult.body);
  assert(typeof chatResult.body.responseMessage?.id === 'string', 'Chat response missing responseMessage.id.', chatResult.body);
  assert(chatResult.body.responseMessage?.role === 'assistant', 'Chat response responseMessage.role should be assistant.', chatResult.body);
  assert(typeof chatResult.body.responseMessage?.content === 'string' && chatResult.body.responseMessage.content.length > 0, 'Chat response missing assistant content.', chatResult.body);
  assert(typeof chatResult.body.output?.id === 'string', 'Chat response missing output.id.', chatResult.body);

  const model = chatResult.body.responseMessage?.metadata?.model;
  assert(typeof model === 'string' && model.length > 0, 'Chat response missing metadata.model.', chatResult.body);

  if (REQUIRE_REAL_OPENAI) {
    assert(
      model !== 'fallback-local',
      'Strict smoke mode requires a real OpenAI model, but fallback-local was returned.',
      chatResult.body
    );
  }

  console.log('SMOKE TEST PASSED');
}

main().catch((error) => {
  fail('Unexpected runtime error in smoke test.', { message: error.message });
});

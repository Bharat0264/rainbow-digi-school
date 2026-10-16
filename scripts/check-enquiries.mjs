// Synthetic test suite for Rainbow Digi School enquiries API.
// Validates Google Apps Script integration, input validation, origin protection,
// idempotency, email failure resilience, and error handling.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import {
  createHandler,
  enquirySchema,
  isAllowedOrigin,
  normalizeGoogleAppsScriptUrl,
  saveToGoogleAppsScript,
} from "../api/enquiries.ts";

const valid = {
  parentName: "Test Parent",
  phone: "9876543210",
  email: "parent@example.com",
  program: "Nursery",
  message: "Interested in admission for 2026-2027.",
  consent: true,
  website: "",
};

const previousOrigins = process.env.ALLOWED_ORIGINS;
const previousScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
const previousScriptSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

let writes = 0;
let checks = 0;

// Mock sender simulating Google Apps Script persistence
const mockSender = async (data) => {
  writes++;
  assert.equal(data.parentName, "Test Parent");
  assert.ok(
    /^RDS-ENQ-\d{4}-[A-F0-9]{10}$/.test(data.reference),
    "Reference format is valid",
  );
  return {
    enquiryNumber: data.reference,
    duplicate: false,
    emailSent: true,
  };
};

const defaultTestHandler = createHandler(mockSender);

async function request(
  body = valid,
  overrides = {},
  action = defaultTestHandler,
) {
  const result = { statusCode: 0, body: null, headers: {} };
  const response = {
    setHeader(name, value) {
      result.headers[name] = value;
    },
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    },
  };
  await action(
    {
      method: "POST",
      headers: {
        origin: "https://school.example",
        "content-type": "application/json",
      },
      body,
      ...overrides,
    },
    response,
  );
  checks++;
  return result;
}

try {
  process.env.ALLOWED_ORIGINS = "https://school.example";
  process.env.GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/MOCK_ID/exec";
  process.env.GOOGLE_APPS_SCRIPT_SECRET = "mock-secret-key-32-chars-length";

  // 1. Valid enquiry saved successfully (201 Created with valid reference)
  const successRes = await request();
  assert.equal(successRes.statusCode, 201);
  assert.ok(
    /^RDS-ENQ-\d{4}-[A-F0-9]{10}$/.test(successRes.body.enquiryNumber),
  );
  assert.equal(writes, 1);

  // 2-5. Validation rejections (422 Unprocessable Entity)
  const validationPatches = [
    { consent: false },
    { phone: "1234567890" }, // Invalid starting digit
    { phone: "9876" }, // Too short
    { program: "Grade 12" }, // Unsupported class
    { parentName: " " }, // Too short / empty
    { website: "bot" }, // Honeypot filled
    { message: "x".repeat(1001) }, // Message exceeds 1000 characters
    { email: "invalid-email" }, // Malformed email
  ];
  for (const patch of validationPatches) {
    const res = await request({ ...valid, ...patch });
    assert.equal(
      res.statusCode,
      422,
      `Expected 422 for patch: ${JSON.stringify(patch)}`,
    );
  }
  assert.equal(writes, 1, "Validation failures should not trigger writes");

  // 6. HTTP Method Not Allowed (405)
  assert.equal((await request(valid, { method: "GET" })).statusCode, 405);

  // 7. Disallowed Origin (403)
  assert.equal(
    (await request(valid, { headers: { origin: "https://other.example" } }))
      .statusCode,
    403,
  );

  // 8. Unsupported Content-Type (415)
  assert.equal(
    (
      await request(valid, {
        headers: {
          origin: "https://school.example",
          "content-type": "text/plain",
        },
      })
    ).statusCode,
    415,
  );

  // 9. Payload Too Large (413)
  assert.equal(
    (await request({ ...valid, message: "x".repeat(13000) })).statusCode,
    413,
  );

  // 10. Missing configuration handled safely (503)
  delete process.env.GOOGLE_APPS_SCRIPT_URL;
  assert.equal((await request()).statusCode, 503);

  process.env.GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/MOCK_ID/exec";
  delete process.env.GOOGLE_APPS_SCRIPT_SECRET;
  assert.equal((await request()).statusCode, 503);

  process.env.GOOGLE_APPS_SCRIPT_SECRET = "mock-secret-key-32-chars-length";

  // 11. Google Apps Script storage failure handled safely (503)
  const failingHandler = createHandler(async () => {
    throw new Error("APPS_SCRIPT_STORAGE_FAILED");
  });
  assert.equal((await request(valid, {}, failingHandler)).statusCode, 503);

  // 12. Google Apps Script timeout handled safely (504)
  const timeoutHandler = createHandler(async () => {
    throw new Error("APPS_SCRIPT_TIMEOUT");
  });
  assert.equal((await request(valid, {}, timeoutHandler)).statusCode, 504);

  // 13. Stored enquiry remains successful even if email notification fails
  const emailFailedHandler = createHandler(async (data) => {
    return {
      enquiryNumber: data.reference,
      duplicate: false,
      emailSent: false, // Email notification failed but storage succeeded
    };
  });
  const emailFailedRes = await request(valid, {}, emailFailedHandler);
  assert.equal(emailFailedRes.statusCode, 201);
  assert.ok(
    /^RDS-ENQ-\d{4}-[A-F0-9]{10}$/.test(emailFailedRes.body.enquiryNumber),
  );

  // 14. Idempotent duplicate reference handling
  const duplicateHandler = createHandler(async (data) => {
    return {
      enquiryNumber: data.reference,
      duplicate: true, // Recognized as already stored
      emailSent: false,
    };
  });
  const duplicateRes = await request(valid, {}, duplicateHandler);
  assert.equal(duplicateRes.statusCode, 201);
  assert.ok(
    /^RDS-ENQ-\d{4}-[A-F0-9]{10}$/.test(duplicateRes.body.enquiryNumber),
  );

  // 15. Origin check helper
  delete process.env.ALLOWED_ORIGINS;
  assert.equal(isAllowedOrigin("https://school.example"), false);
  assert.equal(isAllowedOrigin(undefined), false);

  // 16. Phone normalization (+91 with spaces)
  assert.equal(
    enquirySchema.safeParse({ ...valid, phone: "+91 98765 43210" }).success,
    true,
  );

  // 17. Google Apps Script URL normalization
  assert.equal(
    normalizeGoogleAppsScriptUrl("https://script.google.com/macros/s/AKfycb/exec"),
    "https://script.google.com/macros/s/AKfycb/exec",
  );
  assert.equal(
    normalizeGoogleAppsScriptUrl("https://script.google.com/macros/s/AKfycb/exec/"),
    "https://script.google.com/macros/s/AKfycb/exec",
  );
  assert.equal(
    normalizeGoogleAppsScriptUrl("https://script.google.com/macros/s/AKfycb"),
    "https://script.google.com/macros/s/AKfycb/exec",
  );
  checks++;

  // Synthetic HTTP server to verify Google Apps Script redirect behavior
  let serverHits = [];
  const testServer = createServer((req, res) => {
    serverHits.push({ method: req.method, url: req.url });
    if (req.url === "/macros/s/MOCK/exec" && req.method === "POST") {
      // Google Apps Script responds with 302 redirecting to echo server
      res.writeHead(302, {
        Location: `http://localhost:${testServer.address().port}/echo-result?user_content_key=token123`,
      });
      res.end();
    } else if (req.url.startsWith("/echo-result") && req.method === "GET") {
      // Echo server returns doPost result on GET
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          enquiryNumber: "RDS-ENQ-2026-TESTREF123",
          duplicate: false,
          emailSent: true,
        }),
      );
    } else if (req.url.startsWith("/health-fallback")) {
      // Simulate doGet fallback response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          service: "Rainbow Digi School Admissions Webhook",
          timestamp: new Date().toISOString(),
        }),
      );
    } else if (req.url === "/canonical/exec" && req.method === "POST") {
      // Simulate intermediate redirect within script.google.com preserving POST
      res.writeHead(302, {
        Location: `http://localhost:${testServer.address().port}/macros/s/MOCK/exec`,
      });
      res.end();
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise((resolve) => testServer.listen(0, resolve));
  const serverPort = testServer.address().port;

  try {
    // 18. saveToGoogleAppsScript successfully follows 302 to echo server and parses doPost result
    process.env.GOOGLE_APPS_SCRIPT_URL = `http://localhost:${serverPort}/macros/s/MOCK/exec`;
    process.env.GOOGLE_APPS_SCRIPT_SECRET = "test-secret-16-chars-long";

    const saved = await saveToGoogleAppsScript({
      reference: "RDS-ENQ-2026-TESTREF123",
      parentName: "Redirect Test Parent",
      phone: "9876543210",
      program: "Nursery",
      consent: true,
      submittedAt: new Date().toISOString(),
    });

    assert.equal(saved.enquiryNumber, "RDS-ENQ-2026-TESTREF123");
    assert.equal(saved.duplicate, false);
    assert.equal(saved.emailSent, true);
    // Verify POST was sent first, then GET was sent to echo endpoint
    assert.equal(serverHits[0].method, "POST");
    assert.equal(serverHits[1].method, "GET");
    checks++;

    // 19. saveToGoogleAppsScript rejects if doGet health response is returned
    process.env.GOOGLE_APPS_SCRIPT_URL = `http://localhost:${serverPort}/health-fallback`;
    await assert.rejects(
      async () => {
        await saveToGoogleAppsScript({
          reference: "RDS-ENQ-2026-TESTREF456",
          parentName: "DoGet Test Parent",
          phone: "9876543210",
          program: "Nursery",
          consent: true,
          submittedAt: new Date().toISOString(),
        });
      },
      (err) => {
        assert.equal(err.message, "APPS_SCRIPT_RECEIVED_DOGET_RESPONSE");
        return true;
      },
    );
    checks++;

    // 20. saveToGoogleAppsScript preserves POST method on intermediate redirects before echo
    process.env.GOOGLE_APPS_SCRIPT_URL = `http://localhost:${serverPort}/canonical/exec`;
    const savedViaCanonical = await saveToGoogleAppsScript({
      reference: "RDS-ENQ-2026-TESTREF123",
      parentName: "Canonical Redirect Parent",
      phone: "9876543210",
      program: "Nursery",
      consent: true,
      submittedAt: new Date().toISOString(),
    });
    assert.equal(savedViaCanonical.enquiryNumber, "RDS-ENQ-2026-TESTREF123");
    checks++;
  } finally {
    await new Promise((resolve) => testServer.close(resolve));
  }

  console.log(
    `✓ ${checks} enquiry scenarios passed successfully. Google Apps Script integration verified with mocks.`,
  );
} finally {
  if (previousOrigins === undefined) delete process.env.ALLOWED_ORIGINS;
  else process.env.ALLOWED_ORIGINS = previousOrigins;

  if (previousScriptUrl === undefined) delete process.env.GOOGLE_APPS_SCRIPT_URL;
  else process.env.GOOGLE_APPS_SCRIPT_URL = previousScriptUrl;

  if (previousScriptSecret === undefined)
    delete process.env.GOOGLE_APPS_SCRIPT_SECRET;
  else process.env.GOOGLE_APPS_SCRIPT_SECRET = previousScriptSecret;
}

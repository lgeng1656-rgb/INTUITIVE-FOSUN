import test from "node:test";
import assert from "node:assert/strict";
import { createWorker, parseByteRange } from "./index.js";

test("parses a bounded HTTP byte range", () => {
  assert.deepEqual(parseByteRange("bytes=100-299", 1000), {
    offset: 100,
    length: 200,
    start: 100,
    end: 299
  });
});

test("parses an open-ended HTTP byte range", () => {
  assert.deepEqual(parseByteRange("bytes=800-", 1000), {
    offset: 800,
    length: 200,
    start: 800,
    end: 999
  });
});

test("rejects an unsatisfiable HTTP byte range", () => {
  assert.equal(parseByteRange("bytes=1000-", 1000), null);
});

test("serves only the four configured video paths", async () => {
  const worker = createWorker();
  const env = {
    VIDEOS: {
      head: async () => null,
      get: async () => null
    },
    ASSETS: {
      fetch: async () => new Response("asset")
    }
  };

  const response = await worker.fetch(
    new Request("https://example.com/videos/not-allowed.mp4"),
    env
  );

  assert.equal(response.status, 404);
});

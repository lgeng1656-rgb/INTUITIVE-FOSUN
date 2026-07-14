const VIDEO_KEYS = new Map([
  ["/videos/planning.mp4", "planning.mp4"],
  ["/videos/navigation.mp4", "navigation.mp4"],
  ["/videos/review.mp4", "review.mp4"],
  ["/videos/analysis.mp4", "analysis.mp4"]
]);

export function parseByteRange(value, size) {
  const match = /^bytes=(\d+)-(\d*)$/.exec(value ?? "");
  if (!match) return null;

  const start = Number(match[1]);
  const requestedEnd = match[2] === "" ? size - 1 : Number(match[2]);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd)) return null;
  if (start < 0 || start >= size || requestedEnd < start) return null;

  const end = Math.min(requestedEnd, size - 1);
  return { offset: start, length: end - start + 1, start, end };
}

function videoHeaders(object, contentLength) {
  const headers = new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3600",
    "Content-Length": String(contentLength),
    "Content-Type": object.httpMetadata?.contentType || "video/mp4"
  });
  if (object.etag) headers.set("ETag", object.etag);
  return headers;
}

export function createWorker() {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const key = VIDEO_KEYS.get(url.pathname);

      if (!key) {
        if (url.pathname.startsWith("/videos/")) return new Response("Not found", { status: 404 });
        return env.ASSETS.fetch(request);
      }

      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "GET, HEAD" }
        });
      }

      const metadata = await env.VIDEOS.head(key);
      if (!metadata) return new Response("Not found", { status: 404 });

      const rangeValue = request.headers.get("Range");
      if (rangeValue) {
        const range = parseByteRange(rangeValue, metadata.size);
        if (!range) {
          return new Response(null, {
            status: 416,
            headers: { "Content-Range": `bytes */${metadata.size}` }
          });
        }

        const headers = videoHeaders(metadata, range.length);
        headers.set("Content-Range", `bytes ${range.start}-${range.end}/${metadata.size}`);
        if (request.method === "HEAD") return new Response(null, { status: 206, headers });

        const object = await env.VIDEOS.get(key, {
          range: { offset: range.offset, length: range.length }
        });
        if (!object?.body) return new Response("Not found", { status: 404 });
        return new Response(object.body, { status: 206, headers });
      }

      const headers = videoHeaders(metadata, metadata.size);
      if (request.method === "HEAD") return new Response(null, { status: 200, headers });

      const object = await env.VIDEOS.get(key);
      if (!object?.body) return new Response("Not found", { status: 404 });
      return new Response(object.body, { status: 200, headers });
    }
  };
}

export default createWorker();

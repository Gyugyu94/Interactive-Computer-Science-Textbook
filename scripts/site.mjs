import { createServer } from "node:http";
import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const source = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const mode = process.argv[2];
const contentTypes = new Map([
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
]);
const siteFiles = new Map([["index.html", "text/html; charset=utf-8"]]);
const entries = await readdir(new URL("src/", source), { recursive: true, withFileTypes: true });
for (const entry of entries) {
  const type = entry.isFile() && contentTypes.get(extname(entry.name));
  if (!type) continue;
  const file = relative(fileURLToPath(source), join(entry.parentPath, entry.name)).split(sep).join("/");
  siteFiles.set(file, type);
}

if (mode === "build") {
  for (const file of siteFiles.keys()) {
    const target = new URL(file, dist);
    await mkdir(dirname(fileURLToPath(target)), { recursive: true });
    await copyFile(new URL(file, source), target);
  }
  console.log("Built the static lesson in dist/.");
} else if (mode === "serve" || mode === "preview") {
  const root = mode === "preview" ? dist : source;
  const port = Number(process.env.PORT ?? 4173);
  const host = "127.0.0.1";

  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const file = pathname === "/" ? "index.html" : pathname.slice(1);
    const contentType = siteFiles.get(file);

    if (!contentType || !["GET", "HEAD"].includes(request.method)) {
      response.writeHead(404).end("Not found.");
      return;
    }

    try {
      const content = await readFile(new URL(file, root));
      response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch {
      response.writeHead(404).end("Not found.");
    }
  });

  server.listen(port, host, () => {
    console.log(`Lesson available at http://${host}:${server.address().port}`);
  });
} else {
  console.error("Usage: node scripts/site.mjs build|serve|preview");
  process.exitCode = 1;
}

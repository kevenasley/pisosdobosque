// Finaliza o build para hospedagem 100% estática (Cloudflare Pages).
// - Move dist/client/* para dist/
// - Remove dist/server (bundle usado apenas para o prerender)
// - Cria 404.html para rotas do client router
import { cp, rm, readdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const client = path.join(dist, "client");

if (existsSync(client)) {
  for (const entry of await readdir(client)) {
    await cp(path.join(client, entry), path.join(dist, entry), {
      recursive: true,
      force: true,
    });
  }
  await rm(client, { recursive: true, force: true });
}

await rm(path.join(dist, "server"), { recursive: true, force: true });
await rm(path.join(dist, "_worker.js"), { recursive: true, force: true });
await rm(path.join(dist, "_routes.json"), { force: true }).catch(() => {});

const index = path.join(dist, "index.html");
if (existsSync(index)) {
  await copyFile(index, path.join(dist, "404.html"));
}

const info = existsSync(index) ? await stat(index) : null;
console.log(
  `[static] dist pronto (apenas arquivos estáticos)${info ? ` — index.html ${Math.round(info.size / 1024)}kB` : ""}`,
);

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import type { TestProject } from 'vitest/node';

declare module 'vitest' {
  export interface ProvidedContext {
    pgliteDataDirFile: string;
  }
}

// Booting Postgres in WASM takes seconds, so do it once per run and let every test load the finished
// data dir instead. Built from db/init.sql so the tests also catch drift from the Drizzle schema.
export default async function setup(project: TestProject) {
  const workDir = mkdtempSync(path.join(os.tmpdir(), 'merpati-pglite-'));
  const seed = new PGlite();
  await seed.exec(readFileSync(path.resolve(__dirname, '../db/init.sql'), 'utf8'));
  const dataDir = await seed.dumpDataDir('none');
  await seed.close();

  const file = path.join(workDir, 'data-dir.tar');
  writeFileSync(file, Buffer.from(await dataDir.arrayBuffer()));
  project.provide('pgliteDataDirFile', file);

  return () => rmSync(workDir, { recursive: true, force: true });
}

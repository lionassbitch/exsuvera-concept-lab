import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function packageSites(root: string): Promise<void> {
  const outputDirectory = resolve(root, "dist", ".openai");
  const hostingConfig = resolve(root, ".openai", "hosting.json");
  const drizzleSource = resolve(root, "drizzle");

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  if (await exists(hostingConfig)) {
    await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
  }
  if (await exists(drizzleSource)) {
    await cp(drizzleSource, resolve(outputDirectory, "drizzle"), {
      recursive: true,
    });
  }
}

// closeBundle fires once per built environment (rsc and ssr build in parallel),
// so multiple invocations would otherwise race: one environment's `rm` of the
// shared output directory can delete it while another's `cp` is creating nested
// paths under it, which surfaces as an intermittent cold-start
// `ENOENT: ... mkdir '.../dist/.openai/drizzle/meta'`. Deduplicating by output
// directory (module-scoped so it holds even if Vite clones the plugin per
// environment) collapses the concurrent calls onto one in-flight run, and the
// entry is cleared afterward so a later, separate build still repackages.
const inflightPackaging = new Map<string, Promise<void>>();

// Packages Sites metadata and migrations after Vite finishes compiling.
export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");

      let job = inflightPackaging.get(outputDirectory);
      if (!job) {
        job = packageSites(root).finally(() => {
          inflightPackaging.delete(outputDirectory);
        });
        inflightPackaging.set(outputDirectory, job);
      }

      await job;
    },
  };
}

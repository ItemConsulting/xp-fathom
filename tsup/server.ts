import { globSync } from "glob";
import type { Options } from ".";
import { DIR_SRC } from "./constants";
import { dict } from "./dict";

export default function buildServerConfig(): Options {
  const GLOB_EXTENSIONS_SERVER = "{ts,js}";

  const FILES_SERVER = globSync(`${DIR_SRC}/**/*.${GLOB_EXTENSIONS_SERVER}`, {
    absolute: false,
    posix: true,
    // `ignore` takes patterns, matched against the results above — resolving them
    // with their own globSync calls would walk node_modules on every build.
    ignore: ["**/*.d.ts"],
  });

  const SERVER_JS_ENTRY = dict(
    FILES_SERVER.map((k) => [
      k.replace(`${DIR_SRC}/`, "").replace(/\.[^.]*$/, ""), // name
      k,
    ]),
  );

  return {
    bundle: true,
    dts: false, // d.ts files are use useless at runtime
    entry: SERVER_JS_ENTRY,
    env: {
      BROWSER_SYNC_PORT: "3100",
    },
    esbuildOptions(options) {
      // If you have libs with chunks, use this to avoid collisions
      options.chunkNames = "_chunks/[name]-[hash]";

      options.mainFields = ["module", "main"];
    },

    external: [/^\/lib\/xp\//],
    format: "cjs",
    minify: false, // Minifying server files makes debugging harder
    // noExternal: [],
    platform: "neutral",

    silent: ["QUIET", "WARN"].includes(process.env.LOG_LEVEL_FROM_GRADLE || ""),

    shims: false,
    splitting: false,
    sourcemap: false,
    target: "es5",
    tsconfig: `${DIR_SRC}/tsconfig.json`,
  };
}

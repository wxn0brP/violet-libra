import esbuild from "esbuild";
const dev = process.env.NODE_ENV === "development" || process.argv.includes("--dev");

esbuild.build({
    entryPoints: [
        "src/cms/index.ts",
        "src/page/index.ts",
    ],
    outdir: "dist",
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true,
    minify: !dev,
    treeShaking: true,
    splitting: true,
    keepNames: true,
    tsconfig: "tsconfig.json",
    logLevel: "info",
    loader: { ".ts": "ts" }
});
import esbuild from "esbuild";

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
    minify: false,
    treeShaking: true,
    splitting: false,
    keepNames: true,
    tsconfig: "tsconfig.json",
    logLevel: "info",
	loader: { ".ts": "ts" }
});
import esbuild from "esbuild";
import stylePlugin from "esbuild-style-plugin";
const dev = process.env.NODE_ENV === "development" || process.argv.includes("--dev");

esbuild.build({
    entryPoints: [
        "src/cms/index.ts",
        "src/page/*.ts",
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
    plugins: [
        stylePlugin({
            renderOptions: {
                sassOptions: {
                    silenceDeprecations: ["legacy-js-api"],
                    style: "compressed"
                }
            }
        })
    ],
    loader: { ".ts": "ts" }
});
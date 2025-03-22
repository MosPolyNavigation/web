// noinspection JSUnusedGlobalSymbols

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    root: "./",
    publicDir: "public",
    build: {
        outDir: "dist",
    },

    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
        modules: {
            generateScopedName: "[local]__[hash:base64:2]",
        },
        devSourcemap: true,
    },
    base: "/",
});

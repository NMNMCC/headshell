import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), preact()],
    define: {
        "process.env": {
            BASE_URL: process.env["BASE_URL"],
        },
    },
});

import { PluginOption, defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path';
import fs from 'fs';

const getDefinitionTemplate = (variable: string, content: string) => {
  return `export const ${variable} = ${content} as const;`;
}

const updateDefinitonFile = async ({ filePath, content }: { filePath: string, content?: string }) => {
  const fileContent = content || await fs.promises.readFile(filePath, 'utf-8');
  const fileName = filePath.endsWith("panel.json") ? "panel.ts" : "keybinds.ts";

  try {
    const json = JSON.parse(fileContent);
    const variableName = filePath.endsWith("panel.json") ? "panelDefinition" : "keybindDefinition";
    fs.writeFileSync(path.join(".", "src", "API", "contexts", fileName), getDefinitionTemplate(variableName, JSON.stringify(json, null, 2)));
  } catch (e) {
    console.error(`Updating ${fileName} failed:`);
    console.log(e);
  }
}

const settingsAndKeybindsPlugin = () => {
  return {
    name: 'settingsAndKeybinds',
    enforce: 'post',
    // HMR
    async handleHotUpdate({ file, read }) {
      if (file.endsWith('panel.json') || file.endsWith("keybinds.json")) {
        console.debug(`[vite][${path.basename(file)}] Rebuilding type definitions...`);
        const content = await read();

        await updateDefinitonFile({ filePath: file, content });
      }
    },
  } satisfies PluginOption
}
// https://vitejs.dev/config/

export default defineConfig(async ({ command, mode }) => {

  await updateDefinitonFile({ filePath: path.join(".", "public", "panel.json") });
  await updateDefinitonFile({ filePath: path.join(".", "public", "keybinds.json") });
  return (
    {
      plugins: [
        react(),
        svgr(),
        settingsAndKeybindsPlugin()
      ],
      build: {
        outDir: 'build'
      },
      resolve: {
        alias: {
          "readable-stream": "vite-compatible-readable-stream"
        }
      },
      base: mode === "development" ? '/dev/' : './',
      server: {
        open: "http://localhost:1349/development/",
        host: 'localhost',
        port: 3500,
      },
      optimizeDeps: {
        esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
            global: 'globalThis',
          },
        },
      },
    }
  )
})

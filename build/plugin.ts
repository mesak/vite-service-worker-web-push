import chokidar from 'chokidar';
import ts from 'typescript';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { ViteDevServer } from 'vite';
export interface VitePluginServiceWorkerOptions {
  sourceFile?: string;
  filename?: string;
}
export function vitePluginServiceWorker(options: VitePluginServiceWorkerOptions = {}) {
  const {
    sourceFile = 'src/sw.ts',
    filename = 'sw.js'
  } = options;

  let server: ViteDevServer;
  const sourceFilePath = resolve(process.cwd(), sourceFile);
  const useFilename = `${filename.substring(0, filename.lastIndexOf('.'))}.js`

  //get with outDir
  const outputFilePath = resolve(process.cwd(), 'dist', useFilename);
  // const outputFilePath = resolve(process.cwd(), useFilename);
  function generateSW() {
    const sourceCode = readFileSync(sourceFilePath, 'utf8');
    return compileTypeScript(sourceCode);
  }
  function compileTypeScript(source: string) {
    const result = ts.transpileModule(source, {
      compilerOptions: {
        removeComments: true,
        noUnusedLocals: true,
        noUnusedParameters: true,

        strict: true,
        allowJs: true,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true, // Define the ESNext property
      }
    });
    return result.outputText;
  }
  return {
    name: "vite-plugin-service-worker",
    configureServer(_server: ViteDevServer) {
      server = _server;
      // 監聽到 SW 檔案變更時，發送 reload 訊息給 client
      chokidar.watch(sourceFile).on('change', () => {
        server.ws.send({ type: 'full-reload' });
      });
      // 開發模式時，將 SW 檔案內容回傳給 client
      server.middlewares.use((req, res, next) => {
        if (req.url === `/${filename}`) {
          res.setHeader('Content-Type', 'application/javascript');
          res.end(generateSW());
        } else {
          next();
        }
      })
    },
    async writeBundle() {
      const swContent = generateSW();
      writeFileSync(outputFilePath, swContent);
    },
  }
}


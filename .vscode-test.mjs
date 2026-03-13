import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from '@vscode/test-cli';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  files: 'out/test/**/*.test.js',
  version: '1.108.0',
  extensionDevelopmentPath: __dirname,
  workspaceFolder: __dirname,
  mocha: {
    timeout: 10000,
  },
});

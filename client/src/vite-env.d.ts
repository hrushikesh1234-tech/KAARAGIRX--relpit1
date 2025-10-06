/// <reference types="vite/client" />

interface Window {
  process: {
    env: Record<string, string>;
  };
}

declare const process: {
  env: Record<string, string>;
  cwd: () => string;
};

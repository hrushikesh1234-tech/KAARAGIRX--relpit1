module.exports = {
  apps: [
    {
      name: "kaaragirx-app",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      node_args: "--experimental-specifier-resolution=node"
    }
  ]
};

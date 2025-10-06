# KARAGIRX-4 Deployment Guide

This guide provides step-by-step instructions for deploying the KARAGIRX-4 application to your Hostinger server.

## Prerequisites

- Node.js (v16+) installed on your server
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed and configured
- SSL certificates set up with Certbot

## Deployment Steps

### 1. Build the Application Locally

```bash
# Build the application
npm run build
```

### 2. Upload Files to Server

Upload the following files and directories to `/var/www/project/` on your server:

- `dist/` directory (contains both client and server built files)
- `package.json` and `package-lock.json`
- `ecosystem.config.cjs`
- `deploy.sh`
- Any other necessary assets (like profile images)

### 3. Deploy on Server

```bash
# Navigate to project directory
cd /var/www/project

# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The deployment script will:
- Stop any existing instances of the application
- Install production dependencies
- Start the application using PM2 with the correct configuration
- Save the PM2 configuration
- Restart Nginx

### 4. Verify Deployment

After deployment, verify that:

1. The application is running: `pm2 list`
2. The application is listening on port 3001: `curl http://localhost:3001`
3. The website is accessible: `https://kaaragirx.shop`

## Troubleshooting

If you encounter a 502 Bad Gateway error:

1. Check if the application is running: `pm2 list`
2. Check application logs: `pm2 logs kaaragirx-app`
3. Verify Nginx configuration: `sudo cat /etc/nginx/sites-available/kaaragirx.shop`
4. Check Nginx error logs: `sudo cat /var/log/nginx/error.log`

## Nginx Configuration

Your Nginx configuration should include:

```nginx
server {
    server_name kaaragirx.shop www.kaaragirx.shop;
    root /var/www/project/dist/public;

    # Server static assets directly
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
        try_files $uri =404;
    }

    # Proxy all other requests to Node.js application
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/kaaragirx.shop/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/kaaragirx.shop/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

## PM2 Configuration

The included `ecosystem.config.cjs` file configures PM2 to:

1. Run the application in production mode
2. Force the application to listen on port 3001
3. Use the correct Node.js flags for ES modules
4. Automatically restart the application if it crashes

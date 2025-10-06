# Deployment Guide for kaaragirx.shop on Ubuntu with Nginx

This guide will help you deploy your Node.js application to your Ubuntu server with Nginx as a reverse proxy, using your domain name kaaragirx.shop.

## Local Preparation

1. **Build the application locally**:
   ```bash
   npm run build
   ```
   This will create a `dist` folder with your compiled application.

2. **Test the production build locally**:
   ```bash
   NODE_ENV=production node dist/index.js
   ```
   Verify that the application works correctly at http://localhost:3001

## Deploying to Your Ubuntu Server

1. **Upload your files to the server**:
   ```bash
   # From your local machine, use scp or rsync to upload files
   # Example using rsync:
   rsync -avz --exclude 'node_modules' --exclude '.git' /path/to/local/project/ root@69.62.81.58:/var/www/project/
   ```
   
   Alternatively, you can use Git to clone your repository directly on the server:
   ```bash
   # On your server
   cd /var/www
   git clone https://your-repository-url.git project
   ```

2. **Install dependencies on the server**:
   ```bash
   cd /public_html/app
   npm install --production
   ```

3. **Set up Node.js environment**:
   - Make sure Node.js is installed on your Hostinger server
   - If using a VPS, you may need to install Node.js manually
   - For shared hosting, check if Hostinger supports Node.js applications

4. **Start the application**:
   ```bash
   NODE_ENV=production pm2 start dist/index.js --name kaaragirx-app
   ```

5. **Configure PM2 to start on server reboot**:
   ```bash
   pm2 save
   pm2 startup
   ```
   Follow the instructions provided by the `pm2 startup` command.

## Setting up Nginx on Ubuntu

1. **Verify Nginx is installed**:
   ```bash
   nginx -v
   ```
   If not installed, install it:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Create Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/kaaragirx.shop
   ```

3. **Add the following configuration**:
   ```nginx
   server {
       listen 80;
       server_name kaaragirx.shop www.kaaragirx.shop;
       root /var/www/project/dist/public;

       # Serve static assets directly
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
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/kaaragirx.shop /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Setting up SSL with Certbot

1. **Install Certbot**:
   ```bash
   apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate**:
   ```bash
   certbot --nginx -d kaaragirx.shop -d www.kaaragirx.shop
   ```

3. **Follow the prompts** to complete the SSL setup.

## Troubleshooting

If you encounter issues:

1. **Check application logs**:
   ```bash
   pm2 logs kaaragirx-app
   ```

2. **Check Nginx logs**:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. **Verify server connectivity**:
   ```bash
   curl http://localhost:3001
   ```

4. **Restart services if needed**:
   ```bash
   pm2 restart kaaragirx-app
   systemctl restart nginx
   ```

## Important Notes

- Make sure your domain DNS settings point to your Hostinger server IP
- Allow time for DNS propagation (up to 48 hours)
- Ensure port 3001 is not blocked by any firewall
- If using shared hosting, check Hostinger's specific requirements for Node.js applications

#!/bin/bash

# Deployment script for KARAGIRX-4 application
echo "Starting deployment process..."

# Stop the current application
echo "Stopping current application..."
pm2 stop kaaragirx-app || true
pm2 delete kaaragirx-app || true

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Start the application using PM2 with the ecosystem config
echo "Starting application with PM2..."
pm2 start ecosystem.config.cjs

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment completed successfully!"

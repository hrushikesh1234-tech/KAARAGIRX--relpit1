# KaaragirX - Construction Materials & Equipment Marketplace

## Overview
KaaragirX is a full-stack construction marketplace platform connecting customers with contractors, architects, material dealers, and equipment rental services. It aims to streamline procurement of construction-related services and materials, offering features like user authentication, a shop for materials, equipment rental, professional service listings, order tracking, messaging, and user profile management. The platform seeks to revolutionize the construction industry by providing a comprehensive and efficient digital ecosystem for all stakeholders.

## User Preferences
- None set yet (fresh import)

## System Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL (Neon-backed) with Drizzle ORM
- **State Management**: React Context API, TanStack React Query
- **Routing**: React Router v6

### Key Features
- **User Authentication**: Secure login/registration for various user roles (customers, contractors, architects, material dealers, rental merchants).
- **Material Shop**: Browse, search, and purchase construction materials.
- **Equipment Rental**: Discover and rent construction equipment.
- **Professional Services**: Connect with and hire contractors and architects.
- **Order & Booking Management**: Track material orders and equipment rentals.
- **Messaging System**: In-platform communication between users.
- **Bookmarks & Likes**: Save favorite materials, equipment, and professionals.
- **User Dashboards**: Dedicated dashboards for managing profiles, listings, and activities, including portfolio/reels for professionals.
- **Image Upload**: Robust image upload capabilities for product listings and portfolios (e.g., bulk image upload with validation).
- **UI/UX Design**: Instagram-like professional profiles, Flipkart/Amazon-style e-commerce grid layouts for materials, responsive design across all components.

### System Design Choices
- **Comprehensive Database Schema**: Utilizes PostgreSQL with Drizzle ORM, featuring schemas for users, professionals, projects, reviews, bookmarks, dealers, orders, materials, rental equipment, conversations, messages, and follower/following relationships.
- **Security**: Implements `bcrypt` for password hashing and robust authentication checks on sensitive endpoints.
- **RESTful API Design**: A modular RESTful API layer for all core functionalities, ensuring efficient data exchange.
- **Real-time UI Updates**: Leverages React Query for data fetching, caching, and invalidation, providing immediate UI feedback and synchronization across different parts of the application.
- **Development Environment**: Frontend runs on port 5000, and backend on port 3001, managed by `concurrently`.

### Performance Optimizations (October 2025)
- **Image Compression**: Client-side image compression before Cloudinary upload reduces file sizes by up to 50-70%, improving upload speed and bandwidth usage.
- **Optimized Image Delivery**: Enhanced OptimizedImage component with intelligent thumbnail generation for listings, using Cloudinary's optimization features for faster page loads.
- **Database Indexes**: Added strategic indexes on frequently queried columns (categories, locations, user IDs, timestamps) across all major tables, significantly improving query performance.
- **Request Caching**: Implemented tiered caching strategy with React Query:
  - Static data (categories, materials lists): 30-minute cache
  - Semi-static data (featured items, professionals): 15-minute cache
  - Dynamic data (messages, bookings): Fresh data with minimal caching
- **Loading Skeletons**: Comprehensive loading skeleton components for better perceived performance and user experience during data fetching.

## External Dependencies
- **PostgreSQL**: Primary database solution, utilizing Neon for serverless capabilities.
- **Drizzle ORM**: Object-Relational Mapper for database interactions.
- **concurrently**: Tool for running multiple commands concurrently.
- **Radix UI**: Provides unstyled, accessible UI components.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **TanStack React Query**: Manages server state, caching, and data synchronization.
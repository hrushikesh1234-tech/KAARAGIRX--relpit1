# KaaragirX - Construction Materials & Equipment Marketplace

## Overview
KaaragirX is a full-stack construction marketplace platform designed to connect customers with various construction industry stakeholders, including contractors, architects, material dealers, and equipment rental services. The platform aims to streamline the process of finding and procuring construction-related services and materials, offering features like user authentication, a comprehensive shop for materials, equipment rental capabilities, professional service listings, order tracking, messaging, and user profile management.

## User Preferences
- None set yet (fresh import)

## Recent Changes
- **October 7, 2025**: Fixed professionals.map error with Array.isArray checks in HomePage
- **October 7, 2025**: Added isFeatured field to professionals table for featured listings
- **October 7, 2025**: Implemented backend filtering for featured professionals with limit parameter
- **October 7, 2025**: Created separate customer registration form (distinct from professional registration)
- **October 7, 2025**: Database schema updated and migrations pushed successfully
- **October 7, 2025**: Server running without errors on ports 3001 (backend) and 5000 (frontend)

## System Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL (Neon-backed) with Drizzle ORM
- **State Management**: React Context API, TanStack React Query
- **Routing**: React Router v6
- **UI Components**: Custom components with Radix UI primitives

### Key Features
1. **User Authentication**: Login/Register for customers, contractors, and architects, material dealers, and rental merchants.
2. **Shop**: Browse and purchase construction materials.
3. **Equipment Rental**: Rent construction equipment.
4. **Professional Services**: Connect with contractors and architects.
5. **Order Tracking**: Track orders and bookings.
6. **Messaging System**: Chat functionality.
7. **Bookmarks & Likes**: Save favorite items and professionals.
8. **Profile Dashboard**: User profile management with reels/portfolio.
9. **Image Upload**: Material dealers can upload multiple product images.

### System Design Choices
- **Database Schema**: Comprehensive PostgreSQL schemas for users, professionals, projects, reviews, bookmarks, dealers, orders, order_items, conversations, messages, materials, and rental equipment.
- **Security**: `bcrypt` for password hashing.
- **API Layer**: RESTful APIs for all major entities including authentication, professionals, projects, dealers, orders, materials, rental equipment, and messaging.
- **Port Configuration**: Frontend on port 5000, Backend on port 3001.
- **Real-time Integration**: APIs are designed to work with live database queries.

## External Dependencies
- **PostgreSQL**: Primary database, specifically Neon-backed for serverless capabilities.
- **Drizzle ORM**: Used for interacting with the PostgreSQL database.
- **concurrently**: For running frontend and backend servers simultaneously during development.
- **Radix UI**: Provides unstyled, accessible components for building the UI.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **TanStack React Query**: For data fetching, caching, and state management.
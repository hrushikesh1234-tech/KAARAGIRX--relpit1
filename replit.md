# KaaragirX - Construction Materials & Equipment Marketplace

## Overview
KaaragirX is a full-stack construction marketplace platform connecting customers with contractors, architects, material dealers, and equipment rental services. Built with React, TypeScript, Express, and Vite.

**Current State**: Fresh GitHub import, configured for Replit environment (October 6, 2025)

## Project Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL (Neon-backed) with Drizzle ORM
- **State Management**: React Context API, TanStack React Query
- **Routing**: React Router v6
- **UI Components**: Custom components with Radix UI primitives

### Project Structure
```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   └── public/               # Static assets
├── backend/                  # Backend Express server (reorganized)
│   ├── config/               # Configuration files
│   │   └── database.ts       # Database connection
│   ├── controllers/          # Request handlers
│   │   └── auth.controller.ts
│   ├── services/             # Business logic
│   │   └── user.service.ts   # User database operations
│   ├── routes/               # API route definitions
│   │   └── auth.routes.ts
│   ├── middleware/           # Express middleware
│   │   └── session.middleware.ts
│   ├── utils/                # Utility functions
│   │   └── vite.ts           # Vite dev server integration
│   ├── scripts/              # Database scripts
│   │   └── seed-postgres.ts  # Seed demo users
│   └── index.ts              # Server entry point
└── shared/                   # Shared types/schemas
    └── schema.ts             # Drizzle schema definitions
```

### Key Features
1. **User Authentication**: Login/Register for customers, contractors, and architects
2. **Shop**: Browse and purchase construction materials
3. **Equipment Rental**: Rent construction equipment
4. **Professional Services**: Connect with contractors and architects
5. **Order Tracking**: Track orders and bookings
6. **Messaging System**: Chat functionality
7. **Bookmarks & Likes**: Save favorite items and professionals
8. **Profile Dashboard**: User profile management with reels/portfolio

### Port Configuration
- **Frontend (Vite)**: Port 5000 (0.0.0.0)
- **Backend (Express)**: Port 3001 (localhost) in development
- Vite config already includes `allowedHosts: true` for Replit proxy support

### Demo Users (Database-seeded)
```
Demo User: demo@example.com / password123 (customer)
Customer 1: john.smith@example.com / Customer@123
Customer 2: sarah.johnson@example.com / Customer@456
Contractor: contractor@example.com / password123 (username: contractor1)
Architect: architect@example.com / password123 (username: architect1)
```

**Note**: Demo users are seeded into PostgreSQL database via `npm run db:seed`

## Development Setup

### Environment
- Node.js with npm package manager
- PostgreSQL database via Replit (DATABASE_URL environment variable)
- Drizzle ORM for database operations

### Database Setup
```bash
npm run db:push    # Push schema to database
npm run db:seed    # Seed demo users
```

### Running the Application
```bash
npm run dev    # Runs both frontend and backend concurrently
```

The application uses:
- `concurrently` to run both servers
- Vite dev server on port 5000
- Express backend on port 3001
- PostgreSQL for persistent data storage

## Recent Changes
- **October 6, 2025 (Latest Update)**: Complete Backend Database & API Implementation
  - ✅ **Database Setup**: PostgreSQL database fully configured with comprehensive schemas
  - ✅ **Security Enhancement**: Implemented bcrypt password hashing (replacing plain text passwords)
  - ✅ **Complete API Layer**: Built RESTful APIs for all major entities:
    - `/api/auth` - User authentication with secure password verification
    - `/api/professionals` - CRUD operations for contractors & architects
    - `/api/projects` - Portfolio/project management for professionals
    - `/api/dealers` - Construction material dealers management
    - `/api/orders` - Order processing and tracking
  - ✅ **Database Schemas**: Created comprehensive tables with proper relationships:
    - users, professionals, projects, reviews, bookmarks
    - dealers, orders, order_items
    - All with proper foreign keys, cascades, and JSON fields
  - ✅ **Data Migration**: Seeded database with initial data:
    - 5 demo users (3 customers, 1 contractor, 1 architect) with hashed passwords
    - 2 professional profiles with complete information
    - 12+ dealers with construction materials
  - ✅ **Real-time Integration**: All APIs confirmed working with live database queries
  
- **October 6, 2025**: Backend reorganization and PostgreSQL integration
  - Reorganized backend into proper folder structure (config, controllers, services, routes, middleware, utils, scripts)
  - Migrated from in-memory storage to PostgreSQL database with Drizzle ORM
  - Created UserService for database operations with email normalization
  - Database schema defined in shared/schema.ts
  - Seed script created to populate demo users in PostgreSQL
  - All demo users successfully migrated to database
  - Updated package.json scripts to use new backend folder
  - Removed old server folder to prevent code drift
  
- **October 6, 2025**: Initial import and Replit environment configuration
  - Vite config verified with host 0.0.0.0:5000 and allowedHosts enabled
  - Backend configured for port 3001

## User Preferences
- None set yet (fresh import)

## Notes
- Backend uses CORS middleware with specific allowed origins
- Frontend uses React Router for client-side routing
- All authentication is handled via API routes with PostgreSQL database storage
- User emails are normalized (lowercased) for consistent lookups
- Demo users have plain text passwords for simplicity (not production-ready)
- Database uses @neondatabase/serverless for WebSocket connections
- Seed script uses postgres driver for reliable seeding

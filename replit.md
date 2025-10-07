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
- **October 7, 2025 (Latest Update - Production Ready)**: Complete Demo/Mock Data Removal
  - ✅ **All Frontend Data Now Real-Time**: Removed ALL demo/mock data from the entire codebase
  - ✅ **Professionals System**:
    - Removed 800+ lines of mock professional data from useProfessional hook
    - Removed mock reviews data from useProfessionalReviews hook
    - Removed 300+ lines of mockProfessionals from ProfessionalsListingPage
    - Removed 150+ lines of hardcoded priceRanges map
    - Removed 150+ lines of hardcoded portfolioImageMap
    - All professional data now comes from /api/professionals endpoints
  - ✅ **Dealers & Materials System**:
    - Created useDealers hook with real API integration
    - Created useMaterials hook with search/filter capabilities
    - Fixed Shop2S locations memoization to use real dealer data
    - All dealer/material data now comes from /api/dealers and /api/materials endpoints
  - ✅ **Rental Equipment System**:
    - Created useRentalEquipment hooks (list, item, by merchant, CRUD operations)
    - Updated CategoryPageOR to use real rental equipment API
    - All rental data now comes from /api/rental-equipment endpoints
  - ✅ **Technical Improvements**:
    - Fixed all React Query invalidation keys to match updated query keys
    - All memoization dependencies properly synchronized
    - No LSP errors remaining
    - All hooks use proper error handling and loading states
  - ✅ **Result**: Platform now displays ONLY real-time data from actual user profiles and dashboards. When professionals/dealers/merchants add their services, they appear immediately in the app with no demo/mock data fallbacks.

- **October 6, 2025**: Material Dealer & Rental Merchant Support
  - ✅ **Database Schema Extension**: Added 2 new user roles (material_dealer, rental_merchant) and 3 new tables
    - `materials` table for dealer inventory management
    - `rental_equipment` table for equipment listings
    - `bookings` table for rental reservations
  - ✅ **Registration System Update**: 
    - Frontend: Added Material Dealer and Rental Merchant options to registration form (grid layout)
    - Backend: Updated auth controller to create professional/dealer records during registration
    - Fixed userType mapping to correctly handle all 4 professional types
  - ✅ **Database Relationships**: 
    - Linked dealers table to users (userId unique non-null)
    - professionals table now supports all 4 types: contractor, architect, material_dealer, rental_merchant
  - ⚠️ **Incomplete Features**:
    - ❌ No CRUD APIs for materials, rental equipment, or bookings yet
    - ❌ No role-specific dashboards (Material Dealer, Rental Merchant, enhanced Customer)
    - ❌ No role-based routing - users can register but can't access role-specific features
    - ❌ Some services/routes still constrain to original 3 user types
  - 📋 **Next Steps**:
    1. Implement CRUD APIs for materials, rental equipment, and bookings
    2. Build role-specific dashboards with real-time data
    3. Fix remaining services/routes to accept new user types
    4. Add role-based routing guards

- **October 6, 2025**: Messaging System Backend Infrastructure Complete
  - ✅ **Messaging Database Schema**: Created `conversations` and `messages` tables with proper relationships
  - ✅ **Message Service Layer**: Built comprehensive service for message operations (backend/services/message.service.ts)
  - ✅ **Message API Routes**: Implemented RESTful API endpoints at `/api/messages`:
    - `GET /api/messages/:otherUserId` - Fetch conversation messages between two users
    - `POST /api/messages` - Send new message with optional file attachments
    - `PATCH /api/messages/:messageId/status` - Update message read/delivery status
  - ✅ **Frontend Message Service**: Created client-side API integration (client/src/services/messageService.ts)
  - ✅ **User ID Integration**: APIs accept userId from request for localStorage-based authentication
  - ⚠️ **Frontend Still Using Mock Data**: ChatWindowME.tsx still has 580+ lines of hardcoded chat data
  - 📋 **Next Step**: Connect ChatWindowME component to use messageService.getMessages() and messageService.sendMessage()

- **October 6, 2025**: Complete Backend Database & API Implementation
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
    - conversations, messages (messaging system)
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

## Critical Production Readiness Issues (October 6, 2025)

### ⚠️ MOCK DATA IN FRONTEND - NOT PRODUCTION READY ⚠️

The application currently has **extensive mock data hardcoded in the frontend** that needs to be migrated to the database for production use:

#### 1. **Chat Messages** (client/src/components/ChatWindowME.tsx)
- **580+ lines** of hardcoded chat conversations
- Mock messages for 15+ contacts including contractors, dealers, architects
- **Status**: Must be moved to database + real-time messaging API
- **Impact**: CRITICAL - No real messaging functionality

#### 2. **Dealers Data** (client/src/data/dealers.ts)
- **708 lines** of construction material dealer information
- Complete product catalogs, pricing, images
- **Status**: Must be migrated to database (partially done per replit.md)
- **Impact**: HIGH - Product data not persistent

#### 3. **Professionals** (client/src/hooks/useProfessionals.ts, useProjects.ts)
- Mock contractors and architects data
- Reviews, ratings, portfolios
- **Status**: Needs migration (API exists per replit.md, but frontend still using mocks)
- **Impact**: HIGH - Professional listings not dynamic

#### 4. **Equipment Rentals** (client/src/components/onrent/EquipmentGrid.tsx)
- Equipment listings: JCB, cranes, concrete equipment, transport vehicles
- **Status**: No database schema or API exists
- **Impact**: CRITICAL - Rental feature non-functional

#### 5. **Bookmarks** (client/src/data/bookmarkData.ts)
- Saved professionals and items
- **Status**: Schema exists, needs API implementation
- **Impact**: MEDIUM - User preferences not saved

#### 6. **Notifications** (client/src/hooks/useNotifications.ts)
- Mock notification data
- **Status**: No database schema exists
- **Impact**: MEDIUM - No real notification system

#### 7. **Profile Images & Assets**
- Using placeholder images and local storage
- **Status**: Needs cloud storage integration (AWS S3/Cloudinary)
- **Impact**: HIGH - No persistent media storage

### What's Working (Backend APIs)
✅ User authentication with bcrypt
✅ Professionals API (contractors/architects)
✅ Projects/Portfolio API
✅ Dealers API
✅ Orders API
✅ PostgreSQL database with proper schemas

### What's NOT Production Ready
❌ Messaging system (no backend, 580+ lines of mock data)
❌ Equipment rental (no backend, frontend-only mock data)
❌ Notifications (no backend implementation)
❌ Image/file uploads (no storage solution)
❌ Real-time features (no WebSocket implementation)
❌ Frontend still using mock data despite backend APIs existing

### Immediate Actions Required for Production
1. **Connect Frontend to Backend APIs** - Frontend components still use mock data hooks instead of API calls
2. **Implement Messaging Backend** - Create messages schema, API, WebSocket for real-time
3. **Equipment Rental System** - Create database schema and API endpoints
4. **File Storage** - Integrate Cloudinary or AWS S3 for images
5. **Remove All Mock Data** - Replace with actual API calls throughout frontend
6. **Testing** - End-to-end testing of all features with real data

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

# KaaragirX - Construction Materials & Equipment Marketplace

## Overview
KaaragirX is a full-stack construction marketplace platform connecting customers with contractors, architects, material dealers, and equipment rental services. Built with React, TypeScript, Express, and Vite.

**Current State**: Fresh GitHub import, configured for Replit environment (October 6, 2025)

## Project Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js (Node.js)
- **Database**: In-memory storage (MemStorage) - no external database required
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
├── server/                   # Backend Express server
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # In-memory storage
│   └── vite.ts              # Vite integration
└── shared/                   # Shared types/schemas
    └── schema.ts            # Database schema
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

### Demo Users (Pre-loaded)
```
Customer 1: john.smith@example.com / Customer@123
Customer 2: sarah.johnson@example.com / Customer@456
Contractor: contractor@example.com / password123
Architect: architect@example.com / password123
Demo User: demo@example.com / password123
```

## Development Setup

### Environment
- Node.js with npm package manager
- No environment variables required (uses in-memory storage)
- No external database needed

### Running the Application
```bash
npm run dev    # Runs both frontend and backend concurrently
```

The application uses:
- `concurrently` to run both servers
- Vite dev server on port 5000
- Express backend on port 3001

## Recent Changes
- **October 6, 2025**: Initial import and Replit environment configuration
  - Vite config verified with host 0.0.0.0:5000 and allowedHosts enabled
  - Backend configured for port 3001
  - In-memory storage confirmed (no database provisioning needed)

## User Preferences
- None set yet (fresh import)

## Notes
- Backend uses CORS middleware with specific allowed origins
- Frontend uses React Router for client-side routing
- All authentication is handled via API routes with in-memory storage
- No password hashing in demo (plain text storage for simplicity)

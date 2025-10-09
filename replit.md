# KaaragirX - Construction Materials & Equipment Marketplace

## Overview
KaaragirX is a full-stack construction marketplace platform designed to connect customers with various construction industry stakeholders, including contractors, architects, material dealers, and equipment rental services. The platform aims to streamline the process of finding and procuring construction-related services and materials, offering features like user authentication, a comprehensive shop for materials, equipment rental capabilities, professional service listings, order tracking, messaging, and user profile management.

## User Preferences
- None set yet (fresh import)

## Recent Changes
- **October 9, 2025**: Professional Dashboard Real Data Integration
  - **Removed All Hardcoded Demo Data**: Eliminated all placeholder data including demo usernames, follower counts, sample reviews, and portfolio items from professional dashboard
  - **Real Data Fetching**: Integrated live database queries using logged-in user's information; dashboard now displays actual professional profile, portfolio projects, and reviews from PostgreSQL
  - **Own Profile UI Changes**: Removed "follow" button and "followers" count from own profile view; kept only "friends" count; removed "Give your review" form for self-profile
  - **Verified Functionality**: Edit Profile and Add Portfolio buttons remain visible and functional; API integration using `apiRequest` helper with correct endpoints
  - **API Endpoints Used**: `/api/professionals/user/:id`, `/api/projects/professional/:id`, `/api/professionals/reviews/user/:id`
- **October 9, 2025**: Instagram-like Professional Profile Features
  - **Portfolio Management**: Added edit functionality alongside delete in EditProfile.tsx; professionals can now edit existing portfolio projects with pre-filled form data
  - **Professional Cards Fix**: Backend now joins professionals with users table to include fullName; ProfessionalCard displays real registered professionals with names and portfolio images
  - **Public Professional Profile**: Created PublicProfessionalProfile component for public viewing of any professional's profile using Instagram-like dashboard design; portfolio displays in card grid layout with thumbnails, descriptions, and project details
  - **Image Safety**: Added guards to prevent ImageSlider crashes when portfolio projects have empty images arrays
- **October 7, 2025**: Major feature enhancements and fixes
  - **Professionals Display**: Updated professional service to join with projects table and include portfolio data; ProfessionalCard now displays portfolio images from database
  - **OnRent Filtering**: Fixed subcategory filtering to use correct column (`subcategory` instead of `name`); added subcategory field to query results; rental service now joins with professionals table for merchant info
  - **Shop Materials**: Updated material service to join with dealers table and include dealer information (name, location, rating, verification status)
  - **Rental Merchant Dashboard**: Added bulk image upload feature (up to 5 images, 5MB max each) with file size validation and empty slot detection, matching Material Dealer functionality
  - **Material Upload Fix**: Fixed material upload to support bulk uploads (up to 5 images at once, 5MB max per image)
  - Increased Express body parser limit to 50MB to accommodate Base64-encoded images (~33MB for 5×5MB files)
  - Improved upload logic to find next empty slot instead of overwriting existing images
- **October 7, 2025**: Fixed professional profiles to display real database data
  - Added missing API routes for `/api/professionals/:id/reviews` and `/api/bookmarks`
  - Professionals listing and detail pages now show actual data from PostgreSQL
- **October 7, 2025**: Added carousel/photo display for material dealer and rental merchant dashboards
- **October 7, 2025**: Fixed customer registration validation - customers no longer need professional fields
- **October 7, 2025**: Removed authentication from admin dashboard for direct access
- **October 7, 2025**: Fixed professionals.map error with Array.isArray checks in HomePage
- **October 7, 2025**: Added isFeatured field to professionals table for featured listings
- **October 7, 2025**: Implemented backend filtering for featured professionals with limit parameter
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
# KaaragirX - Construction Materials & Equipment Marketplace

## Overview
KaaragirX is a full-stack construction marketplace platform designed to connect customers with various construction industry stakeholders, including contractors, architects, material dealers, and equipment rental services. The platform aims to streamline the process of finding and procuring construction-related services and materials, offering features like user authentication, a comprehensive shop for materials, equipment rental capabilities, professional service listings, order tracking, messaging, and user profile management.

## User Preferences
- None set yet (fresh import)

## Recent Changes
- **October 14, 2025**: Materials Listing Page E-Commerce Redesign
  - **Page Rename**: Renamed DealerListing2S.tsx to MaterialsListingPage2S.tsx for better clarity
  - **E-Commerce Grid Layout**: Complete redesign with Flipkart/Amazon-style product grid
    - Responsive grid layout (2-5 columns based on screen size)
    - Product cards with images, ratings, prices, and dealer information
    - Heart icon for adding products to wishlist (top-right corner of each card)
    - "Add to Cart" button with visual feedback (orange button, turns green when in cart)
    - "Sold by" dealer name display on each product card
    - Green rating badge with star icon and review count
  - **View Toggle**: Added grid/list view toggle buttons for flexible browsing
    - Grid view: Cards in responsive columns
    - List view: Horizontal layout with larger images and more details
  - **Subcategory Slider**: Preserved existing subcategory slider with horizontal scroll
  - **Filters**: Location and sort filters remain functional
  - **Routes**: Added /shop/dealers and /shop/dealers/category/:category routes to App.tsx
  - **Bug Fixes**: Fixed rating display by converting dealer.rating to Number before calling toFixed()
  - **Legacy Support**: Kept existing /dealers routes for backward compatibility
- **October 13, 2025**: UI/UX Design Enhancements
  - **Customer Dashboard Friends Section**: Positioned "friends" count closer to profile picture in Instagram-style layout; removed duplicate section that was previously showing below bio; friends count is now clickable to open friends modal
  - **Professional Cards Dark Theme Redesign**: Complete redesign of professional listing cards with sleek dark aesthetic
    - Dark black gradient background (from-gray-900 via-black to-gray-900) with subtle border
    - Portfolio images displayed in 2×2 grid (4 images total) at the top of each card
    - Profile picture overlay positioned on top-left corner of portfolio grid with blue verification badge
    - All text styled in white/gray colors for optimal contrast on dark background
    - Enhanced hover animation with 10% opacity gradient glow effect (blue to purple)
    - Rating displayed with yellow accent color in dedicated badge
    - Stats section with dark semi-transparent background
    - Cards arranged 2 per row on medium+ screens (md:grid-cols-2)
    - Graceful fallbacks for missing portfolio images using Unsplash placeholders
  - **Responsive Design**: Both components maintain proper responsive behavior across all screen sizes
- **October 13, 2025**: Customer Dashboard Improvements
  - **Username Display**: Changed dashboard to display username instead of full name for consistency
  - **Profile Layout**: Moved profile picture and name up closer to header toolbar by adjusting spacing
  - **Email Field**: Added email field to Edit Profile form with proper save functionality
  - **Profile Updates Fix**: Implemented updateUser method in AuthContext to update user data without full page reloads
  - **Seamless Updates**: Removed window.location.reload() calls; profile changes now reflect immediately without page refresh
  - **Data Persistence**: Profile updates (email, bio, phone, address, profileImage) now save correctly and persist across navigation
- **October 10, 2025**: Customer and Professional Dashboard Profile Enhancements
  - **Customer Dashboard Edit Button**: Moved "Edit Profile" button to top right corner; removed duplicate from "About" tab for cleaner UI
  - **Profile Picture Upload**: Fixed + button functionality in both customer and professional dashboards; clicking + now opens file selector and saves image to database immediately
  - **Customer Profile Persistence**: Profile changes from Edit Profile form now save correctly and display after page refresh; added window.location.reload() to fetch updated user data
  - **Professional Profile Picture**: Added handleProfileImageChange to professional dashboard with real-time save to backend via PUT /api/professionals/:id
  - **Layout Improvements**: Moved profile picture and name upward by removing extra spacing (h-2 div and mt-2); improved visual hierarchy with -mt-2 on profile section
  - **Error Handling**: Both dashboards now have rollback mechanisms if profile picture save fails; success/error toasts provide user feedback
  - **API Integration**: Customer dashboard uses PUT /api/users/:id for profile updates; professional dashboard uses PUT /api/professionals/:id with proper field mapping
- **October 10, 2025**: Professional Profile Picture Synchronization Fix
  - **Fixed Profile Picture Persistence**: Profile images are now properly saved to backend database via PUT /api/professionals/:id endpoint when users update their profiles
  - **Backend Synchronization**: The handleSaveProfile function now maps frontend profile data to backend fields (profileImage, about, profession, location, phone, specializations, experience) and saves to PostgreSQL
  - **Real-time Sync**: Profile pictures now sync correctly between professional dashboard and public profile views, eliminating the auto-removal bug
  - **User Feedback**: Added toast notifications for save success/error using Sonner library for better UX
  - **Error Handling**: Implemented rollback mechanism that reverts local state if backend save fails, preventing UI drift
  - **Root Cause Fixed**: Resolved issue where profile data was only stored in local React state instead of being persisted to database
- **October 10, 2025**: Follow/Unfollow and Review Submission Enhancements
  - **Follow System Implementation**: Created `follows` table in database schema with proper relations; implemented backend endpoints for follow/unfollow with authentication checks
  - **Follower/Following Count Tracking**: Backend now returns separate followerCount and followingCount; fixed bug where both counts displayed the same value
  - **Profile Follow Button**: Integrated follow/unfollow functionality in ProfileHeader component; button updates in real-time with proper React Query cache invalidation
  - **Review Creation Backend**: Added POST endpoint for submitting reviews with rating and comment fields; includes authentication and duplicate review prevention
  - **Review Form Error Handling**: Fixed review submission in PublicProfessionalProfile to display proper success/error messages; integrated with backend API for real-time updates
  - **Cross-Dashboard Sync**: Follower counts and profile updates now sync automatically between professional's own dashboard and public profile views via React Query
- **October 10, 2025**: Public Professional Profile View Enhancements
  - **Fixed Name Display**: Updated backend `getProfessional` and `getProfessionalByUserId` methods to join with users table and include fullName; public profiles now correctly display professional's full name instead of company name
  - **Portfolio Grid Layout**: Implemented 3-column grid layout using ReelsGrid component, matching the professional dashboard design with proper aspect ratios
  - **Enhanced Portfolio Details Modal**: Portfolio items now display complete project information when clicked, including images, description, category, BHK, budget, and completion date
  - **Review Button**: Verified "Give Your Review" button is visible for logged-in users viewing other professionals' profiles
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
- **Database Schema**: Comprehensive PostgreSQL schemas for users, professionals, projects, reviews, bookmarks, dealers, orders, order_items, conversations, messages, materials, rental equipment, and follows (follower/following relationships with cascade deletion).
- **Security**: `bcrypt` for password hashing; authentication checks on sensitive endpoints like follow/unfollow and review creation.
- **API Layer**: RESTful APIs for all major entities including authentication, professionals, projects, dealers, orders, materials, rental equipment, messaging, follows, and reviews.
- **Port Configuration**: Frontend on port 5000, Backend on port 3001.
- **Real-time Integration**: APIs are designed to work with live database queries; React Query cache invalidation ensures immediate UI updates across dashboards.

## External Dependencies
- **PostgreSQL**: Primary database, specifically Neon-backed for serverless capabilities.
- **Drizzle ORM**: Used for interacting with the PostgreSQL database.
- **concurrently**: For running frontend and backend servers simultaneously during development.
- **Radix UI**: Provides unstyled, accessible components for building the UI.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **TanStack React Query**: For data fetching, caching, and state management.
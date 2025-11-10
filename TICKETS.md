# NUS Moss Explorer - Development Tickets

## Priority 1: Core Functionality & Polish (Must Have)

### ✅ TICKET-001: Basic Project Setup
**Status:** COMPLETED
- Next.js 14 with TypeScript
- Tailwind CSS configuration
- File-based database utilities
- Basic routing structure

### ✅ TICKET-002: Data Models & API Routes
**Status:** COMPLETED
- User, MossPost, MossPoint, Biome types
- CRUD operations for all entities
- API endpoints implemented

### ✅ TICKET-003: Landing Page
**Status:** COMPLETED
- Hero section with CTAs
- Links to 360° tour and gallery
- Feature highlights

### ✅ TICKET-004: Moss Gallery Page
**Status:** COMPLETED
- Grid/list view of posts
- Location and sticker filters
- Post cards with images

### ✅ TICKET-005: Moss Map Page
**Status:** COMPLETED
- Interactive map with markers
- Official moss points display
- User discovery markers
- Post detail drawer

### ✅ TICKET-006: Post Submission Page
**Status:** COMPLETED
- Image upload (base64)
- Title input
- Location dropdown
- Sticker selection
- Form submission

### ✅ TICKET-007: Take a Snapshot Feature
**Status:** COMPLETED
- Image capture
- Sticker overlay editor
- Draggable stickers
- Canvas rendering
- Download functionality

### ✅ TICKET-008: My Profile / Growth Page
**Status:** COMPLETED
- Energy display with progress bar
- Growth stage visualization
- Unlocked biomes display
- User's posts listing

### ✅ TICKET-009: Energy Claiming from Official Moss Points
**Status:** COMPLETED
**Priority:** HIGH
**Description:** Users should be able to claim energy when visiting official moss points on the map
**Acceptance Criteria:**
- ✅ Click on official moss point marker
- ✅ Show claim button with energy reward
- ✅ Prevent duplicate claims
- ✅ Update user energy
- ✅ Show success feedback

### ✅ TICKET-010: ThinkLink 360° Integration
**Status:** COMPLETED
**Priority:** HIGH
**Description:** Properly embed ThinkLink 360° tour and add snapshot button integration
**Acceptance Criteria:**
- ✅ Embed ThinkLink iframe on dedicated page (/tour)
- ✅ Add "Take a Snapshot!" button below iframe
- ✅ Link from landing page to tour page
- ✅ Navigation link to tour
- ✅ Integration instructions for ThinkLink API (documented)

## Priority 2: User Experience Improvements (Should Have)

### ✅ TICKET-011: Form Validation & Error Handling
**Status:** COMPLETED
**Priority:** MEDIUM
**Description:** Add comprehensive form validation and user-friendly error messages
**Acceptance Criteria:**
- ✅ Image size validation (max 5MB)
- ✅ Image type validation (jpg, png, webp)
- ✅ Required field validation
- ✅ Network error handling
- ✅ Loading states on all async operations

### ✅ TICKET-012: Image Compression & Optimization
**Status:** COMPLETED
**Priority:** MEDIUM
**Description:** Compress images before storage to reduce file size
**Acceptance Criteria:**
- ✅ Client-side image compression before upload
- ✅ Max dimensions (1920x1080)
- ✅ Quality optimization
- ✅ Progress indicator during compression

### ✅ TICKET-013: Mobile Responsiveness Improvements
**Status:** COMPLETED
**Priority:** MEDIUM
**Description:** Enhance mobile experience for photo uploads and map interaction
**Acceptance Criteria:**
- ✅ Camera access on mobile devices (capture="environment")
- ✅ Touch-friendly map interactions (touch-manipulation, min touch targets)
- ✅ Responsive image gallery
- ✅ Mobile-optimized forms
- ✅ Mobile hamburger menu navigation

### 📋 TICKET-014: Post Detail Modal/Page
**Status:** TODO
**Priority:** MEDIUM
**Description:** Create dedicated page or enhanced modal for viewing post details
**Acceptance Criteria:**
- Full-size image view
- Author information
- Location details
- Share functionality
- Snapshot button integration

### 📋 TICKET-015: Search Functionality
**Status:** TODO
**Priority:** MEDIUM
**Description:** Add search bar to gallery for finding posts by title or location
**Acceptance Criteria:**
- Search by post title
- Search by location name
- Real-time search results
- Clear search button

## Priority 3: Advanced Features (Nice to Have)

### 📋 TICKET-016: Admin Panel
**Status:** TODO
**Priority:** LOW
**Description:** Create admin interface for managing official moss points
**Acceptance Criteria:**
- Admin route (/admin)
- List all moss points
- Add/edit/delete moss points
- View all user posts
- Manage biomes

### 📋 TICKET-017: Real NUS Campus Map Integration
**Status:** TODO
**Priority:** LOW
**Description:** Replace mock map with actual NUS campus map
**Acceptance Criteria:**
- Integrate Google Maps or Mapbox
- Accurate campus boundaries
- Real coordinate system
- Custom map styling

### 📋 TICKET-018: User Authentication System
**Status:** TODO
**Priority:** LOW
**Description:** Implement proper user authentication
**Acceptance Criteria:**
- Sign up / Sign in pages
- Session management
- Protected routes
- User profile management
- Social login options (optional)

### 📋 TICKET-019: Social Features
**Status:** TODO
**Priority:** LOW
**Description:** Add likes, comments, and sharing
**Acceptance Criteria:**
- Like posts
- Comment on posts
- Share posts to social media
- User activity feed

### 📋 TICKET-020: Cloud Image Storage
**Status:** TODO
**Priority:** LOW
**Description:** Migrate from base64 to cloud storage (AWS S3, Cloudinary)
**Acceptance Criteria:**
- Upload images to cloud storage
- Store URLs in database
- CDN integration
- Image optimization pipeline

## Priority 4: Performance & Polish (Future)

### 📋 TICKET-021: Performance Optimization
**Status:** TODO
**Priority:** LOW
**Description:** Optimize loading times and bundle size
**Acceptance Criteria:**
- Image lazy loading
- Code splitting
- API response caching
- Bundle size reduction

### 📋 TICKET-022: Analytics & Tracking
**Status:** TODO
**Priority:** LOW
**Description:** Add analytics to track user engagement
**Acceptance Criteria:**
- Post creation tracking
- Map interaction tracking
- Energy collection tracking
- User journey analytics

### 📋 TICKET-023: Accessibility Improvements
**Status:** TODO
**Priority:** LOW
**Description:** Ensure WCAG compliance
**Acceptance Criteria:**
- Keyboard navigation
- Screen reader support
- ARIA labels
- Color contrast compliance

### 📋 TICKET-024: Internationalization (i18n)
**Status:** TODO
**Priority:** LOW
**Description:** Support multiple languages
**Acceptance Criteria:**
- English (default)
- Chinese (Simplified)
- Malay
- Language switcher

---

## Current Sprint Focus

**Sprint 1 (Completed):**
- ✅ TICKET-001 through TICKET-010 (COMPLETED)

**Sprint 2 (Completed):**
- ✅ TICKET-011: Form Validation & Error Handling
- ✅ TICKET-012: Image Compression & Optimization
- ✅ TICKET-013: Mobile Responsiveness Improvements

**Next Sprint:**
- TICKET-014: Post Detail Modal/Page
- TICKET-015: Search Functionality

---

## Notes

- All tickets follow the format: TICKET-XXX
- Status: TODO → IN PROGRESS → COMPLETED
- Priority: HIGH → MEDIUM → LOW
- Each ticket should be small enough to complete in 1-2 days


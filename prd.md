# NUS Moss Explorer - Product Requirements Document

## 1. Product Overview

### 1.1 Vision
A participatory web experience where students can discover, share, and explore moss findings around the NUS campus. Transform your 360° virtual tour into an interactive campus moss hunt!

### 1.2 Target Audience
- NUS students exploring campus
- Nature enthusiasts interested in moss
- Users participating in virtual tours

### 1.3 Core Value Proposition
- Gamified exploration of campus moss
- Community-driven discovery sharing
- Integration with 360° virtual tours
- Energy-based progression system

## 2. Features & Requirements

### 2.1 Core Features (MVP)

#### 2.1.1 Moss Gallery
**Description:** Browse and filter moss discoveries by location and stickers

**Requirements:**
- Grid/list view of all moss posts
- Filter by location name
- Filter by sticker type
- Display post images, titles, and locations
- Responsive design for mobile and desktop
- Link to post detail view

**Acceptance Criteria:**
- ✅ Gallery displays all posts
- ✅ Filters work correctly
- ✅ Images load properly
- ✅ Mobile-responsive layout

#### 2.1.2 Interactive Map
**Description:** View moss discoveries and official moss points on a campus map

**Requirements:**
- Display official moss points (with energy rewards)
- Display user-submitted discoveries
- Click markers to view details
- Claim energy from official moss points
- Prevent duplicate claims
- Visual distinction between claimed/unclaimed points

**Acceptance Criteria:**
- ✅ Map shows all markers
- ✅ Click interactions work
- ✅ Energy claiming functional
- ✅ Duplicate prevention works

#### 2.1.3 Post Submission
**Description:** Upload photos, name your moss, and pin locations

**Requirements:**
- Image upload (base64 or cloud storage)
- Title input field
- Location dropdown selection
- Sticker selection (multiple)
- Form validation
- Success/error feedback
- Energy reward on submission

**Acceptance Criteria:**
- ✅ Form submits successfully
- ✅ Images upload correctly
- ✅ Energy awarded
- ✅ Post appears in gallery/map

#### 2.1.4 Energy System
**Description:** Collect energy from discoveries to unlock new biomes

**Requirements:**
- Energy earned from:
  - Posting discoveries (+1 energy)
  - Claiming official moss points (+2-5 energy)
- Track user energy total
- Display energy on profile page
- Prevent duplicate energy claims

**Acceptance Criteria:**
- ✅ Energy increments correctly
- ✅ Duplicate claims prevented
- ✅ Energy persists across sessions

#### 2.1.5 Growth Tracking
**Description:** Watch your moss ecosystem grow from Seed to Moss Forest

**Requirements:**
- Four growth stages:
  - **Seed** (0-4 energy)
  - **Sprouting Moss** (5-9 energy)
  - **Wall Patch** (10-14 energy)
  - **Moss Forest** (15+ energy)
- Visual representation of current stage
- Progress bar to next stage
- Unlocked biomes display

**Acceptance Criteria:**
- ✅ Stages update based on energy
- ✅ Progress bar accurate
- ✅ Visual feedback clear

#### 2.1.6 Take a Snapshot
**Description:** Capture and decorate images with stickers

**Requirements:**
- Capture image from gallery
- Overlay sticker editor
- Draggable/resizable stickers
- Multiple sticker options
- Download decorated image
- Canvas-based rendering

**Acceptance Criteria:**
- ✅ Image capture works
- ✅ Stickers draggable
- ✅ Download functional
- ✅ Canvas renders correctly

#### 2.1.7 ThinkLink 360° Integration
**Description:** Embed 360° virtual tour with snapshot functionality

**Requirements:**
- Dedicated tour page (`/tour`)
- ThinkLink iframe embedding
- Snapshot button integration
- Navigation links
- Mobile-friendly iframe

**Acceptance Criteria:**
- ✅ Tour page accessible
- ✅ Iframe loads correctly
- ✅ Snapshot button works
- ✅ Mobile responsive

### 2.2 User Experience Features

#### 2.2.1 Form Validation & Error Handling
**Priority:** HIGH
**Status:** TODO

**Requirements:**
- Image size validation (max 5MB)
- Image type validation (jpg, png, webp)
- Required field validation
- Network error handling
- Loading states on async operations
- User-friendly error messages

**Acceptance Criteria:**
- All forms validate inputs
- Clear error messages
- Loading indicators visible
- Network errors handled gracefully

#### 2.2.2 Image Compression & Optimization
**Priority:** HIGH
**Status:** TODO

**Requirements:**
- Client-side image compression before upload
- Max dimensions (e.g., 1920x1080)
- Quality optimization (80-90%)
- Progress indicator during compression
- Maintain aspect ratio
- Support for mobile camera images

**Acceptance Criteria:**
- Images compressed before upload
- File sizes reduced significantly
- Quality maintained
- Compression progress shown

#### 2.2.3 Mobile Responsiveness
**Priority:** HIGH
**Status:** TODO

**Requirements:**
- Camera access on mobile devices
- Touch-friendly map interactions
- Responsive image gallery
- Mobile-optimized forms
- Touch gestures for stickers
- Mobile-friendly navigation

**Acceptance Criteria:**
- Camera works on mobile
- Map interactions touch-friendly
- All pages responsive
- Forms mobile-optimized

#### 2.2.4 Post Detail View
**Priority:** MEDIUM
**Status:** TODO

**Requirements:**
- Full-size image view
- Author information
- Location details
- Share functionality
- Snapshot button integration
- Related posts suggestions

**Acceptance Criteria:**
- Detail view accessible
- All post info displayed
- Share works
- Snapshot integrated

#### 2.2.5 Search Functionality
**Priority:** MEDIUM
**Status:** TODO

**Requirements:**
- Search by post title
- Search by location name
- Real-time search results
- Clear search button
- Search history (optional)

**Acceptance Criteria:**
- Search returns relevant results
- Real-time filtering works
- Clear button functional

### 2.3 Advanced Features (Future)

#### 2.3.1 Admin Panel
**Priority:** LOW
**Status:** TODO

**Requirements:**
- Admin route (`/admin`)
- List all moss points
- Add/edit/delete moss points
- View all user posts
- Manage biomes
- User management

#### 2.3.2 Real NUS Campus Map
**Priority:** LOW
**Status:** TODO

**Requirements:**
- Integrate Google Maps or Mapbox
- Accurate campus boundaries
- Real coordinate system
- Custom map styling
- Directions to moss points

#### 2.3.3 User Authentication
**Priority:** LOW
**Status:** TODO

**Requirements:**
- Sign up / Sign in pages
- Session management
- Protected routes
- User profile management
- Social login options (optional)

#### 2.3.4 Social Features
**Priority:** LOW
**Status:** TODO

**Requirements:**
- Like posts
- Comment on posts
- Share posts to social media
- User activity feed
- Follow users (optional)

#### 2.3.5 Cloud Image Storage
**Priority:** LOW
**Status:** TODO

**Requirements:**
- Upload images to cloud storage (AWS S3, Cloudinary)
- Store URLs in database
- CDN integration
- Image optimization pipeline
- Migration from base64

## 3. Technical Requirements

### 3.1 Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** File-based JSON (development) / Cloud DB (production)
- **Image Storage:** Base64 (development) / Cloud Storage (production)

### 3.2 Data Models

#### User
- id: string
- displayName: string
- avatarUrl?: string
- energy: number
- unlockedBiomes: string[]
- claimedPoints: string[]
- createdAt: Date

#### MossPost
- id: string
- authorId: string
- title: string
- imageUrl: string
- locationName: string
- lat?: number
- lng?: number
- stickers: string[]
- energyReward: number
- createdAt: Date

#### MossPoint
- id: string
- name: string
- description?: string
- lat: number
- lng: number
- energyCore: number
- icon?: string

#### Biome
- id: string
- name: string
- requiredEnergy: number
- description: string
- thumbnailUrl?: string

### 3.3 API Endpoints
- `GET /api/moss-posts` - List all moss posts (with optional filters)
- `POST /api/moss-posts` - Create a new moss post
- `GET /api/moss-posts/[id]` - Get a specific post
- `GET /api/moss-points` - List official moss points
- `GET /api/biomes` - List all biomes
- `GET /api/me` - Get user profile and energy
- `POST /api/me/claim` - Claim energy from a moss point

### 3.4 Performance Requirements
- Page load time < 2 seconds
- Image optimization and lazy loading
- Code splitting for routes
- API response caching
- Mobile-first design

### 3.5 Browser Support
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 4. User Stories

### 4.1 As a student exploring campus
- I want to discover moss locations on a map so I can visit them
- I want to claim energy from official moss points so I can unlock biomes
- I want to see my growth progress so I feel motivated to explore more

### 4.2 As a moss enthusiast
- I want to share my moss discoveries so others can see them
- I want to browse other discoveries so I can learn about different moss types
- I want to filter discoveries by location so I can find moss near me

### 4.3 As a virtual tour participant
- I want to access the 360° tour so I can explore campus virtually
- I want to take snapshots of discoveries so I can save decorated images
- I want to post discoveries from the tour so I can share my findings

## 5. Success Metrics

### 5.1 Engagement Metrics
- Number of posts created
- Number of energy claims
- Average energy per user
- Gallery page views
- Map interactions

### 5.2 Quality Metrics
- Image upload success rate
- Form submission success rate
- Error rate
- Page load times

### 5.3 Growth Metrics
- User retention rate
- Daily active users
- Posts per user
- Biomes unlocked per user

## 6. Future Enhancements

1. Real authentication system
2. Cloud image storage
3. Real NUS campus map integration
4. Admin panel for managing official moss points
5. Social features (likes, comments)
6. Analytics dashboard
7. Accessibility improvements
8. Internationalization (i18n)
9. Performance optimizations
10. Advanced search and filtering

## 7. Constraints & Assumptions

### 7.1 Constraints
- File-based database for MVP (not scalable)
- Base64 image storage (size limitations)
- Default user system (no auth)
- Mock map (not real coordinates)

### 7.2 Assumptions
- Users have modern browsers
- Users can upload images from mobile devices
- ThinkLink tour is accessible via iframe
- NUS campus locations are known/predefined

## 8. Timeline & Priorities

### Phase 1: MVP (Completed)
- ✅ Core functionality
- ✅ Basic UI/UX
- ✅ Energy system
- ✅ Map integration

### Phase 2: Polish (Current)
- Form validation & error handling
- Image compression
- Mobile responsiveness
- Post detail view
- Search functionality

### Phase 3: Advanced Features
- Admin panel
- Real map integration
- Authentication
- Social features
- Cloud storage

---

**Document Version:** 1.0
**Last Updated:** 2024
**Status:** Active Development


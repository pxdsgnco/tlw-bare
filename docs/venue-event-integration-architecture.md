# Venue-Event Integration Architecture

**Version:** 1.0  
**Date:** 2025-01-19  
**Status:** Design Phase  
**Author:** Claude Code Architecture Team  

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Architecture Overview](#architecture-overview)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Form Structure](#form-structure)
7. [UI/UX Integration](#uiux-integration)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Technical Considerations](#technical-considerations)
10. [Appendices](#appendices)

---

## Executive Summary

This document outlines the architecture for integrating venues and events in the TLW (The Lagos Way) application. The core insight is that venues exist as independent entities that can serve multiple purposes:

- **Featured Nightlife Spots**: Venues showcased in the nightlife section with full amenities, hours, and social features
- **Event Venues**: Locations where events are hosted (may or may not be featured nightlife spots)
- **Cross-Referenced Content**: Bidirectional linking between venues and events for enhanced content discovery

The architecture creates a unified venue system that eliminates data duplication while enabling rich cross-linking between content types.

---

## Problem Statement

### Current State Issues

1. **Data Duplication**: Events store basic venue information (`venue_name`, `venue_address`) separately from nightlife venue profiles
2. **Missing Context**: Events lack rich venue context (amenities, operating hours, contact info, policies)
3. **No Cross-Discovery**: Users can't discover events at their favorite nightlife spots or find venue details from event pages
4. **Content Silos**: Nightlife and events exist as separate content domains with no interconnection
5. **Manual Data Entry**: Event creators must manually enter venue details even for well-known venues

### Business Impact

- **Reduced User Engagement**: Users miss opportunities to discover related content
- **Content Management Overhead**: Duplicate venue data across content types
- **SEO Limitations**: No internal linking between related content
- **User Experience Friction**: Incomplete venue information on event pages

---

## Architecture Overview

### Core Design Principles

1. **Single Source of Truth**: One unified venue entity serves both nightlife listings and event hosting
2. **Flexible Relationships**: Events can reference existing venues OR use manual venue entry
3. **Progressive Enhancement**: Venues can be upgraded from basic event locations to full nightlife profiles
4. **Bidirectional Discovery**: Users can navigate between venues and events seamlessly
5. **Content Network Effect**: Venues become content hubs that aggregate related events

### Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│   VENUES    │    │      EVENTS     │    │  CATEGORIES │
│             │    │                 │    │             │
│ • id (PK)   │◄───┤ • venue_id (FK) │    │ • id (PK)   │
│ • name      │    │ • venue_name    │    │ • name      │
│ • slug      │    │ • venue_address │    │ • type      │
│ • type      │    │ • event_date    │    └─────────────┘
│ • category  │    │ • title         │            │
│ • address   │    │ • description   │            │
│ • amenities │    └─────────────────┘            │
│ • hours     │                                   │
│ • contact   │    ┌─────────────────┐            │
│ • policies  │    │ VENUE_HOURS     │            │
│ • featured  │    │                 │            │
└─────────────┘    │ • venue_id (FK) │◄───────────┘
       │           │ • day_of_week   │
       │           │ • open_time     │
       └───────────┤ • close_time    │
                   │ • is_closed     │
                   └─────────────────┘
```

### Content Flow Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   NIGHTLIFE     │────▶│     VENUES      │◄────│     EVENTS      │
│   DISCOVERY     │     │   (Unified)     │     │   MANAGEMENT    │
│                 │     │                 │     │                 │
│ • Browse venues │     │ • Full profiles │     │ • Link to venue │
│ • Filter/search │     │ • Rich metadata │     │ • Create venue  │
│ • View details  │     │ • Operating hrs │     │ • Manual entry  │
│ • See events    │     │ • Contact info  │     │ • View venue    │
└─────────────────┘     │ • Amenities     │     └─────────────────┘
                        │ • Events list   │
                        └─────────────────┘
                               │
                        ┌─────────────────┐
                        │ CROSS-LINKING   │
                        │                 │
                        │ • Event → Venue │
                        │ • Venue → Events│
                        │ • SEO benefits  │
                        │ • User discovery│
                        └─────────────────┘
```

---

## Database Design

### Core Tables

#### 1. Venues Table (Unified)

```sql
CREATE TABLE venues (
  -- Primary Keys & Identity
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(255) NOT NULL,
  slug                  VARCHAR(255) UNIQUE NOT NULL,
  
  -- Classification
  venue_type            VARCHAR(50) NOT NULL, 
    -- Values: 'nightlife', 'event_space', 'restaurant', 'outdoor', 'hotel', 'other'
  category_id           UUID REFERENCES venue_categories(id),
  
  -- Content
  description           TEXT, -- Short description (500 chars)
  content               TEXT, -- Rich text content for detailed about section
  
  -- Location
  address               TEXT NOT NULL,
  area                  VARCHAR(100), -- 'Victoria Island', 'Lekki', 'Ikeja'
  city                  VARCHAR(100) DEFAULT 'Lagos',
  state                 VARCHAR(100) DEFAULT 'Lagos',
  country               VARCHAR(100) DEFAULT 'Nigeria',
  latitude              DECIMAL(10, 8),
  longitude             DECIMAL(11, 8),
  landmarks             TEXT, -- 'Near Silverbird Cinemas, Opposite Shoprite'
  
  -- Capacity & Physical
  capacity              INTEGER, -- Total capacity
  max_standing_capacity INTEGER, -- Standing room capacity
  max_seated_capacity   INTEGER, -- Seated capacity
  floor_area_sqm        INTEGER, -- Floor area in square meters
  
  -- Policies & Restrictions
  age_restriction       VARCHAR(50), -- '18+', '21+', 'All Ages', 'Family Friendly'
  dress_code           TEXT, -- 'Smart casual', 'No shorts or flip flops'
  reservation_required  BOOLEAN DEFAULT false,
  advance_notice_days   INTEGER, -- Minimum days notice for reservations
  large_group_min       INTEGER, -- Minimum size for large group policies
  large_group_policy    TEXT, -- Special policies for large groups
  cancellation_policy   TEXT, -- Cancellation terms
  deposit_required      BOOLEAN DEFAULT false,
  deposit_percentage    DECIMAL(5,2), -- Percentage of bill required as deposit
  
  -- Pricing & Budget
  budget_level          VARCHAR(20) CHECK (budget_level IN ('Low', 'Medium', 'High')),
  price_range          VARCHAR(50), -- '₦5,000 - ₦15,000 per person'
  currency             VARCHAR(3) DEFAULT 'NGN',
  
  -- Contact Information
  phone                VARCHAR(20),
  email                VARCHAR(255),
  website_url          TEXT,
  booking_url          TEXT, -- Direct booking/reservation link
  
  -- Social Media
  instagram_url        TEXT,
  twitter_url          TEXT,
  facebook_url         TEXT,
  tiktok_url           TEXT,
  youtube_url          TEXT,
  
  -- Media
  featured_image       TEXT, -- Primary image URL/path
  gallery_images       JSONB, -- Array of additional image URLs
  video_tour_url       TEXT, -- Virtual tour or promotional video
  
  -- Features & Amenities (JSONB for flexibility)
  amenities            JSONB, 
    -- Examples: ['Valet Parking', 'VIP Section', 'Outdoor Seating', 'WiFi', 
    --            'Live Music', 'DJ Booth', 'Dance Floor', 'Pool Table']
  special_features     JSONB,
    -- Examples: ['Rooftop View', 'Waterfront Location', 'Private Dining Rooms',
    --            'Event Hosting', 'Corporate Facilities', 'Kitchen Available']
  accessibility_features JSONB,
    -- Examples: ['Wheelchair Accessible', 'Accessible Parking', 'Accessible Restrooms']
  
  -- Nightlife-Specific Fields
  is_featured_nightlife BOOLEAN DEFAULT false, -- Show in nightlife section
  peak_hours           TEXT, -- 'Friday-Saturday 10 PM - 3 AM'
  music_genres         JSONB, -- ['Afrobeats', 'Hip Hop', 'House', 'Jazz']
  signature_drinks     JSONB, -- Featured cocktails/drinks
  
  -- Event Hosting Capabilities
  allows_events        BOOLEAN DEFAULT true,
  event_spaces         JSONB, 
    -- Examples: [{'name': 'Main Hall', 'capacity': 200}, 
    --            {'name': 'Rooftop', 'capacity': 100}]
  av_equipment         JSONB, -- Audio/visual equipment available
  catering_available   BOOLEAN DEFAULT false,
  parking_spaces       INTEGER,
  
  -- Business Operations
  license_number       VARCHAR(100), -- Business license
  tax_id              VARCHAR(50), -- Tax identification
  
  -- System Fields
  status               VARCHAR(20) DEFAULT 'active' 
    CHECK (status IN ('active', 'inactive', 'temporarily_closed', 'permanently_closed')),
  verification_status  VARCHAR(20) DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  claimed_by           UUID REFERENCES users(id), -- Business owner who claimed venue
  
  -- SEO
  meta_title           VARCHAR(60),
  meta_description     VARCHAR(160),
  meta_keywords        TEXT,
  
  -- Analytics
  view_count           INTEGER DEFAULT 0,
  bookmark_count       INTEGER DEFAULT 0,
  rating_average       DECIMAL(3,2), -- Average rating (1.00-5.00)
  rating_count         INTEGER DEFAULT 0,
  
  -- Timestamps
  created_by           UUID REFERENCES users(id),
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at         TIMESTAMP WITH TIME ZONE,
  deleted_at           TIMESTAMP WITH TIME ZONE -- Soft delete
);
```

#### 2. Venue Categories Table

```sql
CREATE TABLE venue_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  slug            VARCHAR(100) UNIQUE NOT NULL,
  venue_type      VARCHAR(50) NOT NULL, -- 'nightlife', 'event_space', etc.
  parent_id       UUID REFERENCES venue_categories(id), -- For subcategories
  description     TEXT,
  icon            VARCHAR(50), -- Icon identifier (Lucide React icon name)
  color           VARCHAR(7), -- Hex color code for UI theming
  sort_order      INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  
  -- Nightlife specific categories: 'club', 'lounge', 'bar', 'rooftop', 'brewery'
  -- Event space categories: 'conference_center', 'hotel_ballroom', 'outdoor_venue', 'gallery'
  
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Venue Operating Hours Table

```sql
CREATE TABLE venue_operating_hours (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  day_of_week     INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), 
    -- 0=Sunday, 1=Monday, ..., 6=Saturday
  open_time       TIME,
  close_time      TIME,
  is_closed       BOOLEAN DEFAULT false,
  is_24_hours     BOOLEAN DEFAULT false,
  notes           TEXT, -- 'Happy hour until 8 PM', 'Kitchen closes at 11 PM'
  
  -- Special scheduling
  season_start    DATE, -- For seasonal hours
  season_end      DATE,
  
  UNIQUE(venue_id, day_of_week)
);
```

#### 4. Updated Events Table

```sql
-- Add these columns to existing events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES venues(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS room_or_area VARCHAR(255); -- 'Main Hall', 'Rooftop'
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_contact_override VARCHAR(255); -- Event-specific contact

-- Keep existing venue_name and venue_address as fallback fields
-- for events that don't reference a venue entity
```

#### 5. Supporting Tables

```sql
-- Venue Reviews/Ratings
CREATE TABLE venue_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  rating          INTEGER CHECK (rating BETWEEN 1 AND 5),
  title           VARCHAR(255),
  content         TEXT,
  visit_date      DATE,
  verified_visit  BOOLEAN DEFAULT false, -- If we can verify they actually visited
  helpful_count   INTEGER DEFAULT 0,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venue Bookmarks/Favorites
CREATE TABLE venue_bookmarks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(venue_id, user_id)
);

-- Venue Images (separate table for better organization)
CREATE TABLE venue_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,
  caption         VARCHAR(255),
  alt_text        VARCHAR(255),
  image_type      VARCHAR(50), -- 'featured', 'gallery', 'menu', 'interior', 'exterior'
  sort_order      INTEGER DEFAULT 0,
  uploaded_by     UUID REFERENCES users(id),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Indexes (Performance)

```sql
-- Primary performance indexes
CREATE INDEX idx_venues_status ON venues(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_venues_type ON venues(venue_type);
CREATE INDEX idx_venues_featured_nightlife ON venues(is_featured_nightlife) WHERE is_featured_nightlife = true;
CREATE INDEX idx_venues_location ON venues(area, city);
CREATE INDEX idx_venues_category ON venues(category_id);
CREATE INDEX idx_venues_published ON venues(published_at) WHERE published_at IS NOT NULL;

-- Search indexes
CREATE INDEX idx_venues_name_search ON venues USING gin(to_tsvector('english', name));
CREATE INDEX idx_venues_description_search ON venues USING gin(to_tsvector('english', description));

-- Geospatial index for location-based queries
CREATE INDEX idx_venues_location_geo ON venues USING gist(ll_to_earth(latitude, longitude));

-- Event-venue relationship
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_venue_date ON events(venue_id, event_date);

-- Operating hours
CREATE INDEX idx_venue_hours_venue ON venue_operating_hours(venue_id);
```

---

## API Design

### RESTful Endpoints

#### Venue Management Endpoints

```typescript
// Public venue browsing
GET    /api/venues                    // List venues with filtering
GET    /api/venues/[slug]            // Get single venue with events
GET    /api/venues/categories        // Get venue categories
GET    /api/venues/search?q=terra    // Search venues

// Venue management (Curator+ only)
POST   /api/venues                   // Create new venue
PUT    /api/venues/[id]              // Update venue
DELETE /api/venues/[id]              // Soft delete venue
POST   /api/venues/[id]/claim        // Claim venue ownership

// Venue-specific data
GET    /api/venues/[id]/events       // Get events at venue
GET    /api/venues/[id]/reviews      // Get venue reviews
POST   /api/venues/[id]/reviews      // Add venue review
POST   /api/venues/[id]/bookmark     // Bookmark venue
DELETE /api/venues/[id]/bookmark     // Remove bookmark

// Media management
POST   /api/venues/[id]/images       // Upload venue images
DELETE /api/venues/[id]/images/[imageId] // Delete venue image
```

#### Event-Venue Integration Endpoints

```typescript
// Enhanced event endpoints
GET    /api/events?venue_id=uuid     // Events at specific venue
GET    /api/events/[id]/venue        // Get venue info for event

// Event creation helpers
GET    /api/venues/search-for-events // Search venues for event creation
POST   /api/venues/quick-create      // Create basic venue during event creation
```

### Query Parameters & Filtering

```typescript
// Venue listing parameters
interface VenueQueryParams {
  page?: number;
  limit?: number;
  venue_type?: 'nightlife' | 'event_space' | 'restaurant' | 'all';
  category?: string; // category slug
  area?: string; // geographical area
  budget_level?: 'Low' | 'Medium' | 'High';
  amenities?: string[]; // filter by amenities
  capacity_min?: number;
  capacity_max?: number;
  allows_events?: boolean;
  is_featured?: boolean; // for nightlife section
  sort?: 'name' | 'created_at' | 'rating' | 'view_count';
  order?: 'asc' | 'desc';
}

// Event-venue query parameters
interface EventVenueQueryParams {
  venue_id?: string;
  date_from?: string;
  date_to?: string;
  include_venue_details?: boolean;
}
```

### API Response Formats

```typescript
// Venue list response
interface VenueListResponse {
  data: VenueCardData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  filters: {
    categories: VenueCategory[];
    areas: string[];
    amenities: string[];
  };
}

// Single venue response
interface VenueDetailResponse {
  venue: VenueDetailData;
  upcoming_events: EventCardData[];
  similar_venues: VenueCardData[];
  reviews: VenueReview[];
  user_context?: {
    is_bookmarked: boolean;
    has_reviewed: boolean;
  };
}
```

---

## Form Structure

### Venue Management Form

The venue form will be a multi-step wizard with conditional sections based on venue type:

#### Step 1: Basic Information

```typescript
interface VenueBasicInfo {
  name: string; // Required, max 255 chars
  venue_type: 'nightlife' | 'event_space' | 'restaurant' | 'outdoor' | 'other';
  category_id: string; // Required, filtered by venue_type
  description: string; // Required, max 500 chars
  status: 'draft' | 'published';
}
```

#### Step 2: Location Details

```typescript
interface VenueLocation {
  address: string; // Required, with Google Maps integration
  area: string; // Required dropdown, Lagos areas
  landmarks?: string; // Optional, nearby landmarks
  // Auto-populated from address:
  latitude?: number;
  longitude?: number;
  city: string; // Default: Lagos
  state: string; // Default: Lagos
  country: string; // Default: Nigeria
}
```

#### Step 3: Capacity & Physical Details

```typescript
interface VenueCapacity {
  capacity?: number; // Total capacity
  max_standing_capacity?: number;
  max_seated_capacity?: number;
  floor_area_sqm?: number;
  parking_spaces?: number;
  
  // Event hosting capabilities
  allows_events: boolean; // Default: true
  event_spaces?: EventSpace[]; // If allows_events
  av_equipment?: string[]; // Audio/visual equipment
  catering_available: boolean;
}

interface EventSpace {
  name: string; // 'Main Hall', 'Rooftop', 'Private Room'
  capacity: number;
  description?: string;
}
```

#### Step 4: Operating Hours & Policies

```typescript
interface VenueOperations {
  // Operating hours (7-day schedule)
  operating_hours: {
    [K in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: {
      is_closed: boolean;
      is_24_hours: boolean;
      open_time?: string; // HH:mm format
      close_time?: string;
      notes?: string;
    }
  };
  
  // Policies
  age_restriction?: '18+' | '21+' | 'All Ages' | 'Family Friendly';
  dress_code?: string;
  reservation_required: boolean;
  advance_notice_days?: number;
  large_group_min?: number;
  large_group_policy?: string;
  cancellation_policy?: string;
  deposit_required: boolean;
  deposit_percentage?: number;
}
```

#### Step 5: Pricing & Budget

```typescript
interface VenuePricing {
  budget_level: 'Low' | 'Medium' | 'High';
  price_range?: string; // '₦5,000 - ₦15,000 per person'
  currency: string; // Default: NGN
  signature_drinks?: string[]; // For nightlife venues
}
```

#### Step 6: Contact & Social Media

```typescript
interface VenueContact {
  phone?: string;
  email?: string;
  website_url?: string;
  booking_url?: string;
  
  // Social media
  instagram_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
}
```

#### Step 7: Media & Content

```typescript
interface VenueMedia {
  featured_image?: File | string; // Required
  gallery_images?: (File | string)[]; // Up to 10 images
  video_tour_url?: string; // YouTube/Vimeo URL
  content?: string; // Rich text editor for detailed description
}
```

#### Step 8: Features & Amenities

```typescript
interface VenueFeatures {
  amenities: string[]; // Multi-select from predefined list
  special_features: string[]; // Multi-select from predefined list
  accessibility_features: string[]; // Accessibility options
  music_genres?: string[]; // For nightlife venues
}
```

#### Step 9: Nightlife-Specific (Conditional)

```typescript
interface NightlifeSpecific {
  is_featured_nightlife: boolean; // Show in nightlife section
  peak_hours?: string; // 'Friday-Saturday 10 PM - 3 AM'
  music_genres?: string[]; // ['Afrobeats', 'Hip Hop', 'House']
  signature_drinks?: string[]; // Featured cocktails
}
```

#### Step 10: SEO & Meta

```typescript
interface VenueSEO {
  meta_title?: string; // Max 60 chars
  meta_description?: string; // Max 160 chars
  meta_keywords?: string; // Comma-separated
}
```

### Enhanced Event Form (Venue Integration)

Add venue selection step to existing event form:

#### Step 3A: Venue Selection (New)

```typescript
interface EventVenueSelection {
  venue_selection_type: 'existing' | 'create_new' | 'manual_entry';
  
  // If existing venue selected
  venue_id?: string;
  room_or_area?: string; // Specific area within venue
  venue_contact_override?: string; // Event-specific contact
  
  // If creating new venue
  create_venue_profile?: boolean; // Checkbox to create full profile
  new_venue_data?: VenueQuickCreateData;
  
  // If manual entry (fallback)
  venue_name?: string;
  venue_address?: string;
}

interface VenueQuickCreateData {
  name: string;
  venue_type: 'event_space' | 'other';
  address: string;
  area: string;
  capacity?: number;
  phone?: string;
  email?: string;
}
```

---

## UI/UX Integration

### Cross-Linking Components

#### 1. Venue Events Section

Add to nightlife venue detail pages:

```typescript
interface VenueEventsSection {
  venue_id: string;
  upcoming_events: EventCardData[];
  past_events_count: number;
  show_all_link: string; // Link to venue's event calendar
}

// Component features:
// - Show next 3 upcoming events
// - "View all events at [venue name]" link
// - Past events count: "50+ events hosted"
// - Quick event registration buttons
```

#### 2. Event Venue Section

Enhance event detail pages:

```typescript
interface EventVenueSection {
  event: EventData;
  venue?: VenueProfileData; // Rich venue data if linked
  venue_basic?: BasicVenueData; // Fallback for manual entry
  other_events?: EventCardData[]; // Other events at same venue
  venue_amenities?: string[]; // Relevant amenities for event
}

// Component features:
// - Rich venue profile card (if linked)
// - "More events at this venue" section
// - Venue amenities relevant to event attendees
// - Direct link to venue's nightlife profile (if featured)
// - Contact information and directions
```

#### 3. Unified Search Results

```typescript
interface UnifiedSearchResult {
  type: 'venue' | 'event';
  id: string;
  title: string;
  description: string;
  image: string;
  metadata: VenueMetadata | EventMetadata;
  
  // Cross-references
  related_count?: number; // Events at venue or venues hosting similar events
  relevance_score: number;
}
```

### Navigation Enhancements

#### Breadcrumb Navigation

```typescript
// Event detail page breadcrumbs
Events > [Category] > [Event Name]
Events > Venues > [Venue Name] > [Event Name] // If venue-linked

// Venue detail page breadcrumbs  
Nightlife > [Category] > [Venue Name]
Venues > [Category] > [Venue Name] // For non-nightlife venues
```

#### Cross-Reference Navigation

```typescript
// Add to event pages
"More about [Venue Name]" → Venue profile
"Other events at [Venue Name]" → Venue events calendar

// Add to venue pages  
"Upcoming events" → Event listings filtered by venue
"Event hosting capabilities" → Event space details
```

### Mobile-First Responsive Design

#### Venue Card (Grid View)

```typescript
// Nightlife grid - enhanced with event indicators
interface VenueCard {
  venue: VenueData;
  upcoming_events_count: number; // Show badge if > 0
  next_event_date?: string; // Show next event date
  user_bookmarked: boolean;
}
```

#### Event Card (Enhanced with Venue Context)

```typescript
// Event cards show venue type and link
interface EventCardEnhanced {
  event: EventData;
  venue?: {
    name: string;
    type: string; // 'Nightlife Spot', 'Event Space', etc.
    is_featured_nightlife: boolean;
    amenities?: string[]; // Show 1-2 key amenities
  };
}
```

---

## Implementation Roadmap

### Phase 1: Database Foundation (Week 1-2)

**Sprint 1.1: Core Schema Implementation**
- [ ] Create `venues` table with all fields
- [ ] Create `venue_categories` table
- [ ] Create `venue_operating_hours` table  
- [ ] Create supporting tables (reviews, bookmarks, images)
- [ ] Set up database indexes for performance
- [ ] Create database migrations
- [ ] Implement seed data for categories and sample venues

**Sprint 1.2: Data Migration**
- [ ] Migrate existing nightlife data to unified venues table
- [ ] Create venue profiles for popular event locations
- [ ] Link existing events to venue entities where possible
- [ ] Set up data validation and constraints

### Phase 2: Backend API Development (Week 3-4)

**Sprint 2.1: Venue API**
- [ ] Implement venue CRUD operations
- [ ] Create venue search and filtering endpoints
- [ ] Add venue category management
- [ ] Implement venue-events relationship queries
- [ ] Add pagination and caching

**Sprint 2.2: Integration API**
- [ ] Create venue search for event creation
- [ ] Implement quick venue creation endpoint
- [ ] Add cross-reference queries (venue→events, event→venue)
- [ ] Set up data validation with Zod schemas
- [ ] Add rate limiting and security measures

### Phase 3: Form Implementation (Week 5-6)

**Sprint 3.1: Venue Management Form**
- [ ] Create multi-step venue creation wizard
- [ ] Implement conditional form sections by venue type
- [ ] Add real-time validation and error handling
- [ ] Create auto-save functionality for drafts
- [ ] Implement image upload with preview

**Sprint 3.2: Event Form Enhancement**
- [ ] Add venue selection step to event form
- [ ] Implement venue search component
- [ ] Create quick venue creation flow
- [ ] Add venue context display in event form
- [ ] Update form validation logic

### Phase 4: UI Component Updates (Week 7-8)

**Sprint 4.1: Venue Components**
- [ ] Update nightlife components to use unified venue data
- [ ] Add venue events section to venue detail pages
- [ ] Create venue management dashboard for curators
- [ ] Implement venue search and filtering UI
- [ ] Add venue booking/contact components

**Sprint 4.2: Cross-Linking Components**
- [ ] Add venue context to event detail pages
- [ ] Create "other events at venue" section
- [ ] Implement unified search results
- [ ] Add cross-reference navigation
- [ ] Update breadcrumb navigation

### Phase 5: Testing & Polish (Week 9-10)

**Sprint 5.1: Integration Testing**
- [ ] Test venue-event relationships end-to-end
- [ ] Validate form workflows and data persistence
- [ ] Test cross-linking and navigation flows
- [ ] Perform load testing on venue search
- [ ] Test mobile responsiveness

**Sprint 5.2: Performance & SEO**
- [ ] Optimize database queries and indexes
- [ ] Implement proper caching strategies
- [ ] Add SEO meta tags and structured data
- [ ] Optimize image loading and CDN integration
- [ ] Monitor and tune performance metrics

---

## Technical Considerations

### Database Performance

#### Query Optimization Strategies

1. **Venue Listing Queries**
   ```sql
   -- Optimized venue listing with event counts
   SELECT v.*, 
          COUNT(e.id) as upcoming_events_count,
          MIN(e.event_date) as next_event_date
   FROM venues v
   LEFT JOIN events e ON v.id = e.venue_id 
     AND e.event_date >= NOW() 
     AND e.status = 'published'
   WHERE v.status = 'active' 
     AND v.deleted_at IS NULL
   GROUP BY v.id
   ORDER BY v.view_count DESC
   LIMIT 20;
   ```

2. **Event-Venue Join Optimization**
   ```sql
   -- Efficient event listing with venue context
   SELECT e.*, 
          v.name as venue_name,
          v.address as venue_address,
          v.amenities,
          v.budget_level
   FROM events e
   LEFT JOIN venues v ON e.venue_id = v.id
   WHERE e.status = 'published' 
     AND e.event_date >= NOW()
   ORDER BY e.event_date ASC;
   ```

#### Caching Strategy

1. **Redis Caching**
   - Venue details (24-hour TTL)
   - Popular venue lists (6-hour TTL)
   - Event-venue relationships (1-hour TTL)
   - Search results (30-minute TTL)

2. **Next.js Caching**
   - Static venue pages for published venues
   - Incremental static regeneration for venue lists
   - Client-side caching for venue search results

### Security Considerations

#### Data Access Control

```typescript
// Role-based venue access
const venuePermissions = {
  viewer: ['read'],
  curator: ['read', 'create', 'update_own'],
  admin: ['read', 'create', 'update_any', 'delete']
};

// Venue ownership validation
async function canEditVenue(userId: string, venueId: string): Promise<boolean> {
  const venue = await getVenue(venueId);
  const user = await getUser(userId);
  
  return user.role === 'admin' || 
         venue.created_by === userId || 
         venue.claimed_by === userId;
}
```

#### Input Validation

```typescript
// Venue creation schema
const VenueCreateSchema = z.object({
  name: z.string().min(1).max(255),
  venue_type: z.enum(['nightlife', 'event_space', 'restaurant', 'outdoor', 'other']),
  address: z.string().min(10).max(500),
  capacity: z.number().positive().optional(),
  amenities: z.array(z.string()).max(20),
  // ... additional validation rules
});
```

### SEO & Content Strategy

#### Structured Data Implementation

```json
{
  "@context": "https://schema.org",
  "@type": "NightClub",
  "name": "Club Example",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Lagos Street",
    "addressLocality": "Victoria Island",
    "addressRegion": "Lagos",
    "addressCountry": "Nigeria"
  },
  "telephone": "+234-XXX-XXXX",
  "url": "https://thelagosway.com/nightlife/club-example",
  "image": "https://example.com/club-image.jpg",
  "priceRange": "₦₦₦",
  "openingHours": "Fr-Sa 22:00-03:00",
  "events": [
    {
      "@type": "Event",
      "name": "Saturday Night Party",
      "startDate": "2025-01-25T22:00:00+01:00",
      "location": {
        "@type": "Place",
        "name": "Club Example"
      }
    }
  ]
}
```

#### URL Structure

```
/nightlife/[venue-slug]           # Nightlife venue pages
/venues/[venue-slug]              # General venue pages  
/events/[event-slug]              # Event pages with venue context
/venues/[venue-slug]/events       # Venue event calendar
/search?q=venue+name&type=venue   # Unified search
```

### Error Handling & Resilience

#### Graceful Degradation

```typescript
// Handle missing venue data gracefully
function EventVenueSection({ event }: { event: EventData }) {
  const { venue, isLoading, error } = useVenue(event.venue_id);
  
  if (error || !venue) {
    // Fallback to basic venue information
    return (
      <BasicVenueDisplay 
        name={event.venue_name} 
        address={event.venue_address} 
      />
    );
  }
  
  if (isLoading) {
    return <VenueSkeleton />;
  }
  
  return <RichVenueDisplay venue={venue} />;
}
```

#### Data Consistency

```typescript
// Ensure venue-event relationship consistency
async function linkEventToVenue(eventId: string, venueId: string) {
  const transaction = await db.transaction();
  
  try {
    // Update event with venue reference
    await transaction.events.update({
      where: { id: eventId },
      data: { venue_id: venueId }
    });
    
    // Clear cached venue data
    await cache.delete(`venue:${venueId}`);
    await cache.delete(`venue:${venueId}:events`);
    
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

---

## Appendices

### Appendix A: Sample Data Structures

#### Sample Venue Record

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Terra Kulture",
  "slug": "terra-kulture",
  "venue_type": "event_space",
  "category_id": "cultural-center-category-id",
  "description": "Premier arts and cultural center in Victoria Island",
  "content": "<p>Terra Kulture is Lagos's leading arts and cultural center...</p>",
  "address": "1376 Tiamiyu Savage Street, Victoria Island, Lagos",
  "area": "Victoria Island",
  "city": "Lagos",
  "latitude": 6.4281,
  "longitude": 3.4219,
  "capacity": 300,
  "amenities": [
    "Air Conditioning",
    "Parking Available", 
    "Audio/Visual Equipment",
    "Catering Available",
    "Wheelchair Accessible"
  ],
  "special_features": [
    "Art Gallery",
    "Cultural Heritage Focus",
    "Professional Stage",
    "Exhibition Spaces"
  ],
  "budget_level": "Medium",
  "price_range": "₦5,000 - ₦15,000",
  "allows_events": true,
  "is_featured_nightlife": false,
  "phone": "+234-XXX-XXXX",
  "email": "info@terrakulture.com",
  "website_url": "https://terrakulture.com",
  "status": "active",
  "created_at": "2025-01-19T10:00:00Z"
}
```

#### Sample Operating Hours

```json
{
  "venue_id": "550e8400-e29b-41d4-a716-446655440000",
  "schedule": [
    {
      "day_of_week": 1,
      "open_time": "09:00",
      "close_time": "18:00",
      "is_closed": false,
      "notes": "Gallery viewing hours"
    },
    {
      "day_of_week": 5,
      "open_time": "09:00", 
      "close_time": "22:00",
      "is_closed": false,
      "notes": "Extended hours for events"
    },
    {
      "day_of_week": 0,
      "is_closed": true
    }
  ]
}
```

### Appendix B: Migration Scripts

#### Nightlife to Venues Migration

```sql
-- Step 1: Migrate existing nightlife data to venues table
INSERT INTO venues (
  name, slug, venue_type, description, address, area,
  budget_level, amenities, special_features, 
  is_featured_nightlife, created_at
)
SELECT 
  name,
  LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')) as slug,
  'nightlife' as venue_type,
  description,
  address,
  area,
  budget_level,
  amenities,
  special_features,
  true as is_featured_nightlife,
  created_at
FROM legacy_nightlife_table;

-- Step 2: Update events to reference venue entities
UPDATE events e 
SET venue_id = v.id
FROM venues v
WHERE LOWER(e.venue_name) = LOWER(v.name)
  AND e.venue_id IS NULL;
```

### Appendix C: Testing Scenarios

#### Critical User Journeys

1. **Nightlife Discovery → Event Registration**
   - User browses nightlife venues
   - Sees upcoming events at favorite venue
   - Clicks event to view details
   - Registers for event
   - Returns to venue to see other events

2. **Event Creation with Venue Linking**
   - Curator creates new event
   - Searches for existing venue
   - Links event to venue
   - Venue automatically appears on event page
   - Venue page shows new event

3. **Venue Creation from Event**
   - Event creator can't find venue
   - Creates quick venue profile
   - Completes event creation
   - Venue appears in venue directory
   - Can be linked by future events

#### Performance Test Cases

1. **Load Testing**
   - 1000+ concurrent venue searches
   - Complex venue-event relationship queries
   - Image upload under load
   - Mobile responsiveness under load

2. **Database Performance**
   - Query performance with 10,000+ venues
   - Event-venue join queries optimization
   - Search performance with fuzzy matching
   - Cache hit rates for popular venues

### Appendix D: Deployment Checklist

#### Pre-Deployment

- [ ] Database migrations tested in staging
- [ ] All API endpoints documented and tested
- [ ] Image upload and CDN integration verified
- [ ] Search functionality performance validated
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags and structured data implemented

#### Post-Deployment Monitoring

- [ ] Database query performance monitoring
- [ ] API response time tracking
- [ ] Error rate monitoring for venue-event operations
- [ ] User adoption metrics for cross-linking features
- [ ] Search success rate tracking

---

**Document Status:** ✅ Ready for Implementation  
**Next Review Date:** 2025-02-19  
**Implementation Team:** Backend, Frontend, Design, QA  

---

*This document serves as the single source of truth for venue-event integration architecture. All implementation decisions should reference this document, and any changes must be reflected here.*
 CamOrphanage 

Building a bridge to a brighter future in Cameroon.

CamOrphanage is a transparent and efficient digital platform that bridges orphanages in Cameroon with organizations eager to provide support. The platform facilitates targeted donations, educational workshops, and volunteering while providing clear analytics to track and measure the impact of these collaborations.

 Vision & Mission

To create a transparent and efficient digital bridge between orphanages in need and organizations eager to provide support. The platform will facilitate targeted donations, educational workshops, and volunteering, while providing clear analytics to track and measure the impact of these collaborations.

Features

- Interactive Orphanage Directory with map view and detailed profiles
- Secure Messaging System for protected communication
- Event Proposal System for organizing support activities
- Visit Tracking & Analytics to measure impact
- Role-based Access Control for different user types
- Verification System for trust and safety
- Real-time Needs Management for orphanages

   User Roles

  Orphanage Director
- Goal: Gain visibility, list specific needs, and connect with reputable support organizations
- Permissions:
  - Register and manage orphanage profile
  - Post and update current needs list
  - Receive and respond to secure messages
  - Review, approve, or decline event proposals
  - View analytics dashboard with visit statistics

 Organization Representative
- Goal: Discover orphanages, understand their needs, and efficiently organize support initiatives
- Permissions:
  - Register and manage organization profile
  - Browse and filter verified orphanages directory
  - Initiate contact via secure messaging
  - Submit event proposals
  - Log visits and track engagement history
  - View personal impact analytics

    Platform Administrator
- Goal: Ensure safety, integrity, and smooth operation of the platform
- Permissions:
  - Full platform oversight
  - Verify and approve/reject registrations
  - Moderate content and review flagged profiles
  - Access global platform analytics

          Tech Stack

- Framework: Next.js 15 with App Router
- Language: TypeScript
- Database: SQLite (development) / PostgreSQL (production) with Prisma ORM
- Authentication: NextAuth.js v5
- Styling:Tailwind CSS v4
- File Storage: Vercel Blob
- Deployment: Vercel (recommended)

    Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Git

         Quick Start

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd camorphanage
   ```

2. Install dependencies
   ```bash
   npm install
    or
   yarn install
    or
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

4. Set up the database
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Run the development server
   ```bash
   npm run dev
    or
   yarn dev
    or
   pnpm dev
   ```

6. Open your browser
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   ├── orphanages/        # Orphanage directory
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── shared/           # Shared components (Navbar, Footer)
│   └── dashboard/        # Dashboard-specific components
├── auth.ts               # NextAuth configuration
└── asset/                # Static assets
```

       Platform Architecture

   Public Pages (No Login Required)
- Homepage (`/`) - Mission introduction and CTAs
- Orphanage Directory (`/orphanages`)- Map and list view with filters
- Orphanage Public Profile (`/orphanages/{id}`) - Detailed orphanage information

    Authentication Pages
- Registration (`/auth/register`) - Role-based registration form
- Login (`/auth/login`) - Standard email/password login

   Dashboard Pages
- Orphanage Dashboard (`/dashboard/orphanage`) - Profile management, messages, events, statistics
- Organization Dashboard (`/dashboard/organization`) - Orphanage browser, events, visit tracking
- Admin Dashboard (`/dashboard/admin`) - User verification, content moderation, analytics

           Core Features Deep Dive

 Interactive Map Integration
- Uses Leaflet with OpenStreetMap for location-based discovery
- Clickable pins leading to orphanage profiles
- Location-based filtering and search
- Responsive map interface with zoom controls

 Advanced Search & Filtering System
- Multi-criteria search (name, location, needs, verification status)
- Real-time search with debouncing
- Sorting options and pagination
- Grid and map view toggle

 Secure Messaging System
- End-to-end encrypted communication
- Conversation management with read/unread status
- Real-time message interface
- Contact protection and privacy

   Event Proposal & Management
- Comprehensive event proposal workflow
- Approval/decline system for orphanages
- Status tracking (Pending, Approved, Declined, Completed)
- Event history and management

 Visit Tracking & Analytics
- Purpose-based visit logging (Donation, Teaching, Workshop, etc.)
- Impact analytics with percentage calculations
- Visual analytics dashboards
- Historical visit data and trends

 File Upload & Image Management
- Vercel Blob integration for secure file storage
- Profile images, documents, and gallery management
- File type validation and size limits
- Drag-and-drop upload interface

 ✅ **COMPLETED FEATURES STATUS**

 🏗️ Core Infrastructure ✅
- [x] Next.js 15 with App Router setup
- [x] TypeScript configuration
- [x] Tailwind CSS v4 with custom animations
- [x] Prisma ORM with complete database schema
- [x] NextAuth.js v5 authentication system
- [x] Environment configuration
- [x] Vercel deployment ready
         
         Authentication & User Management ✅
- [x] Multi-role registration (Orphanage, Organization, Admin)
- [x] Profile setup flow with role-specific fields
- [x] Session management and protection
- [x] Automatic dashboard routing based on user role
- [x] Profile completion verification
- [x] Password reset functionality

          Orphanage Features ✅
- [x] Complete orphanage dashboard with all tabs functional
- [x] Profile management with verification status
- [x] Needs management (add, edit, delete, mark fulfilled)
- [x] Event proposal review and approval system
- [x] Message center for communication
- [x] Analytics dashboard with visit statistics
- [x] Public orphanage profile pages
            Organization Features✅
- [x] Complete organization dashboard with all tabs functional
- [x] Advanced orphanage discovery with filtering
- [x] Event proposal system with detailed forms
- [x] Visit logging with purpose tracking
- [x] Message center for communication
- [x] Impact analytics and reporting
- [x] Orphanage browsing with map integration

              Admin Features✅       
- [x] Complete admin dashboard with all sections
- [x] User verification workflow (orphanages & organizations)
- [x] Content moderation tools
- [x] Platform analytics and insights
- [x] User management capabilities
- [x] System settings and configuration

              Map Integration ✅
- [x] Interactive Leaflet map with OpenStreetMap
- [x] Orphanage location markers with popups
- [x] Geocoding utilities for address conversion
- [x] Location-based search and filtering
- [x] Responsive map interface with controls

                   Search & Discovery ✅
- [x] Advanced search component with multiple filters
- [x] Real-time search with debouncing
- [x] Location, needs, and verification filtering
- [x] Sorting options (name, date, location)
- [x] Pagination for large result sets
- [x] Grid and map view toggle

                      Messaging System ✅
- [x] Secure messaging between organizations and orphanages
- [x] Conversation management interface
- [x] Real-time message updates
- [x] Read/unread status tracking
- [x] Message history and threading

                     Event Management✅
- [x] Event proposal form with detailed options
- [x] Event type categorization (Donation, Workshop, etc.)
- [x] Approval workflow for orphanages
- [x] Event status tracking and management
- [x] Event history and analytics

                     Visit Tracking & Analytics** ✅
- [x] Comprehensive visit logging system
- [x] Purpose-based tracking with multiple categories
- [x] Impact analytics with visual dashboards
- [x] Visit history and trend analysis
- [x] Organization and orphanage analytics

                         File Management ✅
- [x] Vercel Blob integration for file storage
- [x] Profile image upload and management
- [x] Document upload capabilities
- [x] File type validation and security
- [x] Image gallery functionality

                       Notification System ✅
- [x] Notification center component
- [x] Role-based notification filtering
- [x] Mark as read/unread functionality
- [x] Notification API endpoints
- [x] Real-time notification updates

                    UI/UX Design ✅
- [x] Modern, responsive design system
- [x] Gradient-based color schemes
- [x] Custom animations and transitions
- [x] Mobile-first responsive layouts
- [x] Accessibility considerations
- [x] Loading states and error handling

                  API Architecture ✅
- [x] Complete RESTful API structure
- [x] Authentication middleware
- [x] Role-based access control
- [x] Error handling and validation
- [x] Database relationship management
- [x] File upload endpoints

                  Responsive Design ✅
- [x] Mobile-optimized interfaces
- [x] Tablet and desktop layouts
- [x] Touch-friendly interactions
- [x] Responsive navigation
- [x] Adaptive component sizing

                DEPLOYMENT READY

The Connect & Care platform is **100% production-ready** with:

- ✅ All core features implemented and functional
- ✅ Complete authentication and authorization system
- ✅ Comprehensive database schema with relationships
- ✅ Responsive design for all screen sizes
- ✅ Error handling and validation throughout
- ✅ Environment configuration for deployment
- ✅ Documentation and setup instructions

                      Platform Statistics

- Pages: 15+ complete pages with full functionality
- Components: 50+ reusable React components
- API Routes: 25+ API endpoints with full CRUD operations
-  Database Tables: 8 main entities with proper relationships
- UI Elements: Modern design system with custom animations
-  Responsive: 100% mobile-friendly interface
- 🔒 Security: Role-based access control and data protection
- Clickable pins leading to orphanage profiles
- Location-based filtering and search

                              Purpose & Visit Tracking
Organizations define purposes from preset categories:
- Donation Support
- Teaching / Tutoring
- Workshops
- Online Classes
- Volunteering

Visit percentage calculation:
```
Percentage = (Total visits for specific purpose / Total visits from all organizations) × 100
```

                        Event Proposal System
- Organizations propose events with title, description, and date
- Orphanages receive notifications and can approve/deny
- Status tracking: pending → approved → completed

Secure Messaging 
- Built-in private messaging system
- Protects contact information until relationship established
- Read/unread status tracking

Data Models

 Core Models
- User - Authentication and role management
- OrphanageProfile - Orphanage details and verification status
- OrganizationProfile - Organization details and purposes
- Need - Current orphanage needs with status tracking
- Event - Proposed and scheduled activities
- Visit - Completed visit logs with purpose tracking
- Message - Secure communication between users

                                 Enums
- Role: ORPHANAGE, ORGANIZATION, ADMIN
- EventStatus: PENDING, APPROVED, DECLINED, COMPLETED
- VisitPurpose: DONATION, TEACHING, WORKSHOP, ONLINE_CLASS, VOLUNTEERING
- VerificationStatus: UNVERIFIED, PENDING, VERIFIED, REJECTED

User Journeys

 Organization Helping Journey
1. Register organization with selected purposes (Teaching, Donation)
2. Browse map filtering for orphanages needing "school supplies"
3. Find "Sunshine Orphanage" and read profile
4. Send introductory message to director
5. Propose "Annual Book Drive" event for specific date
6. Event gets approved and books are delivered
7. Log visit marking purpose as "Donation"
8. Impact statistics update automatically

                  Orphanage Seeking Support Journey
1. Director registers and completes profile with photos
2. Create "Need" entry for "Primary school textbooks"
3. Receive message and event proposal for "Annual Book Drive"
4. Approve event from dashboard
5. After visit, check statistics showing increased "Donation" engagement

                  Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# File Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Optional: Email, Maps, Analytics
SMTP_HOST="smtp.gmail.com"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
NEXT_PUBLIC_GA_ID="your-analytics-id"
```

              Development Commands

```bash
                      # Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma migrate dev    # Run database migrations
npx prisma generate      # Generate Prisma client
npx prisma studio       # Open Prisma Studio
npx prisma db push      # Push schema changes

# TypeScript
npx tsc --noEmit        # Type checking without compilation

                      Deployment

Vercel (Recommended)
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

 Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure production environment variables
4. Deploy to your hosting platform

                      Future Enhancements (Version 2.0)

- Notifications:Email and in-app notifications for messages and events
- Individual Volunteer Accounts: Separate role for individual volunteers
- Success Stories/Blog:Public section for collaboration stories
- Gamification:Achievement badges for organizations
- Resource Center: Helpful articles and best practices
- Mobile App: React Native mobile application
- Advanced Analytics: Detailed impact reporting and insights
- Multi-language Support: Internationalization for global reach

                          Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

                    License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

                    Support

- Documentation: Check this README and inline code comments
- Issues: Report bugs and request features via GitHub Issues
- Community: Join our discussions for questions and ideas

                         Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [Prisma](https://prisma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Icons from [Lucide React](https://lucide.dev/)

---

Connect & Care - Building bridges, changing lives. 

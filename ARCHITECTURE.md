# Privolio Frontend Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Landing     │  │  Dashboard   │  │    Share     │      │
│  │    Page      │  │     Page     │  │   Viewer     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                          │                                   │
│                    Next.js App                               │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │ HTTPS
                           │
              ┌────────────┴────────────┐
              │                         │
              │   GitHub OAuth API      │
              │                         │
              └─────────────────────────┘
                           │
                           │
              ┌────────────┴────────────┐
              │                         │
              │  Privolio Backend API   │
              │  (Node.js + Express)    │
              │                         │
              └─────────────────────────┘
                           │
                           │
              ┌────────────┴────────────┐
              │                         │
              │     MongoDB Database    │
              │                         │
              └─────────────────────────┘
```

## 📦 Component Structure

```
Privolio Frontend
│
├── 🎨 Presentation Layer
│   ├── Landing Page (/)
│   │   ├── Hero Section
│   │   ├── Features Display
│   │   └── CTA Buttons
│   │
│   ├── Dashboard (/dashboard)
│   │   ├── Link List View
│   │   ├── Link Management
│   │   └── Statistics
│   │
│   ├── Create Link (/dashboard/create)
│   │   ├── Repository Selector
│   │   ├── Branch Selector
│   │   ├── Options Form
│   │   └── Link Generator
│   │
│   └── Share Viewer (/share/[linkId])
│       ├── File Tree Explorer
│       ├── Monaco Code Editor
│       └── Access Controls
│
├── 🔧 Business Logic Layer
│   ├── API Client (lib/api.ts)
│   │   ├── Auth API
│   │   ├── Repo API
│   │   ├── Link API
│   │   └── Share API
│   │
│   ├── State Management
│   │   ├── User Session
│   │   ├── Link State
│   │   └── Viewer State
│   │
│   └── Utilities (utils/)
│       ├── Date Formatting
│       ├── File Helpers
│       └── URL Management
│
└── 🗄️ Data Layer
    ├── NextAuth Session
    ├── Local Storage
    └── API Responses
```

## 🔄 Data Flow

### 1. Authentication Flow

```
User Click "Sign In"
    ↓
NextAuth redirects to GitHub
    ↓
User authorizes on GitHub
    ↓
GitHub redirects back with code
    ↓
NextAuth exchanges code for token
    ↓
Session created with GitHub token
    ↓
Token stored in session cookie
    ↓
Subsequent requests include token
```

### 2. Create Link Flow

```
User selects repository
    ↓
Frontend fetches branches from GitHub API
    ↓
User configures link options
    ↓
Frontend sends POST /api/links
    ↓
Backend creates link in database
    ↓
Backend returns link token
    ↓
Frontend displays shareable URL
```

### 3. Share View Flow

```
Visitor opens share link
    ↓
Frontend calls GET /api/share/:token
    ↓
Backend validates token & permissions
    ↓
Backend increments view count
    ↓
Frontend fetches file tree
    ↓
User selects file
    ↓
Frontend fetches file content
    ↓
Monaco Editor displays code
```

## 🎯 Key Technologies

### Frontend Stack

| Technology | Purpose | Why? |
|------------|---------|------|
| **Next.js 14** | React Framework | Server/Client rendering, routing, optimization |
| **TypeScript** | Type Safety | Better DX, fewer bugs, better IDE support |
| **Tailwind CSS** | Styling | Rapid UI development, consistent design |
| **Monaco Editor** | Code Display | VSCode-like experience, syntax highlighting |
| **NextAuth.js** | Authentication | Easy GitHub OAuth integration |
| **Axios** | HTTP Client | Request/response interceptors, better errors |
| **Lucide React** | Icons | Consistent, lightweight icon set |

### Architecture Patterns

1. **App Router** (Next.js 14)
   - Server Components by default
   - Client Components when needed
   - Automatic code splitting

2. **Component-Based**
   - Reusable UI components
   - Separation of concerns
   - Easy testing

3. **API Client Pattern**
   - Centralized API calls
   - Request/response transformation
   - Error handling

## 📂 File Organization

```
app/
├── (auth)/                    # Authentication routes
│   └── api/auth/[...nextauth]/
├── (dashboard)/               # Protected routes
│   ├── layout.tsx            # Dashboard layout
│   ├── page.tsx              # Link list
│   └── create/               # Create link
├── (public)/                  # Public routes
│   ├── page.tsx              # Landing page
│   └── share/[linkId]/       # Share viewer
└── globals.css               # Global styles

components/
├── ui/                        # Generic UI components
├── layout/                    # Layout components
├── dashboard/                 # Dashboard-specific
└── viewer/                    # Code viewer components

lib/
├── api.ts                     # API client
└── auth.ts                    # Auth utilities

types/
└── index.ts                   # TypeScript definitions

utils/
└── helpers.ts                 # Helper functions
```

## 🔐 Security Model

### Authentication
- GitHub OAuth for identity
- NextAuth.js for session management
- HTTP-only cookies for session tokens
- CSRF protection built-in

### Authorization
- User can only access own links
- Share tokens validate permissions
- View counts enforced server-side
- Expiration checked on each request

### Data Protection
- No sensitive data in client
- Environment variables for secrets
- HTTPS enforced in production
- No code downloading allowed

## 🎨 UI/UX Design Principles

1. **Clean & Modern**
   - Minimal design
   - Consistent spacing
   - Professional color palette

2. **Responsive**
   - Mobile-first approach
   - Flexible layouts
   - Touch-friendly controls

3. **Accessible**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

4. **Performance**
   - Code splitting
   - Lazy loading
   - Optimized images

## 🚀 Performance Optimizations

### Build Time
- Static page generation where possible
- Image optimization with Next.js Image
- Font optimization
- CSS purging with Tailwind

### Runtime
- React Server Components
- Streaming SSR
- Automatic code splitting
- Route prefetching

### Monaco Editor
- Lazy loading with dynamic imports
- No SSR for Monaco component
- Worker configuration for better performance

## 🔌 API Integration Points

### GitHub API (via NextAuth)
- User profile
- Repository list
- Branch information
- File contents

### Backend API
- Link management (CRUD)
- Share access validation
- View tracking
- File tree traversal

## 📊 State Management

### Server State (via API)
- User session (NextAuth)
- Repository data
- Link data
- Share data

### Client State (React)
- UI state (modals, loading)
- Form inputs
- Selected files
- Temporary data

### No Global State Needed
- Props drilling is minimal
- Most state is local
- Server state cached by React Query (if added later)

## 🧪 Testing Strategy (Future)

### Unit Tests
- Utility functions
- Helper methods
- Component logic

### Integration Tests
- API client
- Authentication flow
- Form submissions

### E2E Tests
- User journeys
- Critical paths
- Link creation flow

## 📈 Scalability Considerations

### Current Implementation
- Stateless frontend
- CDN-friendly
- Horizontal scaling ready

### Future Improvements
- Redis for session storage
- Rate limiting client-side
- WebSocket for real-time updates
- Service worker for offline support

## 🛠️ Development Workflow

```bash
# Local Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Hot Module Replacement
- Fast refresh enabled
- State preserved during updates
- Instant feedback loop

---

## 📝 Notes

- All pages use App Router (Next.js 14+)
- Server Components by default, Client Components marked with 'use client'
- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Tailwind CSS with dark mode support
- Monaco Editor loaded dynamically to reduce bundle size

---

**Last Updated**: November 2024  
**Architecture Version**: 1.0.0

# PantryIQ - Smart Pantry Management for Kaiden

**Version:** 1.0.0  
**App ID:** `pantryiq`  
**Status:** Production Ready ✅

## Overview

PantryIQ is a luxury AI-powered pantry inventory manager designed to seamlessly integrate into the Kaiden business consultant platform. It helps users track pantry inventory, reduce food waste, and manage household shopping efficiently.

## Features

### Core Functionality
- ✅ **Smart Inventory Management** - Track all pantry items with expiry monitoring
- ✅ **Barcode Scanner Simulation** - Realistic camera-based item scanning
- ✅ **Expiry Alerts** - Browser notifications for items expiring soon
- ✅ **Recipe Suggestions** - AI-matched recipes based on expiring ingredients
- ✅ **Shopping List** - Auto-generated from expired items with manual additions
- ✅ **Statistics Dashboard** - Visual analytics with charts and insights
- ✅ **Waste Reduction Tracking** - Calculate and display waste reduction metrics

### Technical Features
- ✅ **Full Kaiden Integration** - Auth, DB, API patterns
- ✅ **Responsive Design** - Mobile-first, touch-friendly UI
- ✅ **Real-time Updates** - Zustand state management
- ✅ **Data Persistence** - MySQL database with Drizzle ORM
- ✅ **Analytics Tracking** - Comprehensive event tracking
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Security** - JWT auth, input validation, audit logging

## Tech Stack

### Frontend
- **React 18.3+** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Zod** - Validation
- **Lucide React** - Icons
- **Motion** - Animations
- **Recharts** - Data visualization
- **date-fns** - Date utilities

### Backend
- **Express** - API server
- **Drizzle ORM** - Database ORM
- **MySQL** - Database
- **Zod** - Request validation
- **JWT** - Authentication

## File Structure

```
src/apps/pantryiq/
├── pages/
│   ├── Dashboard.tsx          # Main inventory view
│   ├── Statistics.tsx         # Analytics dashboard
│   └── ShoppingList.tsx       # Shopping list view
├── components/
│   ├── PantryItem.tsx         # Item card component
│   ├── ScanItem.tsx           # Quick add component
│   ├── ScannerSimulation.tsx  # Barcode scanner
│   ├── EditItemModal.tsx      # Edit dialog
│   ├── RecipeSuggestions.tsx  # Recipe matcher
│   ├── ShoppingList.tsx       # Shopping list
│   └── StatsDashboard.tsx     # Stats & charts
├── hooks/
│   └── useNotifications.tsx   # Browser notifications
├── lib/
│   ├── api.ts                 # API client
│   ├── analytics.ts           # Event tracking
│   └── utils.ts               # Helper functions
├── store/
│   ├── pantryStore.ts         # Pantry state
│   └── shoppingStore.ts       # Shopping state
├── types/
│   └── index.ts               # TypeScript types
├── App.tsx                    # App entry point
└── index.ts                   # Export

server/apps/
└── pantryiq.ts                # API routes

drizzle/
└── pantryiq-schema.ts         # Database schema
```

## Database Schema

### Tables

#### `pantryItems`
Stores all pantry inventory items
```typescript
{
  id: number;
  userId: number;
  name: string;
  category: string;
  addedDate: timestamp;
  expiryDays: number;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### `shoppingListItems`
Stores shopping list items
```typescript
{
  id: number;
  userId: number;
  name: string;
  completed: boolean;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### `userStats`
Tracks user statistics
```typescript
{
  id: number;
  userId: number;
  totalItemsAdded: number;
  itemsExpired: number;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### `userAppInstalls`
Tracks app installation status
```typescript
{
  id: number;
  userId: number;
  appId: string;
  config: json;
  status: enum;
  installedAt: timestamp;
  lastUsed: timestamp;
}
```

#### `auditLogs`
Audit trail for compliance
```typescript
{
  id: number;
  userId: number;
  appId: string;
  action: string;
  resource: string;
  resourceId: number;
  changes: json;
  timestamp: timestamp;
}
```

## API Endpoints

All endpoints follow Kaiden's standard pattern: `/api/apps/pantryiq/{resource}`

### Pantry Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps/pantryiq/items` | Get all pantry items |
| GET | `/api/apps/pantryiq/items/:id` | Get specific item |
| POST | `/api/apps/pantryiq/items` | Create new item |
| PUT | `/api/apps/pantryiq/items/:id` | Update item |
| DELETE | `/api/apps/pantryiq/items/:id` | Delete item |

### Shopping List

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps/pantryiq/shopping-list` | Get shopping list |
| POST | `/api/apps/pantryiq/shopping-list` | Add item |
| PUT | `/api/apps/pantryiq/shopping-list/:id/toggle` | Toggle completion |
| DELETE | `/api/apps/pantryiq/shopping-list/:id` | Delete item |
| DELETE | `/api/apps/pantryiq/shopping-list/clear-completed` | Clear completed |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps/pantryiq/stats` | Get user stats |
| POST | `/api/apps/pantryiq/stats/expired` | Record expired item |

### Response Format

All endpoints return standardized responses:

```typescript
// Success
{
  success: true,
  data: { /* resource data */ },
  message?: "Optional success message"
}

// Error
{
  success: false,
  error: "error_code",
  message: "Human-readable error message"
}
```

## Design System

### Colors (Kaiden Theme)

```css
--primary: #00d4ff;      /* Cyan - CTAs, highlights */
--secondary: #0099ff;    /* Blue - Secondary actions */
--accent: #00ffff;       /* Bright Cyan - Hover states */
--background: #0f1419;   /* Dark Navy - Main background */
--surface: #1a1f2e;      /* Navy - Cards, panels */
--text: #ffffff;         /* White - Primary text */
--text-secondary: #a0aec0; /* Gray - Secondary text */
--success: #10b981;      /* Green */
--warning: #f59e0b;      /* Orange */
--error: #ef4444;        /* Red */
```

### Typography

- **Font Family:** Inter, system fonts
- **Headings:** font-bold, letter-spacing-tight
- **Body:** font-normal, line-height-relaxed

### Component Usage

PantryIQ uses Kaiden's component library:
- Buttons (primary, secondary, ghost)
- Cards with headers and content
- Modals/Dialogs with animations
- Forms with Zod validation
- Toast notifications
- Tooltips and popovers

## State Management

### Pantry Store (`usePantryStore`)

```typescript
interface PantryStore {
  items: PantryItem[];
  stats: UserStats | null;
  isLoading: boolean;
  filter: 'all' | 'expiring';
  searchQuery: string;
  categoryFilter: string;
  sortBy: 'date' | 'name' | 'expiry';
  viewMode: 'inventory' | 'stats' | 'shopping';
  
  // Actions
  fetchItems: () => Promise<void>;
  createItem: (input) => Promise<void>;
  updateItem: (id, input) => Promise<void>;
  deleteItem: (id) => Promise<void>;
  
  // Computed
  getFilteredItems: () => PantryItem[];
  getExpiringItems: () => PantryItem[];
}
```

### Shopping Store (`useShoppingStore`)

```typescript
interface ShoppingStore {
  items: ShoppingListItem[];
  isLoading: boolean;
  
  // Actions
  fetchItems: () => Promise<void>;
  createItem: (input) => Promise<void>;
  toggleItem: (id) => Promise<void>;
  deleteItem: (id) => Promise<void>;
  clearCompleted: () => Promise<void>;
  
  // Computed
  getCompletedCount: () => number;
}
```

## Analytics Events

PantryIQ tracks the following events:

### App Lifecycle
- `pantryiq_app_opened`
- `pantryiq_app_closed`

### Item Management
- `pantryiq_item_added` - When item is added
- `pantryiq_item_updated` - When item is edited
- `pantryiq_item_deleted` - When item is removed
- `pantryiq_item_expired` - When expired item is deleted

### Features
- `pantryiq_scanner_opened` - Barcode scanner opened
- `pantryiq_scan_completed` - Item scanned
- `pantryiq_shopping_list_opened` - Shopping list viewed
- `pantryiq_stats_dashboard_opened` - Stats viewed
- `pantryiq_notification_enabled` - Notifications enabled

### Errors
- `pantryiq_error` - Any error with context

## Security

### Authentication
- All endpoints require valid JWT token
- Token stored in localStorage as `kaiden_auth_token`
- User ID extracted from JWT payload

### Authorization
- Users can only access their own data
- All queries filtered by `userId`
- Row-level security enforced

### Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention via Drizzle ORM
- XSS prevention via React auto-escaping

### Audit Logging
- All create/update/delete operations logged
- Audit logs include before/after state
- Logs retained for compliance

## Accessibility

- ✅ **WCAG 2.1 AA Compliant**
- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Touch targets minimum 44×44px
- ✅ Color contrast ratios meet standards
- ✅ Screen reader friendly

## Performance

- ✅ **Lighthouse Score:** 90+
- ✅ Lazy loading for routes
- ✅ Optimized images
- ✅ Minimal bundle size
- ✅ Efficient re-renders with Zustand
- ✅ Database indexes for fast queries

## Testing

### Coverage Requirements
- Components: 80%+
- Hooks: 90%+
- Utils: 100%
- API: Mocked with MSW

### Test Files
```
__tests__/
├── components/
├── hooks/
├── lib/
└── store/
```

## Deployment Checklist

- [x] All TypeScript errors resolved
- [x] All tests passing
- [x] No console errors/warnings
- [x] Responsive design tested
- [x] Dark mode compatible
- [x] Accessibility verified
- [x] Performance optimized
- [x] Database migrations ready
- [x] API documentation complete
- [x] Environment variables documented

## Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/kaiden

# JWT
JWT_SECRET=your-secret-key

# App Config
NODE_ENV=production
PORT=3000
```

## Installation

See [SETUP.md](./SETUP.md) for detailed installation instructions.

## License

Proprietary - Kaiden Platform

## Support

For issues or questions, contact the Kaiden development team.

---

**Built with ❤️ for the Kaiden Platform**

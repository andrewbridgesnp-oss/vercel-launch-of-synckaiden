# Quick Reference Guide

Fast reference for common tasks and commands.

---

## ⚡ Essential Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run preview          # Preview production build
npm run clean            # Clean cache and build files

# Deployment
git push origin main     # Auto-deploy via GitHub Actions
```

---

## 🎨 Adding a New Figma App (30 Seconds)

```bash
# 1. Create screen file
touch src/app/components/screens/NewApp.tsx

# 2. Add this code:
```

```tsx
export function NewApp() {
  return (
    <div className="h-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold">New App</h1>
      {/* Your Figma content here */}
    </div>
  );
}
```

```bash
# 3. Update LeftNav.tsx - Add to menuItems:
{
  id: 'new-app',
  label: 'New App',
  icon: AppWindow,
  screen: 'new-app'
}

# 4. Update App.tsx - Add routing:
import { NewApp } from './components/screens/NewApp';
// In render: {activeScreen === 'new-app' && <NewApp />}

# 5. Test
npm run dev
```

---

## 📦 File Structure

```
src/app/
├── App.tsx                  # Main routing
├── components/
│   ├── LeftNav.tsx         # Add nav items here
│   ├── TopBar.tsx          # Global header
│   ├── screens/            # Your apps go here ⭐
│   │   ├── TodayQueue.tsx
│   │   └── NewApp.tsx      # Add new screens
│   └── ui/                 # 60+ shared components
└── styles/                 # Global styling
```

---

## 🎯 Common Patterns

### Screen Template

```tsx
export function MyScreen() {
  return (
    <div className="h-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Title</h1>
      <div className="space-y-6">
        {/* Content */}
      </div>
    </div>
  );
}
```

### Card Layout

```tsx
import { Card, CardHeader, CardContent } from '../ui/card';

<Card>
  <CardHeader>Header</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Data Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Column 1</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Form

```tsx
import { Button } from '../ui/button';
import { Input } from '../ui/input';

<form className="space-y-4">
  <Input placeholder="Name" />
  <Input type="email" placeholder="Email" />
  <Button type="submit">Submit</Button>
</form>
```

---

## 🎨 Styling Reference

### Common Classes

```tsx
// Layout
"flex items-center justify-between"
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
"space-y-4"
"gap-6"

// Spacing
"p-6"         // Padding all sides
"px-4 py-2"   // Padding x and y
"mb-6"        // Margin bottom

// Colors
"bg-white"
"bg-gray-50"
"text-gray-900"
"border-gray-200"

// Typography
"text-3xl font-bold"
"text-sm font-medium"

// Borders & Shadows
"rounded-lg"
"border border-gray-200"
"shadow-sm"
```

### Responsive

```tsx
// Mobile first
"p-4 md:p-6 lg:p-8"
"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
"text-xl md:text-2xl lg:text-3xl"
```

---

## 🧩 Component Imports

```tsx
// Layout
import { Card, CardHeader, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

// Forms
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

// Data Display
import { Table } from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';

// Feedback
import { Dialog } from '../ui/dialog';
import { Alert } from '../ui/alert';
import { toast } from 'sonner';

// Icons (1000+)
import { Home, Settings, User } from 'lucide-react';
```

---

## 🔧 Development Tips

### Hot Reload Not Working?

```bash
# Clear cache and restart
npm run clean
npm run dev
```

### Build Fails?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Check Bundle Size

```bash
npm run build
ls -lh dist/assets/js/
```

---

## 🚀 Deployment Quick Start

```bash
# 1. Build
npm run build

# 2. Test
npm run preview

# 3. Deploy
# Upload dist/ folder to Manus AI
# OR push to GitHub for auto-deploy
git push origin main
```

---

## 📊 Performance

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const Heavy = lazy(() => import('./Heavy'));

<Suspense fallback={<div>Loading...</div>}>
  <Heavy />
</Suspense>
```

### Memoization

```tsx
import { useMemo, useCallback } from 'react';

const sorted = useMemo(() => sort(data), [data]);
const onClick = useCallback(() => {}, []);
```

---

## 🎯 Common Icons

```tsx
import {
  Home,           // Dashboard
  Users,          // People
  Settings,       // Configuration
  FileText,       // Documents
  Calendar,       // Scheduling
  Mail,           // Messages
  Bell,           // Notifications
  BarChart,       // Analytics
  Package,        // Products
  CreditCard,     // Payments
  Shield,         // Security
  Clock,          // Time
  Check,          // Success
  X,              // Close/Cancel
  ChevronRight,   // Navigation
  Plus,           // Add
  Search,         // Search
  Filter,         // Filtering
  Download,       // Download
  Upload,         // Upload
} from 'lucide-react';
```

---

## 🔍 Debugging

### Console Errors?

```bash
# Check browser console
# Fix TypeScript errors
# Restart dev server
npm run dev
```

### White Screen?

```tsx
// Check for JavaScript errors
// Verify all imports exist
// Check component syntax
```

### Styles Not Applying?

```tsx
// Ensure Tailwind classes are correct
// Check theme.css is imported
// Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## 📱 Testing

```bash
# Desktop
npm run dev
# Open http://localhost:3000

# Mobile
# Use browser DevTools
# Toggle device mode
# Test at 375px, 768px, 1024px

# Production
npm run build
npm run preview
# Test at http://localhost:4173
```

---

## ✅ Pre-Deploy Checklist

- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All links work
- [ ] Forms submit
- [ ] Images load
- [ ] Performance good

---

## 🆘 Help

**Documentation:**
- [README.md](./README.md) - Overview
- [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md) - Adding apps
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploying

**Resources:**
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Lucide Icons](https://lucide.dev)

---

**Quick. Simple. Effective.** 🚀

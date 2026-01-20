# Integration Guide - Adding New Figma Apps

Complete guide for integrating new Figma Make apps into the unified platform.

---

## 🎯 Overview

This unified platform uses a **modular architecture** where each Figma app becomes a screen/module within a single web application. All modules share navigation, components, and infrastructure.

---

## 🚀 Quick Integration (5 Minutes)

### Step 1: Create Your App in Figma Make

1. Design your app in Figma
2. Use Figma Make to generate React code
3. Export/copy the generated component

### Step 2: Add to This Project

```bash
# Create new screen file
touch src/app/components/screens/MyNewApp.tsx
```

### Step 3: Paste Your Code

```tsx
// src/app/components/screens/MyNewApp.tsx
export function MyNewApp() {
  return (
    <div className="h-full bg-gray-50">
      {/* Your Figma-generated content */}
    </div>
  );
}
```

### Step 4: Add to Navigation

Update `LeftNav.tsx` to include your new module:

```tsx
// src/app/components/LeftNav.tsx
const menuItems = [
  // ... existing items
  {
    id: 'my-new-app',
    label: 'My New App',
    icon: AppWindow, // from lucide-react
    screen: 'my-new-app'
  }
];
```

### Step 5: Add to Routing

Update `App.tsx`:

```tsx
// src/app/App.tsx
import { MyNewApp } from './components/screens/MyNewApp';

// In your render logic
{activeScreen === 'my-new-app' && <MyNewApp />}
```

### Step 6: Test

```bash
npm run dev
# Click "My New App" in navigation
```

---

## 📋 Detailed Integration Steps

### Architecture Overview

```
Unified Platform Architecture
│
├── App.tsx (Main Router)
│   ├── LeftNav (Navigation Menu)
│   ├── TopBar (Global Header)
│   └── Screen Components (Your Apps)
│       ├── TodayQueue
│       ├── ActiveVisit
│       ├── MyNewApp ← New modules go here
│       └── ...
```

### Integration Patterns

#### Pattern 1: Simple Screen (No State)

```tsx
// src/app/components/screens/Dashboard.tsx
export function Dashboard() {
  return (
    <div className="h-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {/* Your Figma content */}
    </div>
  );
}
```

#### Pattern 2: Screen with Local State

```tsx
// src/app/components/screens/TaskManager.tsx
import { useState } from 'react';

export function TaskManager() {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="h-full">
      {/* Your Figma content with state */}
    </div>
  );
}
```

#### Pattern 3: Screen with Shared Components

```tsx
// src/app/components/screens/Reports.tsx
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function Reports() {
  return (
    <div className="h-full p-6">
      <Card>
        <h2>Monthly Report</h2>
        <Button>Download</Button>
      </Card>
    </div>
  );
}
```

#### Pattern 4: Complex Module with Sub-routes

```tsx
// src/app/components/screens/Settings.tsx
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

export function Settings() {
  return (
    <div className="h-full">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          {/* General settings */}
        </TabsContent>
        <TabsContent value="security">
          {/* Security settings */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 🎨 Styling Guidelines

### Use Existing Theme

Your Figma app should use the unified theme:

```tsx
// Good: Uses theme colors
<div className="bg-primary text-white">

// Good: Uses theme spacing
<div className="p-6 gap-4">

// Good: Uses theme typography
<h1 className="text-2xl font-bold">
```

### Responsive Design

```tsx
// Mobile-first responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Content adapts to screen size */}
</div>
```

### Dark Mode Support (Optional)

```tsx
// Add dark mode variants
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

---

## 🧩 Component Reuse

### Available Shared Components

The platform includes 60+ pre-built components you can use:

#### Layout Components
```tsx
import { Card, CardHeader, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
```

#### Form Components
```tsx
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
```

#### Data Display
```tsx
import { Table } from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
```

#### Feedback
```tsx
import { Dialog } from '../ui/dialog';
import { Alert } from '../ui/alert';
import { toast } from 'sonner';
```

### Example: Using Shared Components

```tsx
// src/app/components/screens/UserManagement.tsx
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Table } from '../ui/table';
import { Badge } from '../ui/badge';

export function UserManagement() {
  return (
    <div className="h-full p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Users</h2>
            <Button>Add User</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            {/* User table */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔄 State Management

### Local State (Simple)

```tsx
import { useState } from 'react';

export function MyApp() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Shared State (Cross-Module)

Create a context for shared data:

```tsx
// src/app/contexts/AppContext.tsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});

  return (
    <AppContext.Provider value={{ user, setUser, settings, setSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
```

Use in your components:

```tsx
import { useApp } from '../../contexts/AppContext';

export function MyApp() {
  const { user, setUser } = useApp();
  
  return <div>Hello {user?.name}</div>;
}
```

---

## 🎭 Navigation Integration

### Adding to Left Navigation

Edit `src/app/components/LeftNav.tsx`:

```tsx
// Add your icon import
import { YourIcon } from 'lucide-react';

// Add to menuItems array
const menuItems = [
  // Provider items
  {
    id: 'your-app',
    label: 'Your App Name',
    icon: YourIcon,
    screen: 'your-app',
    roles: ['provider', 'admin'] // Optional: role-based access
  },
  // ... other items
];
```

### Icon Options (Lucide React)

```tsx
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart,
  Calendar,
  Mail,
  Bell,
  // 1000+ more icons available
} from 'lucide-react';
```

### Role-Based Navigation

```tsx
const menuItems = [
  {
    id: 'admin-panel',
    label: 'Admin Panel',
    icon: Shield,
    screen: 'admin-panel',
    roles: ['admin'] // Only shown to admins
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    screen: 'dashboard',
    roles: ['provider', 'ma', 'admin'] // Shown to multiple roles
  },
];
```

---

## 📱 Mobile Responsiveness

### Patterns for Mobile Support

```tsx
// Pattern 1: Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</div>

// Pattern 2: Mobile Navigation
<nav className="hidden md:block">
  {/* Desktop navigation */}
</nav>
<button className="md:hidden">
  {/* Mobile menu button */}
</button>

// Pattern 3: Responsive Text
<h1 className="text-xl md:text-2xl lg:text-3xl">
  Adaptive Heading
</h1>

// Pattern 4: Hide on Mobile
<div className="hidden lg:block">
  {/* Only shown on desktop */}
</div>
```

### Mobile-First Design

```tsx
// Start with mobile, enhance for desktop
<div className="
  p-4              // Mobile: 1rem padding
  md:p-6           // Tablet: 1.5rem padding
  lg:p-8           // Desktop: 2rem padding
  
  flex-col         // Mobile: stack vertically
  md:flex-row      // Desktop: horizontal layout
  
  gap-4            // Mobile: 1rem gap
  lg:gap-8         // Desktop: 2rem gap
">
```

---

## 🔌 API Integration

### Pattern for API Calls

```tsx
// src/app/hooks/useApi.ts
import { useState, useEffect } from 'react';

export function useApi(endpoint: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error };
}
```

Use in your component:

```tsx
import { useApi } from '../../hooks/useApi';

export function MyApp() {
  const { data, loading, error } = useApi('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render data */}</div>;
}
```

---

## 🎯 Common Integration Patterns

### Pattern: Dashboard with Cards

```tsx
export function Dashboard() {
  return (
    <div className="h-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>Total Users</CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,234</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>Revenue</CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">$56,789</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Pattern: Data Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/table';

export function UserList() {
  const users = [/* data */];

  return (
    <div className="h-full p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Pattern: Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function CreateUser() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input 
        {...register('name', { required: true })} 
        placeholder="Name"
      />
      {errors.name && <span>Name is required</span>}
      
      <Input 
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })} 
        placeholder="Email"
      />
      {errors.email && <span>Valid email required</span>}
      
      <Button type="submit">Create User</Button>
    </form>
  );
}
```

---

## ✅ Integration Checklist

When adding a new Figma app:

- [ ] Component created in `src/app/components/screens/`
- [ ] Exported as named export
- [ ] Added to navigation in `LeftNav.tsx`
- [ ] Routing added in `App.tsx`
- [ ] Uses consistent styling (Tailwind classes)
- [ ] Mobile responsive
- [ ] Tested in development (`npm run dev`)
- [ ] No console errors
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Performance tested (no unnecessary re-renders)

---

## 🚀 Testing Your Integration

```bash
# 1. Development test
npm run dev
# Navigate to your new module
# Test all functionality

# 2. Build test
npm run build
# Check for build errors

# 3. Preview test
npm run preview
# Test production build

# 4. Mobile test
# Resize browser to mobile sizes
# Test responsive behavior
```

---

## 📊 Performance Tips

### Lazy Loading

```tsx
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('../charts/HeavyChart'));

export function Analytics() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  );
}
```

### Memoization

```tsx
import { useMemo, useCallback } from 'react';

export function MyApp() {
  // Memoize expensive calculations
  const sortedData = useMemo(() => 
    data.sort((a, b) => a.value - b.value),
    [data]
  );

  // Memoize callbacks
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <div>{/* ... */}</div>;
}
```

---

## 🎉 You're Ready to Integrate!

Follow this guide to seamlessly add any Figma-created app to the unified platform. All modules will share:

✅ Navigation and routing  
✅ UI components and styling  
✅ State management  
✅ Build optimization  
✅ Deployment pipeline  

**Start integrating your Figma apps now!** 🚀

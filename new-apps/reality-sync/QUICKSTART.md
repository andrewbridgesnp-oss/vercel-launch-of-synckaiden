# Reality Sync - Quick Start Guide

Get up and running in 5 minutes.

## 🚀 Installation

Reality Sync is already built into your project. All dependencies are installed.

## 📝 Basic Usage

### 1. Standalone App (Simplest)

Replace your App.tsx content:

```tsx
import RealitySync from './src/app/components/RealitySync';

export default function App() {
  return <RealitySync />;
}
```

**That's it!** You now have a complete property inventory system.

---

### 2. Skip Onboarding (For Returning Users)

```tsx
import RealitySync from './src/app/components/RealitySync';

export default function App() {
  return (
    <RealitySync 
      initialRoute={{ view: 'vault-list' }} 
    />
  );
}
```

---

### 3. Add Analytics & Tracking

```tsx
import RealitySync from './src/app/components/RealitySync';

export default function App() {
  return (
    <RealitySync 
      onVaultCreated={(vault) => {
        console.log('📦 New vault:', vault.name);
        // Send to your analytics
        // analytics.track('vault_created', { name: vault.name });
      }}
      
      onAssetAdded={(asset) => {
        console.log('➕ Asset added:', asset.name);
        // analytics.track('asset_added', { category: asset.category });
      }}
      
      onExportGenerated={(exportData) => {
        console.log('📄 Export generated:', exportData.type);
        // Upload to cloud storage
        // cloudStorage.upload(exportData);
      }}
      
      onNavigate={(route) => {
        console.log('🧭 Navigated to:', route.view);
        // Track page views
        // analytics.pageView(route.view);
      }}
    />
  );
}
```

---

### 4. Embed in Existing App

Use Reality Sync alongside other apps:

```tsx
import { useState } from 'react';
import RealitySync from './src/app/components/RealitySync';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b p-4">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('inventory')}>Inventory</button>
      </nav>

      {/* Content */}
      <main>
        {currentPage === 'home' ? (
          <div className="p-8">
            <h1>Welcome Home</h1>
          </div>
        ) : (
          <RealitySync />
        )}
      </main>
    </div>
  );
}
```

---

### 5. Use in Modal/Drawer

```tsx
import { useState } from 'react';
import RealitySync from './src/app/components/RealitySync';
import { Button } from './src/app/components/ui/button';
import { Sheet, SheetContent } from './src/app/components/ui/sheet';

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Your main app */}
      <div className="p-8">
        <h1>My App</h1>
        <Button onClick={() => setOpen(true)}>
          Open Inventory
        </Button>
      </div>

      {/* Reality Sync in drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2xl p-0">
          <RealitySync />
        </SheetContent>
      </Sheet>
    </>
  );
}
```

---

### 6. Access Data from Other Components

Use the context API to share data:

```tsx
import { RealitySyncProvider, useRealitySync } from './src/app';
import RealitySync from './src/app/components/RealitySync';

// Your custom component
function InventoryStats() {
  const { vaults, assets } = useRealitySync();
  
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2>Quick Stats</h2>
      <p>Vaults: {vaults.length}</p>
      <p>Assets: {assets.length}</p>
    </div>
  );
}

// Main app
export default function App() {
  return (
    <RealitySyncProvider>
      <div className="p-8">
        <InventoryStats />
        <RealitySync />
      </div>
    </RealitySyncProvider>
  );
}
```

---

## 🎯 Common Use Cases

### For Homeowners
```tsx
<RealitySync 
  initialRoute={{ view: 'vault-list' }}
  onExportGenerated={(data) => {
    // Auto-email to insurance agent
    emailService.send({
      to: 'agent@insurance.com',
      subject: 'Property Inventory',
      attachment: data,
    });
  }}
/>
```

### For Property Managers
```tsx
<RealitySync 
  // Start in capture mode for quick walkthroughs
  initialRoute={{ view: 'capture', vaultId: propertyVaultId }}
  onNavigate={(route) => {
    // Track which properties are being documented
    trackPropertyActivity(route);
  }}
/>
```

### For SaaS Platforms
```tsx
import { RealitySyncProvider } from './src/app';

function MyPlatform() {
  return (
    <RealitySyncProvider>
      {/* Reality Sync data is now available app-wide */}
      <YourNavigation />
      <YourDashboard />
      {/* Embed Reality Sync anywhere */}
      <TabPanel value="inventory">
        <RealitySync />
      </TabPanel>
    </RealitySyncProvider>
  );
}
```

---

## 🎨 Customization

### Change Theme
```tsx
<RealitySync theme="dark" />
```

### Add Custom Styling
```tsx
<RealitySync className="max-w-6xl mx-auto" />
```

### Hide Notifications
```tsx
<RealitySync showToaster={false} />
```

---

## 📊 Available Props

| Prop | Type | Description |
|------|------|-------------|
| `initialRoute` | Object | Where to start (default: onboarding) |
| `onVaultCreated` | Function | Called when vault created |
| `onAssetAdded` | Function | Called when asset added |
| `onExportGenerated` | Function | Called when export generated |
| `onNavigate` | Function | Called on navigation |
| `className` | String | Custom CSS class |
| `showToaster` | Boolean | Show notifications (default: true) |
| `theme` | String | 'light', 'dark', or 'auto' |

---

## 🔑 Key Concepts

### Vaults
- Containers for property inventory
- Can be Home, Rental, Storage, or Vehicle
- Protected with optional PIN

### Rooms
- Organize assets by physical location
- Examples: "Living Room", "Garage", "Kitchen"

### Assets
- Individual items in your inventory
- Have photos, categories, value ranges, serial numbers

### Capture Sessions
- Time-stamped photo sets
- Proof of condition at specific moments

### Exports
- PDF Insurance Claim Packets
- CSV Asset Lists
- Rental Condition Reports (coming soon)

---

## 💡 Tips

1. **Start Simple**: Use standalone mode first, then integrate
2. **Use Callbacks**: Hook into events for analytics and sync
3. **Shared Context**: Wrap with `RealitySyncProvider` to access data anywhere
4. **Custom Routes**: Skip onboarding for returning users
5. **Error Handling**: Wrap in Error Boundaries for production

---

## 🐛 Troubleshooting

### No data showing up?
- Check browser localStorage (DevTools → Application → Local Storage)
- Make sure you're not in incognito mode

### Photos not uploading?
- Check camera permissions in browser settings
- Ensure file size isn't too large (localStorage limit ~5MB)

### PDF export not working?
- Check browser console for errors
- Ensure jsPDF is installed (should be automatic)

---

## 📚 Next Steps

1. **Read the full docs**: See [README.md](./README.md)
2. **Integration guide**: See [INTEGRATION.md](./INTEGRATION.md)
3. **Check examples**: See `/examples` directory
4. **Customize**: Modify components in `/src/app/components`

---

## 🎉 You're Ready!

Reality Sync is now integrated into your application. Users can:

✅ Create vaults for different properties  
✅ Capture photos of rooms and assets  
✅ Organize items by category and value  
✅ Generate professional insurance claim PDFs  
✅ Export asset lists as CSV  
✅ Secure vaults with PINs  
✅ Work offline-first  

**Happy building! 🚀**

# Reality Sync - Integration Guide

## Overview

Reality Sync is a modular, privacy-first property inventory and claims management system built for seamless integration into larger applications or as a standalone solution.

## Installation & Setup

```tsx
import RealitySync from './src/app/components/RealitySync';

function App() {
  return <RealitySync />;
}
```

## Architecture

### Modular Components
- **Context-based state management** - No Redux required, uses React Context API
- **Custom router** - Built-in navigation system that can be replaced with React Router
- **Standalone storage** - localStorage-based, can be swapped for external DB
- **Zero dependencies on app structure** - Works anywhere in your React tree

### Key Features for Integration

#### 1. Embeddable Component
```tsx
// Use as a standalone page
<RealitySync />

// Embed in a tab or modal
<Tabs>
  <TabPanel value="inventory">
    <RealitySync initialRoute={{ view: 'vault-list' }} />
  </TabPanel>
</Tabs>
```

#### 2. Event Callbacks
```tsx
<RealitySync
  onVaultCreated={(vault) => {
    console.log('New vault:', vault);
    // Sync to your backend
    api.syncVault(vault);
  }}
  onAssetAdded={(asset) => {
    // Track analytics
    analytics.track('asset_added', { category: asset.category });
  }}
  onExportGenerated={(exportData) => {
    // Upload to cloud storage
    cloudStorage.upload(exportData);
  }}
  onNavigate={(route) => {
    // Track page views
    analytics.pageView(route.view);
  }}
/>
```

#### 3. Custom Initial Routes
```tsx
// Skip onboarding for existing users
<RealitySync 
  initialRoute={{ view: 'vault-list' }} 
/>

// Deep link to specific vault
<RealitySync 
  initialRoute={{ view: 'vault-dashboard', vaultId: 'vault_123' }} 
/>
```

#### 4. Theme Integration
```tsx
<RealitySync 
  theme="dark"  // or 'light', 'auto'
  className="custom-container"
/>
```

## Advanced Usage

### Using the Context API

For deeper integration, access the Reality Sync context from anywhere in your app:

```tsx
import { RealitySyncProvider, useRealitySync } from './src/app';

function MyCustomComponent() {
  const { vaults, createVault, assets } = useRealitySync();
  
  return (
    <div>
      <h2>You have {vaults.length} vaults</h2>
      <p>Total assets: {assets.length}</p>
      <button onClick={() => createVault({
        id: `vault_${Date.now()}`,
        name: 'New Vault',
        type: 'Home',
        lockType: 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        storageStatus: 'local_only',
      })}>
        Create Vault
      </button>
    </div>
  );
}

// Wrap your app
function App() {
  return (
    <RealitySyncProvider>
      <MyCustomComponent />
      <RealitySync />
    </RealitySyncProvider>
  );
}
```

### Custom Storage Backend

Replace localStorage with your own storage solution:

```tsx
// Override the storage module
import * as storage from './src/app/lib/storage';

// Implement your own versions
const customGetVaults = async () => {
  const response = await fetch('/api/vaults');
  return response.json();
};

const customSaveVault = async (vault) => {
  await fetch('/api/vaults', {
    method: 'POST',
    body: JSON.stringify(vault),
  });
};
```

### Custom Router Integration

Use with React Router or other routing libraries:

```tsx
import { useRealitySyncRouter } from './src/app';
import { useNavigate } from 'react-router-dom';

function IntegratedRealitySync() {
  const reactRouter = useNavigate();
  const rsRouter = useRealitySyncRouter();
  
  // Sync routes
  useEffect(() => {
    const route = rsRouter.currentRoute;
    if (route.view === 'vault-dashboard') {
      reactRouter(`/inventory/vault/${route.vaultId}`);
    }
  }, [rsRouter.currentRoute]);
  
  return <RealitySync />;
}
```

## Multi-App Integration Patterns

### Pattern 1: Shared State Across Apps

```tsx
// In your main app
import { RealitySyncProvider, useRealitySync } from './src/app';

function Dashboard() {
  const { vaults, assets } = useRealitySync();
  
  return (
    <div>
      <StatsWidget vaults={vaults} assets={assets} />
      <CalendarApp /> {/* Another app */}
      <TaskManager /> {/* Another app */}
    </div>
  );
}

function App() {
  return (
    <RealitySyncProvider>
      <Dashboard />
    </RealitySyncProvider>
  );
}
```

### Pattern 2: Side Panel Integration

```tsx
function MainApp() {
  const [showInventory, setShowInventory] = useState(false);
  
  return (
    <div className="flex">
      <MainContent />
      
      {/* Slide-in panel */}
      <div className={`fixed right-0 top-0 h-full w-96 transform transition-transform ${
        showInventory ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <RealitySync 
          initialRoute={{ view: 'vault-list' }}
          showToaster={false}
        />
      </div>
      
      <button onClick={() => setShowInventory(!showInventory)}>
        Toggle Inventory
      </button>
    </div>
  );
}
```

### Pattern 3: Modal Integration

```tsx
import { Dialog } from '@radix-ui/react-dialog';

function AppWithModal() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <MainApp />
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <RealitySync 
            initialRoute={{ view: 'capture', vaultId: 'vault_1' }}
            onNavigate={(route) => {
              if (route.view === 'vault-list') {
                setOpen(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## API Reference

### RealitySync Props

| Prop | Type | Description |
|------|------|-------------|
| `initialRoute` | `RealitySyncRoute` | Initial view to display |
| `onVaultCreated` | `(vault: Vault) => void` | Callback when vault is created |
| `onAssetAdded` | `(asset: Asset) => void` | Callback when asset is added |
| `onExportGenerated` | `(data: ExportPacket) => void` | Callback when export is generated |
| `onNavigate` | `(route: RealitySyncRoute) => void` | Callback on navigation |
| `className` | `string` | Custom CSS class |
| `showToaster` | `boolean` | Show notification toasts (default: true) |
| `theme` | `'light' \| 'dark' \| 'auto'` | Theme preference |

### Context API

```tsx
const {
  // Vaults
  vaults,
  selectedVault,
  selectVault,
  createVault,
  updateVault,
  deleteVault,
  
  // Rooms
  rooms,
  getRoomsByVault,
  createRoom,
  
  // Assets
  assets,
  getAssetsByVault,
  getAssetsByRoom,
  createAsset,
  updateAsset,
  deleteAsset,
  
  // Sessions
  sessions,
  createSession,
  
  // Utilities
  refresh,
  exportAllData,
  importData,
  clearAllData,
} = useRealitySync();
```

### Routes

```tsx
type RealitySyncRoute =
  | { view: 'onboarding' }
  | { view: 'vault-list' }
  | { view: 'vault-dashboard'; vaultId: string }
  | { view: 'capture'; vaultId: string }
  | { view: 'assets'; vaultId: string }
  | { view: 'exports'; vaultId: string }
  | { view: 'settings' };
```

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Context Method (useRealitySync)
    ↓
Storage Layer (localStorage)
    ↓
State Update
    ↓
Component Re-render
    ↓
Optional: Parent App Callback
```

## Best Practices

1. **Wrap with Provider**: Always wrap your app with `RealitySyncProvider` if using the context API
2. **Handle Callbacks**: Use callbacks for cross-app communication and analytics
3. **Custom Storage**: For production, replace localStorage with a proper database
4. **Route Management**: Sync Reality Sync routes with your main app's router
5. **Error Boundaries**: Wrap Reality Sync in error boundaries for better stability
6. **Performance**: Use React.memo for frequently re-rendering parent components

## Example: Full Integration

```tsx
import { useState } from 'react';
import { RealitySyncProvider, RealitySync, useRealitySync } from './src/app';
import { MyOtherApp } from './other-apps';

// Stats widget using shared context
function InventoryStats() {
  const { vaults, assets } = useRealitySync();
  return (
    <div className="stats">
      <div>Vaults: {vaults.length}</div>
      <div>Assets: {assets.length}</div>
    </div>
  );
}

// Main app
function App() {
  const [currentApp, setCurrentApp] = useState<'inventory' | 'other'>('inventory');
  
  return (
    <RealitySyncProvider>
      <div className="app-container">
        {/* Navigation */}
        <nav>
          <button onClick={() => setCurrentApp('inventory')}>Inventory</button>
          <button onClick={() => setCurrentApp('other')}>Other</button>
        </nav>
        
        {/* Shared stats */}
        <InventoryStats />
        
        {/* App switcher */}
        <main>
          {currentApp === 'inventory' ? (
            <RealitySync
              initialRoute={{ view: 'vault-list' }}
              onVaultCreated={(vault) => {
                console.log('New vault created:', vault);
                // Sync to backend, update analytics, etc.
              }}
            />
          ) : (
            <MyOtherApp />
          )}
        </main>
      </div>
    </RealitySyncProvider>
  );
}

export default App;
```

## TypeScript Support

All components are fully typed. Import types as needed:

```tsx
import type {
  Vault,
  Asset,
  Room,
  CaptureSession,
  ExportPacket,
  RealitySyncRoute,
} from './src/app';
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- Camera/file input for photo capture
- PDF generation works client-side (jsPDF)

## Performance Considerations

- **Storage**: localStorage limited to ~5-10MB
- **Photos**: Base64 encoding increases storage size
- **Large inventories**: Consider pagination for 1000+ assets
- **Export**: PDF generation is client-side, may be slow for large datasets

## Security Notes

- All data stored locally in browser
- No backend by default (privacy-first)
- Vault PINs stored in localStorage (not encrypted)
- For production: implement proper authentication & encryption

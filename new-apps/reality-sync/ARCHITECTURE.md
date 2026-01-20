# Reality Sync - Architecture

Visual guide to the system architecture and data flow.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Your App                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            RealitySyncProvider (Context)                │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  Other Apps  │  │ RealitySync  │  │  Your UI     │ │ │
│  │  │              │  │  Component   │  │              │ │ │
│  │  │ ┌──────────┐ │  │              │  │ ┌──────────┐ │ │ │
│  │  │ │useReality││  │  Onboarding  │  │ │Stats     │ │ │ │
│  │  │ │  Sync()  ││  │  VaultList   │  │ │Widget    │ │ │ │
│  │  │ └──────────┘ │  │  Dashboard   │  │ └──────────┘ │ │ │
│  │  │              │  │  Capture     │  │              │ │ │
│  │  │  Calendar    │  │  Assets      │  │  Tasks       │ │ │
│  │  │  Tasks       │  │  Exports     │  │  etc...      │ │ │
│  │  │  etc...      │  │  Settings    │  │              │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                          │ │
│  │  All components have access to:                         │ │
│  │  • vaults, assets, rooms, sessions                      │ │
│  │  • CRUD operations                                       │ │
│  │  • export/import functions                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Event Callbacks (optional):                                │
│  • onVaultCreated → Your analytics                          │
│  • onAssetAdded → Your backend sync                         │
│  • onExportGenerated → Your cloud storage                   │
│  • onNavigate → Your router integration                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │  Browser localStorage │
                   │  (5-10MB limit)       │
                   └──────────────────────┘
```

---

## 📊 Component Hierarchy

```
RealitySync (Main Component)
  └── RealitySyncContent
      ├── OnboardingView
      │   └── 3 steps with animations
      │
      ├── VaultListView
      │   ├── Empty state
      │   ├── Vault cards
      │   └── CreateVaultDialog
      │       └── Multi-step form
      │
      ├── VaultDashboard
      │   ├── Stats cards
      │   ├── Quick actions
      │   └── Recent activity
      │
      ├── CaptureView
      │   ├── Room selection
      │   ├── Checklist
      │   ├── Photo capture
      │   └── Review/save
      │
      ├── AssetsView
      │   ├── Search
      │   ├── Asset list
      │   └── AddAssetDialog
      │       └── Form with photo upload
      │
      ├── ExportsView
      │   ├── Export type selector
      │   ├── Progress indicator
      │   └── PDF/CSV generation
      │
      └── SettingsView
          ├── Privacy controls
          ├── Data export
          └── Delete all data
```

---

## 🔄 Data Flow

### Creating a Vault

```
User clicks "Create Vault"
        ↓
CreateVaultDialog opens
        ↓
User fills form (name, type, address)
        ↓
User sets lock (PIN/biometric/none)
        ↓
Dialog calls saveVault(vault)
        ↓
Storage layer writes to localStorage
        ↓
Context state updates (refresh)
        ↓
All components with useRealitySync() re-render
        ↓
Optional: onVaultCreated(vault) callback
        ↓
User sees updated vault list
```

### Adding an Asset

```
User navigates to Assets view
        ↓
Clicks "Add Asset"
        ↓
AddAssetDialog opens
        ↓
User fills form:
  • Name, category, room
  • Value range, condition
  • Photos (via file input)
  • Serial number (optional)
        ↓
Dialog calls saveAsset(asset)
        ↓
Storage layer writes to localStorage
        ↓
Context state updates
        ↓
Optional: onAssetAdded(asset) callback
        ↓
Asset list refreshes with new item
```

### Generating Export

```
User navigates to Exports view
        ↓
Selects export type (PDF/CSV)
        ↓
Export handler:
  1. Fetches assets from storage
  2. Fetches rooms from storage
  3. Fetches vault data
        ↓
Generates document:
  • PDF: jsPDF + tables
  • CSV: Text formatting
        ↓
Triggers browser download
        ↓
Saves export record to storage
        ↓
Optional: onExportGenerated(data) callback
        ↓
User sees success message
```

---

## 🎯 Routing Flow

```
Initial Route
    ↓
┌─────────────────────┐
│   Onboarding?       │ (if first time)
└─────────────────────┘
    ↓
┌─────────────────────┐
│   Vault List        │
└─────────────────────┘
    ↓ (select vault)
┌─────────────────────┐
│  Vault Dashboard    │
└─────────────────────┘
    ↓
    ├── Capture → Photo session → Back to Dashboard
    ├── Assets → Asset list → Add/Edit → Back to Dashboard
    ├── Exports → Generate → Download → Back to Dashboard
    └── Settings → Privacy controls → Back to List

Bottom Navigation (Mobile):
  [Vault] [Capture] [Assets] [Exports]
    ↕        ↕         ↕         ↕
   All navigate within the same vault context
```

---

## 💾 Storage Layer

```
localStorage
  ├── reality_sync_vaults: Vault[]
  ├── reality_sync_rooms: Room[]
  ├── reality_sync_assets: Asset[]
  ├── reality_sync_sessions: CaptureSession[]
  ├── reality_sync_exports: ExportPacket[]
  └── reality_sync_onboarding: boolean

Each key stores JSON array:
  • Vaults contain metadata, lock info
  • Rooms link to vault IDs
  • Assets link to vault & room IDs
  • Sessions store photos as base64
  • Exports store generation metadata
```

### Storage Operations

```typescript
// Read
getVaults() → Vault[]
getVault(id) → Vault | undefined
getAssetsByVault(vaultId) → Asset[]

// Write
saveVault(vault) → void
saveAsset(asset) → void
saveRoom(room) → void

// Delete
deleteVault(id) → void (cascades to rooms, assets)
deleteAsset(id) → void
deleteAllData() → void

// Utility
exportAllData() → JSON string
importData(json) → void
```

---

## 🔌 Integration Points

### Pattern 1: Event Callbacks

```
RealitySync Component
        ↓
   User Action
        ↓
Internal Handler
        ↓
  Storage Update
        ↓
   State Update
        ↓
Callback Triggered → Your App Logic
        ↓
  (Analytics, Sync, Logging, etc.)
```

### Pattern 2: Shared Context

```
RealitySyncProvider
        ↓
   ┌────┴────┐
   │         │
Component A  Component B
   │         │
useRealitySync()
   │         │
Access same data
   │         │
Can trigger updates
that affect both
```

### Pattern 3: Programmatic Control

```
Your Component
        ↓
const { createVault } = useRealitySync()
        ↓
createVault({ ...data })
        ↓
Storage Updated
        ↓
RealitySync UI Auto-Updates
```

---

## 🎨 State Management

```
RealitySyncContext (Global State)
├── vaults: Vault[]
├── selectedVault: Vault | null
├── rooms: Room[]
├── assets: Asset[]
└── sessions: CaptureSession[]

Local Component State (UI only)
├── VaultListView
│   └── showCreateDialog: boolean
├── AssetsView
│   └── searchQuery: string
├── ExportsView
│   └── isExporting: boolean
└── CaptureView
    ├── step: string
    └── photos: string[]

Router State (Navigation)
├── currentRoute: RealitySyncRoute
├── history: RealitySyncRoute[]
└── currentIndex: number
```

---

## 🚀 Rendering Pipeline

```
App Start
    ↓
Check Onboarding Complete?
    ├─ No → Show OnboardingView
    └─ Yes → Show VaultListView
        ↓
User Selects Vault
        ↓
Navigate to VaultDashboard
        ↓
Render Bottom Nav (Mobile)
        ↓
User Can Navigate:
  • Capture → CaptureView
  • Assets → AssetsView
  • Exports → ExportsView
  • Settings → SettingsView
        ↓
Each View:
  1. useEffect → Load data from storage
  2. Render UI with loaded data
  3. Handle user interactions
  4. Update storage
  5. Trigger re-render
```

---

## 📱 Responsive Behavior

```
Mobile (< 768px)
├── Bottom Navigation (fixed)
├── Single column layouts
├── Full-width dialogs
└── Touch-optimized buttons

Desktop (≥ 768px)
├── No bottom navigation
├── Multi-column layouts
├── Modal dialogs (centered)
└── Hover states active
```

---

## 🔐 Security Architecture

```
User Data
    ↓
Browser localStorage
    ├── Not encrypted by default
    ├── Accessible via DevTools
    └── Domain-isolated
        ↓
Vault PIN Protection
    ├── Stored in vault object
    ├── Checked on vault access (UI only)
    └── Not cryptographically secure
        ↓
Recommendation for Production:
    ├── Add Web Crypto API encryption
    ├── Hash PINs before storage
    └── Add biometric authentication
```

---

## 🎯 Extension Points

Where you can customize/extend:

```
Storage Layer (lib/storage.ts)
    → Replace with Firebase, Supabase, etc.

Router (hooks/useRealitySyncRouter.ts)
    → Replace with React Router

Export (lib/export-pdf.ts)
    → Add custom templates, formats

Components (components/*.tsx)
    → Customize UI, add features

Context (contexts/RealitySyncContext.tsx)
    → Add custom state, methods

Types (types/index.ts)
    → Extend data model
```

---

## 📊 Performance Characteristics

```
Operation                 | Time        | Storage Impact
--------------------------|-------------|---------------
Create Vault              | <10ms       | ~500 bytes
Add Asset (no photos)     | <10ms       | ~300 bytes
Add Asset (with 3 photos) | 100-500ms   | ~150KB (base64)
Generate PDF (100 assets) | 1-3s        | N/A (download)
Export CSV (1000 assets)  | <100ms      | N/A (download)
Load Vault List           | <5ms        | N/A (read only)
Search Assets             | <10ms       | N/A (in-memory)
```

---

## 🔮 Future Architecture Considerations

### For Real-Time Sync

```
Add Event Emitter Layer:
  RealitySync → Events → WebSocket → Server
  Server → WebSocket → Events → All Clients
```

### For Multi-User

```
Add Permission Layer:
  User → Role → Permissions → Vault Access
  Implement RLS (Row Level Security)
```

### For Native Mobile

```
Same Context/Components → React Native
Replace:
  • localStorage → AsyncStorage
  • File inputs → react-native-image-picker
  • PDF → react-native-pdf
```

---

## ✅ Architecture Benefits

1. **Separation of Concerns** - UI, logic, storage separated
2. **Single Source of Truth** - Context manages all state
3. **Predictable Data Flow** - Unidirectional, event-driven
4. **Easy Integration** - Clean API surface
5. **Testable** - Pure functions, clear contracts
6. **Scalable** - Can add features without refactoring
7. **Maintainable** - Consistent patterns throughout

---

**This architecture supports seamless integration into any React application while maintaining independence and flexibility.**

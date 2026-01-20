# Reality Sync

> **Privacy-first property inventory and insurance claims management**  
> Time-stamped proof of what you own, built for seamless integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/react-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/typescript-ready-3178c6)

---

## 🎯 Overview

Reality Sync is a production-ready, modular React application for documenting and managing property inventory. Designed for:

- **Homeowners** - Document belongings for insurance claims
- **Renters** - Condition reports and move-in/out documentation
- **Property Managers** - Pre/post guest walkthroughs
- **Developers** - Embeddable inventory solution for larger platforms

## ✨ Key Features

### Core Functionality
- 🏠 **Multiple Vaults** - Organize by property (Home, Rental, Storage, Vehicle)
- 📸 **Photo Capture** - Room-by-room documentation with built-in camera
- 📦 **Asset Management** - Categorize, value, and track items with serial numbers
- 📄 **Export Reports** - Generate insurance claim PDFs and CSV exports
- 🔒 **PIN Protection** - Secure individual vaults with optional locks
- 💾 **Offline-First** - Works without internet, all data stored locally

### Privacy & Security
- ✅ Local-only storage by default
- ✅ No backend required
- ✅ User controls all data export/deletion
- ✅ Clear privacy indicators
- ✅ Sensitive content warnings

### Developer-Friendly
- 🎨 Modular component architecture
- 🔌 Easy integration with existing apps
- 📊 Event callbacks for analytics & sync
- 🎯 TypeScript support
- 🎨 Customizable themes
- 📱 Responsive mobile + desktop

---

## 🚀 Quick Start

### Standalone Usage

```tsx
import RealitySync from './src/app/components/RealitySync';

function App() {
  return <RealitySync />;
}
```

### With Callbacks

```tsx
<RealitySync
  onVaultCreated={(vault) => console.log('Created:', vault)}
  onAssetAdded={(asset) => analytics.track('asset_added')}
  onExportGenerated={(data) => cloudStorage.upload(data)}
/>
```

### Custom Initial Route

```tsx
// Skip onboarding
<RealitySync initialRoute={{ view: 'vault-list' }} />

// Deep link to vault
<RealitySync initialRoute={{ view: 'vault-dashboard', vaultId: 'vault_123' }} />
```

---

## 📚 Architecture

### Project Structure

```
src/app/
├── components/
│   ├── RealitySync.tsx          # Main embeddable component
│   ├── RealitySyncContent.tsx   # Navigation & routing
│   ├── OnboardingView.tsx       # Welcome flow
│   ├── VaultListView.tsx        # Vault management
│   ├── VaultDashboard.tsx       # Vault overview
│   ├── CaptureView.tsx          # Photo capture
│   ├── AssetsView.tsx           # Asset management
│   ├── ExportsView.tsx          # PDF/CSV generation
│   ├── SettingsView.tsx         # Privacy controls
│   └── ui/                      # Design system components
├── contexts/
│   └── RealitySyncContext.tsx   # State management
├── hooks/
│   └── useRealitySyncRouter.ts  # Custom routing
├── lib/
│   ├── storage.ts               # localStorage API
│   └── export-pdf.ts            # PDF generation
└── types/
    └── index.ts                 # TypeScript definitions

examples/
├── standalone-app.tsx           # Simple usage
├── integrated-app.tsx           # Multi-app dashboard
└── modal-integration.tsx        # Drawer/modal pattern
```

### Tech Stack

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components
- **jsPDF** - Client-side PDF generation
- **Sonner** - Toast notifications
- **Lucide React** - Icons

---

## 🔧 Integration Patterns

### Pattern 1: Shared Context

```tsx
import { RealitySyncProvider, useRealitySync } from './src/app';

function Stats() {
  const { vaults, assets } = useRealitySync();
  return <div>Assets: {assets.length}</div>;
}

function App() {
  return (
    <RealitySyncProvider>
      <Stats />
      <RealitySync />
    </RealitySyncProvider>
  );
}
```

### Pattern 2: Modal/Drawer

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent>
    <RealitySync 
      initialRoute={{ view: 'capture', vaultId: '123' }}
    />
  </SheetContent>
</Sheet>
```

### Pattern 3: Multi-App Dashboard

```tsx
<Tabs>
  <TabPanel value="inventory">
    <RealitySync />
  </TabPanel>
  <TabPanel value="calendar">
    <CalendarApp />
  </TabPanel>
</Tabs>
```

See [INTEGRATION.md](./INTEGRATION.md) for complete guide.

---

## 🎨 Components & API

### Main Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialRoute` | `RealitySyncRoute` | `'onboarding'` | Starting view |
| `onVaultCreated` | `(vault: Vault) => void` | - | Vault creation callback |
| `onAssetAdded` | `(asset: Asset) => void` | - | Asset addition callback |
| `onExportGenerated` | `(data: ExportPacket) => void` | - | Export callback |
| `onNavigate` | `(route: RealitySyncRoute) => void` | - | Navigation callback |
| `className` | `string` | `''` | Container class |
| `showToaster` | `boolean` | `true` | Show notifications |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Theme |

### Context API

```tsx
const {
  vaults,           // Vault[]
  selectedVault,    // Vault | null
  selectVault,      // (id: string) => void
  createVault,      // (vault: Vault) => void
  updateVault,      // (vault: Vault) => void
  deleteVault,      // (id: string) => void
  rooms,            // Room[]
  getRoomsByVault,  // (vaultId: string) => Room[]
  createRoom,       // (room: Room) => void
  assets,           // Asset[]
  getAssetsByVault, // (vaultId: string) => Asset[]
  createAsset,      // (asset: Asset) => void
  updateAsset,      // (asset: Asset) => void
  deleteAsset,      // (id: string) => void
  sessions,         // CaptureSession[]
  createSession,    // (session: CaptureSession) => void
  refresh,          // () => void
  exportAllData,    // () => string
  importData,       // (data: string) => void
  clearAllData,     // () => void
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

---

## 📦 Data Model

### Core Types

```tsx
interface Vault {
  id: string;
  name: string;
  type: 'Home' | 'Rental' | 'Storage' | 'Vehicle';
  address?: string;
  owner?: string;
  lockType: 'pin' | 'biometric' | 'none';
  pin?: string;
  createdAt: string;
  updatedAt: string;
  storageStatus: 'local_only' | 'synced';
}

interface Asset {
  id: string;
  vaultId: string;
  roomId: string;
  name: string;
  category: string;
  makeModel?: string;
  serialNumber?: string;
  valueRange: 'low' | 'medium' | 'high' | 'very_high';
  condition: string;
  photos: string[];
  receiptPhoto?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

See [src/app/types/index.ts](./src/app/types/index.ts) for complete types.

---

## 🎯 Use Cases

### 1. Homeowners Insurance
- Document all belongings with photos
- Organize by room
- Generate professional claim packets
- Export PDF with asset register

### 2. Rental Properties
- Pre/post move-in condition reports
- Timestamp evidence of existing damage
- Generate rental condition PDFs
- Protect security deposits

### 3. Property Management
- Multiple property tracking
- Guest check-in/out documentation
- Damage claim evidence
- Asset tracking across properties

### 4. Platform Integration
- Add to home management apps
- Embed in insurance platforms
- Integrate with property management systems
- White-label solution

---

## 🔐 Privacy & Security

### Data Storage
- **Local-first**: All data in browser localStorage (5-10MB limit)
- **No backend**: Zero server dependencies by default
- **User control**: Complete data export & deletion
- **Transparent**: Clear storage status indicators

### Security Notes
- ⚠️ Vault PINs stored unencrypted in localStorage
- ⚠️ Photos stored as base64 (larger file sizes)
- ⚠️ For production: implement proper encryption & auth
- ✅ No PII collection warnings built-in
- ✅ Sensitive content detection

---

## 🎨 Customization

### Theme

```tsx
<RealitySync theme="dark" />
```

### Custom Styling

```tsx
<RealitySync className="my-custom-container" />
```

### Replace Storage Backend

```tsx
// In your integration layer
import * as storage from './src/app/lib/storage';

// Override with your API
const customGetVaults = async () => {
  const res = await fetch('/api/vaults');
  return res.json();
};
```

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- localStorage support
- File input / camera access
- Modern CSS support

---

## ⚡ Performance

- **Lightweight**: ~200KB gzipped (with dependencies)
- **Fast**: Client-side rendering, no API calls
- **Offline**: Works without internet
- **Scalable**: Tested with 1000+ assets

**Limitations:**
- localStorage ~5-10MB (browser-dependent)
- Base64 photos increase storage ~33%
- Large PDFs (100+ assets) may be slow

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📖 Examples

Check the `/examples` directory:

1. **standalone-app.tsx** - Simple standalone usage
2. **integrated-app.tsx** - Multi-app dashboard with shared state
3. **modal-integration.tsx** - Drawer/modal pattern

---

## 🤝 Contributing

This is a complete, production-ready application. For customization:

1. Fork the repository
2. Modify components in `src/app/components/`
3. Update types in `src/app/types/`
4. Extend storage in `src/app/lib/storage.ts`

---

## 📄 License

MIT License - feel free to use in your projects.

---

## 🙏 Credits

Built with:
- React + TypeScript
- Tailwind CSS v4
- Radix UI Components
- jsPDF for PDF generation
- Lucide Icons

---

## 📞 Support

For integration help, see [INTEGRATION.md](./INTEGRATION.md)

For questions or issues, check the inline documentation in:
- `src/app/components/RealitySync.tsx`
- `src/app/contexts/RealitySyncContext.tsx`
- `src/app/index.ts`

---

**Built with ❤️ for seamless integration into any React application**

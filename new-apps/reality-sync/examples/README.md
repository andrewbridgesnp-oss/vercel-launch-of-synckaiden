# Reality Sync - Examples

This directory contains working examples of how to integrate Reality Sync into your applications.

## Examples Overview

### 1. **standalone-app.tsx** 
*Simplest possible usage*

```tsx
import RealitySync from '../src/app/components/RealitySync';

export default function App() {
  return <RealitySync />;
}
```

**When to use**: 
- Building a dedicated inventory app
- Need full-screen experience
- Simplest integration

---

### 2. **integrated-app.tsx**
*Multi-app dashboard with shared state*

Shows how to:
- Use tabs to switch between apps
- Share data across apps using context
- Display stats from Reality Sync in other apps
- Integrate with Calendar, Tasks, etc.

**When to use**:
- Building a multi-app platform
- Need shared state across apps
- Dashboard-style interface

---

### 3. **modal-integration.tsx**
*Reality Sync in a drawer/sheet*

Shows how to:
- Open Reality Sync in a slide-out drawer
- Trigger from floating action buttons
- Deep link to specific views
- Close on certain actions

**When to use**:
- Reality Sync is a secondary feature
- Want non-intrusive access
- Mobile-first design

---

### 4. **api-usage.tsx**
*Programmatic control & data access*

Shows how to:
- Access data programmatically
- Create vaults/assets from code
- Build custom UIs around the data
- Export and analyze data

**When to use**:
- Need custom UI/UX
- Building admin dashboards
- Data analysis features
- Automated workflows

---

## Running Examples

### Option 1: Replace your App.tsx

```tsx
// In your src/app/App.tsx
export { default } from '../examples/integrated-app';
```

### Option 2: Import and use

```tsx
import IntegratedApp from './examples/integrated-app';

function Root() {
  return <IntegratedApp />;
}
```

### Option 3: Copy and customize

Copy any example file to your project and modify as needed.

---

## Comparison Table

| Feature | Standalone | Integrated | Modal | API |
|---------|-----------|------------|-------|-----|
| Complexity | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Code lines | ~5 | ~150 | ~80 | ~250 |
| Use cases | Simple apps | Platforms | Side panels | Custom UIs |
| Customization | Low | High | Medium | Very High |

---

## Quick Modifications

### Change Initial View

```tsx
<RealitySync 
  initialRoute={{ view: 'vault-list' }}  // Skip onboarding
/>
```

### Add Analytics

```tsx
<RealitySync 
  onVaultCreated={(vault) => analytics.track('vault_created')}
  onAssetAdded={(asset) => analytics.track('asset_added')}
/>
```

### Custom Styling

```tsx
<RealitySync 
  className="max-w-6xl mx-auto shadow-lg"
  theme="dark"
/>
```

---

## Common Patterns

### Pattern: Quick Capture Button

```tsx
function QuickCapture() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Quick Capture
      </Button>
      
      <Dialog open={open}>
        <RealitySync 
          initialRoute={{ view: 'capture', vaultId: 'default' }}
        />
      </Dialog>
    </>
  );
}
```

### Pattern: Stats Widget

```tsx
function InventoryWidget() {
  const { vaults, assets } = useRealitySync();
  
  return (
    <Card>
      <h3>Inventory</h3>
      <p>{vaults.length} vaults</p>
      <p>{assets.length} assets</p>
    </Card>
  );
}
```

### Pattern: Auto-Export

```tsx
<RealitySync
  onExportGenerated={async (data) => {
    await uploadToCloud(data);
    await emailToInsurance(data);
    showNotification('Exported & sent!');
  }}
/>
```

---

## Troubleshooting Examples

### Example not working?

1. Make sure all dependencies are installed
2. Check that the path to Reality Sync is correct
3. Ensure `RealitySyncProvider` wraps the app if using context
4. Check browser console for errors

### Data not persisting?

- Examples use localStorage - check browser settings
- Incognito mode may not persist data
- Check Storage quota (DevTools → Application)

### Types not resolving?

```tsx
// Import types explicitly
import type { Vault, Asset } from '../src/app/types';
```

---

## Next Steps

1. **Try the examples** - Run each one to see different patterns
2. **Mix and match** - Combine patterns for your use case
3. **Read the docs** - See [INTEGRATION.md](../INTEGRATION.md) for more
4. **Customize** - Modify examples to fit your needs

---

## Need Help?

- Check [QUICKSTART.md](../QUICKSTART.md) for basics
- See [INTEGRATION.md](../INTEGRATION.md) for advanced topics
- Review [README.md](../README.md) for full documentation
- Look at component source code for implementation details

---

**Happy coding! 🚀**

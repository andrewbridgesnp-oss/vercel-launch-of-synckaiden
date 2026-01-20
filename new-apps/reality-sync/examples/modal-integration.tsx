/**
 * Example 3: Modal/Drawer Integration
 * 
 * Shows how to use Reality Sync in a modal or slide-out drawer
 */

import { useState } from 'react';
import { RealitySyncProvider, RealitySync } from '../src/app';
import { Button } from '../src/app/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../src/app/components/ui/sheet';
import { Package, Plus } from 'lucide-react';

// Your main app content
function MainAppContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-4">My Main Application</h1>
        <p className="text-neutral-600">
          This is your primary application. Use the "Open Inventory" button to access
          Reality Sync in a side panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 border border-neutral-200">
            <h3 className="text-lg mb-2">Feature {i}</h3>
            <p className="text-sm text-neutral-600">
              Your main app content goes here
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModalIntegrationExample() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [initialRoute, setInitialRoute] = useState<any>({ view: 'vault-list' });

  return (
    <RealitySyncProvider>
      <div className="min-h-screen bg-neutral-50">
        {/* Fixed action button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg">
                <Package className="w-5 h-5 mr-2" />
                Open Inventory
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-hidden">
              <div className="h-full overflow-auto">
                <RealitySync
                  initialRoute={initialRoute}
                  onNavigate={(route) => {
                    console.log('Navigation:', route);
                    // Close drawer on certain actions
                    if (route.view === 'vault-list') {
                      // Optional: close on back to list
                      // setDrawerOpen(false);
                    }
                  }}
                  onVaultCreated={(vault) => {
                    console.log('Vault created:', vault);
                    // Navigate to the new vault
                    setInitialRoute({ view: 'vault-dashboard', vaultId: vault.id });
                  }}
                  showToaster={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick action: Add asset directly */}
        <div className="fixed bottom-8 left-8 z-50">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full shadow-lg bg-white"
            onClick={() => {
              // You can deep link to specific views
              setInitialRoute({ view: 'vault-list' });
              setDrawerOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Quick Capture
          </Button>
        </div>

        {/* Main app */}
        <MainAppContent />
      </div>
    </RealitySyncProvider>
  );
}

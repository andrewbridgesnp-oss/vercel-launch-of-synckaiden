import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🔄 Repricing 21 low-cost apps to $0.99/mo...\n');

// Apps that don't consume tokens/API credits (static, data management, forms, connectors)
const lowCostApps = [
  'pantry-inventory',          // Simple inventory tracking
  'template-library',          // Static templates
  'professional-directory',    // Static directory
  'new-business-guide',        // Static guide content
  'feedback-manager',          // Form-based feedback
  'scheduler-pro',             // Calendar/scheduling (no AI)
  'product-catalog',           // Product listings
  'shopify-integration',       // Passive connector
  'integrations-hub',          // Integration management
  'team-hub',                  // Team directory/profiles
  'contract-manager',          // Document storage
  'order-management',          // Order tracking
  'expense-management',        // Expense logging
  'proposals-quotes',          // Template-based proposals
  'live-chat-support',         // Chat interface (no AI)
  'security-scanner',          // Security checks
  'analytics-dashboard',       // Data visualization
  'cost-reduction-analyzer',   // Cost analysis tool
  'business-credit',           // Credit tracking
  'virtual-notary',            // Document verification
  'wheres-my-tribe',           // Community directory
];

try {
  console.log(`Updating prices for ${lowCostApps.length} apps...\n`);
  
  for (const slug of lowCostApps) {
    // Get product ID
    const [products] = await connection.execute(
      'SELECT id, name FROM appRegistry WHERE slug = ?',
      [slug]
    );
    
    if (products.length > 0) {
      const product = products[0];
      
      // Update price to $0.99 (99 cents)
      await connection.execute(
        'UPDATE prices SET amount = ? WHERE productId = ?',
        [99, product.id]
      );
      
      console.log(`✅ Updated: ${product.name} → $0.99/mo`);
    } else {
      console.log(`⚠️  Not found: ${slug}`);
    }
  }
  
  console.log(`\n✨ Successfully repriced ${lowCostApps.length} apps to $0.99/mo!`);
  console.log('\n💡 These apps have minimal/no API costs and generate pure profit.');
  
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}

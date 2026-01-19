import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Adding 8-App Bundle...\n');

try {
  // Insert 8-App Bundle Product
  const [bundleResult] = await connection.execute(`
    INSERT INTO products (name, slug, description, type, status, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    'Select 8 Bundle',
    'select-8-bundle',
    'Choose any 8 apps from our complete catalog. Perfect for focused business needs at a fraction of the cost.',
    'bundle',
    'active',
    JSON.stringify({ featured: true, badge: 'POPULAR', appsIncluded: 8, customizable: true })
  ]);
  const bundleId = bundleResult.insertId;

  // Insert Bundle Price
  await connection.execute(
    'INSERT INTO prices (productId, amount, currency, `interval`, active, stripePriceId) VALUES (?, ?, ?, ?, ?, ?)',
    [bundleId, 3999, 'USD', 'month', true, 'price_select_8_bundle_monthly']
  );

  console.log('✅ Created: Select 8 Bundle ($39.99/mo)');
  console.log('✨ 8-App Bundle added successfully!');
  
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Check products
const products = await connection.query('SELECT id, slug, name, type, category, status FROM products LIMIT 20');
console.log('\n=== PRODUCTS (first 20) ===');
console.log(JSON.stringify(products[0], null, 2));

// Check prices
const prices = await connection.query('SELECT p.id, p.amount, p.currency, p.interval, prod.name FROM prices p JOIN products prod ON p.productId = prod.id LIMIT 20');
console.log('\n=== PRICES (first 20) ===');
console.log(JSON.stringify(prices[0], null, 2));

// Count total apps
const appCount = await connection.query('SELECT COUNT(*) as count FROM products WHERE type = "app"');
console.log('\n=== TOTAL APPS ===');
console.log(JSON.stringify(appCount[0], null, 2));

await connection.end();

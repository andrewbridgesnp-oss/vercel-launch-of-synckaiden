const axios = require('axios');
const fs = require('fs');

const PRINTFUL_API_KEY = 'FYgWKZa4peRMlk3fydg44HdQqliyoOG2YGdJ3GMZ';
const PRINTFUL_API = 'https://api.printful.com';

async function getAllProducts() {
  const allProducts = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await axios.get(
      `${PRINTFUL_API}/store/products?offset=${offset}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        }
      }
    );
    
    const products = response.data.result;
    if (!products || products.length === 0) break;
    
    allProducts.push(...products);
    offset += limit;
    
    if (products.length < limit) break;
  }
  
  return allProducts;
}

async function getProductVariants(productId) {
  try {
    const response = await axios.get(
      `${PRINTFUL_API}/store/products/${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        }
      }
    );
    
    return response.data.result.sync_variants || [];
  } catch (error) {
    console.error(`Error fetching variants for product ${productId}:`, error.message);
    return [];
  }
}

async function generateMapping() {
  console.log('🔍 Fetching all Printful products...\n');
  
  const products = await getAllProducts();
  console.log(`✅ Found ${products.length} products\n`);
  
  const mapping = {};
  
  for (const product of products) {
    console.log(`📦 Processing: ${product.name}`);
    
    // Extract design name and product type from Printful product name
    // Format: "Design Name - Product Type"
    const match = product.name.match(/^(.+?)\s*-\s*(T-Shirt|Hoodie|Sticker)$/);
    if (!match) {
      console.log(`⚠️  Skipping ${product.name} - doesn't match expected format`);
      continue;
    }
    
    const [, designName, productType] = match;
    
    // Get variants for this product
    const variants = await getProductVariants(product.id);
    console.log(`   Found ${variants.length} variants`);
    
    // Create mapping key
    const key = `${designName.trim()}|${productType}`;
    
    if (!mapping[key]) {
      mapping[key] = {
        designName: designName.trim(),
        productType,
        printfulProductId: product.id,
        variants: {}
      };
    }
    
    // Map each variant by size/color
    for (const variant of variants) {
      const size = variant.size || 'One Size';
      const color = variant.color || 'Default';
      const variantKey = `${size}|${color}`;
      
      mapping[key].variants[variantKey] = {
        sync_variant_id: variant.id,
        size,
        color,
        retail_price: variant.retail_price,
        sku: variant.sku
      };
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Save mapping to file
  const outputPath = './printful-product-mapping.json';
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  
  console.log(`\n✨ Mapping generated successfully!`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`📊 Total mapped products: ${Object.keys(mapping).length}`);
  
  // Print summary
  const tshirts = Object.values(mapping).filter(p => p.productType === 'T-Shirt').length;
  const hoodies = Object.values(mapping).filter(p => p.productType === 'Hoodie').length;
  const stickers = Object.values(mapping).filter(p => p.productType === 'Sticker').length;
  
  console.log(`\n📦 Product Breakdown:`);
  console.log(`   👕 T-Shirts: ${tshirts}`);
  console.log(`   🧥 Hoodies: ${hoodies}`);
  console.log(`   🏷️  Stickers: ${stickers}`);
}

generateMapping().catch(console.error);

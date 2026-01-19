import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: "Rent Free: Self-Love Tee",
    slug: "rent-free-self-love",
    description: "Live rent-free in your own mind with this empowering self-love statement piece. Pink and purple design celebrating mental freedom.",
    price: 29.99,
    category: "mental-wellness",
    image: "/products/BOUGIE.png",
    printful_product_id: "rent-free-1",
    sku: "BOU-RF-001"
  },
  {
    name: "Ohio? Nah, I Choose Peace",
    slug: "ohio-peace",
    description: "Choose peace over chaos with this serene dove design. Perfect for those who value tranquility and positive vibes.",
    price: 29.99,
    category: "lifestyle",
    image: "/products/BOUGIE.png",
    printful_product_id: "peace-1",
    sku: "BOU-PC-001"
  },
  {
    name: "Fanum Tax: The Negativity Edition",
    slug: "fanum-tax-negativity",
    description: "Tax the negativity out of your life. Bold statement piece with golden accents for those who refuse bad energy.",
    price: 32.99,
    category: "empowerment",
    image: "/products/BOUGIE.png",
    printful_product_id: "fanum-1",
    sku: "BOU-FT-001"
  },
  {
    name: "NPC Energy? Nah",
    slug: "npc-energy",
    description: "Break free from NPC energy with this futuristic cyberpunk design. For main characters only.",
    price: 34.99,
    category: "empowerment",
    image: "/products/BOUGIE.png",
    printful_product_id: "npc-1",
    sku: "BOU-NPC-001"
  },
  {
    name: "W Friend, L Bully",
    slug: "w-friend-l-bully",
    description: "Celebrate real friendships and call out toxic behavior. Bold red and blue design with thumbs up/down.",
    price: 29.99,
    category: "social",
    image: "/products/BOUGIE.png",
    printful_product_id: "wfriend-1",
    sku: "BOU-WF-001"
  },
  {
    name: "Lowkey Struggling, Highkey Surviving",
    slug: "lowkey-struggling",
    description: "Real talk about the struggle. Golden grunge design for those keeping it 100 about life's challenges.",
    price: 31.99,
    category: "mental-wellness",
    image: "/products/BOUGIE.png",
    printful_product_id: "lowkey-1",
    sku: "BOU-LS-001"
  },
  {
    name: "Unalive The Stigma",
    slug: "unalive-stigma",
    description: "Mental health awareness tee. Breaking down stigmas with bold red design and powerful messaging.",
    price: 32.99,
    category: "mental-wellness",
    image: "/products/BOUGIE2.png",
    printful_product_id: "stigma-1",
    sku: "BOU-ST-001"
  },
  {
    name: "Hits Different When You're Kind",
    slug: "hits-different-kind",
    description: "Kindness hits different. Colorful, joyful design celebrating compassion and positive energy.",
    price: 29.99,
    category: "lifestyle",
    image: "/products/BOUGIE2.png",
    printful_product_id: "kind-1",
    sku: "BOU-HD-001"
  },
  {
    name: "KAiden Official Logo Tee",
    slug: "kaiden-logo",
    description: "Rep the KAiden brand with this sleek futuristic logo design. Premium quality, modern aesthetic.",
    price: 34.99,
    category: "brand",
    image: "/products/BOUGIE2.png",
    printful_product_id: "kaiden-1",
    sku: "BOU-KA-001"
  },
  {
    name: "Bougie Boutique Signature",
    slug: "bougie-signature",
    description: "The signature Bougie Boutique logo tee. Elegant black and gold design with diamond emblem.",
    price: 36.99,
    category: "brand",
    image: "/products/BOUGIE2.png",
    printful_product_id: "bougie-1",
    sku: "BOU-BB-001"
  },
  {
    name: "Mental Health Check Tee",
    slug: "mental-health-check",
    description: "Normalize mental health check-ins. Green checklist design promoting wellness and self-care.",
    price: 29.99,
    category: "mental-wellness",
    image: "/products/BOUGIE2.png",
    printful_product_id: "mental-1",
    sku: "BOU-MH-001"
  },
  {
    name: "Delulu? Nah Hopeful",
    slug: "delulu-hopeful",
    description: "Reframe delulu as hopeful. Purple crystal ball design celebrating optimism and manifestation.",
    price: 31.99,
    category: "empowerment",
    image: "/products/BOUGIE2.png",
    printful_product_id: "delulu-1",
    sku: "BOU-DL-001"
  },
  {
    name: "NPC Energy? (Green Edition)",
    slug: "npc-energy-green",
    description: "Alternative colorway of the NPC Energy design. Green cyberpunk aesthetic for main character energy.",
    price: 34.99,
    category: "empowerment",
    image: "/products/BOUGIE2.png",
    printful_product_id: "npc-2",
    sku: "BOU-NPC-002"
  },
  {
    name: "Ate Is Left, No Crumbs",
    slug: "ate-no-crumbs",
    description: "You ate and left no crumbs. Golden crown design celebrating excellence and confidence.",
    price: 32.99,
    category: "empowerment",
    image: "/products/BOUGIE2.png",
    printful_product_id: "ate-1",
    sku: "BOU-AT-001"
  },
  {
    name: "Fele Worth",
    slug: "fele-worth",
    description: "Know your worth. Golden handshake design representing value, respect, and self-worth.",
    price: 31.99,
    category: "empowerment",
    image: "/products/BOUGIE2.png",
    printful_product_id: "fele-1",
    sku: "BOU-FW-001"
  }
];

async function seedBoutiqueProducts() {
  let connection;
  
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('🛍️ Seeding Bougie Boutique products...');
    
    for (const product of products) {
      const features = JSON.stringify([
        "Premium quality fabric",
        "Unisex sizing",
        "Eco-friendly printing",
        "Ships within 3-5 days",
        "100% cotton",
        "Machine washable"
      ]);
      
      const metadata = JSON.stringify({
        icon: "👕",
        printful_id: product.printful_product_id,
        sku: product.sku,
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        colors: ["Black", "White", "Navy"]
      });
      
      // Insert product
      const [productResult] = await connection.execute(
        `INSERT INTO products (name, slug, description, type, category, status, features, metadata, image)
         VALUES (?, ?, ?, 'digital_product', ?, 'active', ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         description = VALUES(description),
         category = VALUES(category),
         features = VALUES(features),
         metadata = VALUES(metadata),
         image = VALUES(image)`,
        [
          product.name,
          product.slug,
          product.description,
          product.category,
          features,
          metadata,
          product.image
        ]
      );
      
      // Get product ID
      const productId = productResult.insertId || (await connection.execute(
        'SELECT id FROM products WHERE slug = ?',
        [product.slug]
      ))[0][0].id;
      
      // Insert price (amount is in cents)
      const amountInCents = Math.round(product.price * 100);
      await connection.execute(
        `INSERT INTO prices (productId, amount, currency, \`interval\`, active)
         VALUES (?, ?, 'USD', 'one_time', 1)
         ON DUPLICATE KEY UPDATE
         amount = VALUES(amount)`,
        [productId, amountInCents]
      );
      
      console.log(`✅ Added: ${product.name} ($${product.price})`);
    }
    
    console.log(`\n🎉 Successfully seeded ${products.length} Bougie Boutique products!`);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedBoutiqueProducts();

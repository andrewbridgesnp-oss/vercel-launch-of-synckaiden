const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PRINTFUL_API_KEY = 'FYgWKZa4peRMlk3fydg44HdQqliyoOG2YGdJ3GMZ';
const PRINTFUL_API = 'https://api.printful.com';

const designs = [
  { id: 1, name: "NPC Energy? I Think Not", file: "cIZb9ZwmabiXzdGXrtD79I_1768858506130_na1fn_L2hvbWUvdWJ1bnR1L2xvZ29zL25wY19lbmVyZ3lfaV90aGlua19ub3RfbG9nbw-Copy.webp" },
  { id: 2, name: "Ohio? Nah, I Choose Peace", file: "ohio-Copy.webp" },
  { id: 3, name: "You're Valid, Bestie", file: "youre_valid_bestie_logo.png" },
  { id: 4, name: "Era of Healing", file: "era_healing_logo.png" },
  { id: 5, name: "W Friend, L Bully", file: "w_friend_l_bully_logo.png" },
  { id: 6, name: "Bussin' Boundaries", file: "bussin_boundaries_logo.png" },
  { id: 7, name: "Ate and Left No Crumbs", file: "ate_and_left_no_crumbs_logo.png" },
  { id: 8, name: "Be the Reason Someone Smiles", file: "be_the_reason_someone_smiles_logo.png" },
  { id: 9, name: "Main Character Energy", file: "main_character_energy_logo.png" },
  { id: 10, name: "It's Giving Kindness", file: "its_giving_kindness_logo.png" },
  { id: 11, name: "Slay the Hate Away", file: "slay_the_hate_away_logo.png" },
  { id: 12, name: "Understood the Assignment", file: "understood_the_assignment_logo-Copy.png" },
  { id: 13, name: "Fanum Tax the Negativity", file: "fanum_tax_the_negativity_logo-Copy.png" },
  { id: 14, name: "Caught in 4K Being Kind", file: "caught_in_4k_being_kind_logo.png" },
  { id: 15, name: "Rizz with Respect", file: "rizz_with_respect_logo.png" },
  { id: 16, name: "Delulu? Nah, Hopeful", file: "delulu_nah_hopeful_logo.png" },
  { id: 17, name: "Hits Different When You're Kind", file: "hits_different_when_youre_kind_logo-Copy.png" },
  { id: 18, name: "Sigma Kindness Grindset", file: "sigma_kindness_grindset_logo-Copy.png" },
  { id: 19, name: "Rent Free Self-Love", file: "rent_free_self_love_logo.png" },
  { id: 20, name: "Lowkey Struggling, Highkey Surviving", file: "lowkey_struggling_highkey_surviving_logo.png" },
];

// Printful product IDs
const productTypes = [
  { type: "T-Shirt", printfulId: 71, variantId: 4012 }, // Bella+Canvas 3001 Unisex
  { type: "Hoodie", printfulId: 146, variantId: 4320 }, // Gildan 18500 Unisex
  { type: "Hat", printfulId: 206, variantId: 7078 }, // Yupoong 6245CM Classic Snapback
  { type: "Sticker", printfulId: 229, variantId: 7413 }, // Kiss Cut Stickers 3x3"
];

async function uploadFileToPrintful(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    
    const response = await axios.post(
      `${PRINTFUL_API}/files`,
      {
        type: 'default',
        filename: path.basename(filePath),
        file: base64
      },
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.result.id;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.response?.data || error.message);
    return null;
  }
}

async function createPrintfulProduct(design, productType, fileId) {
  try {
    const response = await axios.post(
      `${PRINTFUL_API}/store/products`,
      {
        sync_product: {
          name: `${design.name} - ${productType.type}`,
          thumbnail: `https://vercel-launch-of-synckaiden.vercel.app/boutique-designs/${design.file}`
        },
        sync_variants: [
          {
            retail_price: productType.type === 'T-Shirt' ? '24.99' :
                         productType.type === 'Hoodie' ? '44.99' :
                         productType.type === 'Hat' ? '19.99' : '4.99',
            variant_id: productType.variantId,
            files: [
              {
                id: fileId,
                type: 'default',
                position: { area_width: 1800, area_height: 2400, width: 1800, height: 1800, top: 300, left: 0 }
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Created: ${design.name} - ${productType.type}`);
    return response.data.result.id;
  } catch (error) {
    console.error(`❌ Error creating ${design.name} - ${productType.type}:`, error.response?.data || error.message);
    return null;
  }
}

async function syncAllProducts() {
  console.log('🚀 Starting Printful sync...\n');
  
  for (const design of designs) {
    console.log(`\n📦 Processing: ${design.name}`);
    
    // Upload design file
    const filePath = path.join(__dirname, 'public/boutique-designs', design.file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    const fileId = await uploadFileToPrintful(filePath);
    if (!fileId) {
      console.log(`⚠️  Skipping ${design.name} - upload failed`);
      continue;
    }
    
    console.log(`   Uploaded file ID: ${fileId}`);
    
    // Create products for each type
    for (const productType of productTypes) {
      await createPrintfulProduct(design, productType, fileId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit: 1 req/sec
    }
  }
  
  console.log('\n\n✨ Printful sync complete!');
  console.log(`📊 Total products created: ${designs.length * productTypes.length}`);
}

syncAllProducts().catch(console.error);

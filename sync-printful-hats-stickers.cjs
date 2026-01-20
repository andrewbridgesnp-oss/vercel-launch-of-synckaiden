const axios = require('axios');

const PRINTFUL_API_KEY = 'FYgWKZa4peRMlk3fydg44HdQqliyoOG2YGdJ3GMZ';
const PRINTFUL_API = 'https://api.printful.com';
const BASE_URL = 'https://vercel-launch-of-synckaiden.vercel.app';

// All 20 designs (using PNG files)
const designs = [
  { id: 1, name: "NPC Energy? I Think Not", file: "cIZb9ZwmabiXzdGXrtD79I_1768858506130_na1fn_L2hvbWUvdWJ1bnR1L2xvZ29zL25wY19lbmVyZ3lfaV90aGlua19ub3RfbG9nbw-Copy.png" },
  { id: 2, name: "Ohio? Nah, I Choose Peace", file: "ohio-Copy.png" },
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

// Product types: Hats and Stickers
const productTypes = [
  { 
    type: "Hat", 
    printfulId: 638, 
    variantIds: [16244, 16245], // Black and White Dad Hat
    price: '19.99'
  },
  { 
    type: "Sticker", 
    printfulId: 358, 
    variantIds: [10163], // 3"×3" Kiss-Cut Sticker
    price: '4.99'
  },
];

async function uploadFileToPrintful(fileUrl) {
  try {
    const response = await axios.post(
      `${PRINTFUL_API}/files`,
      {
        url: fileUrl,
        type: 'default',
        visible: true
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
    console.error(`❌ Error uploading ${fileUrl}:`, error.response?.data || error.message);
    return null;
  }
}

async function createPrintfulProduct(design, productType, fileId) {
  try {
    // Create sync variants for all colors/sizes
    const syncVariants = productType.variantIds.map(variantId => ({
      retail_price: productType.price,
      variant_id: variantId,
      files: [
        {
          id: fileId
        }
      ]
    }));

    const response = await axios.post(
      `${PRINTFUL_API}/store/products`,
      {
        sync_product: {
          name: `${design.name} - ${productType.type}`,
          thumbnail: `${BASE_URL}/boutique-designs/${design.file}`
        },
        sync_variants: syncVariants
      },
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Created: ${design.name} - ${productType.type} (${syncVariants.length} variants)`);
    return response.data.result.id;
  } catch (error) {
    console.error(`❌ Error creating ${design.name} - ${productType.type}:`, error.response?.data?.result || error.message);
    return null;
  }
}

async function syncHatsAndStickers() {
  console.log('🧢 Starting Printful sync for HATS & STICKERS...\n');
  console.log(`📦 Total designs: ${designs.length}`);
  console.log(`👕 Product types: ${productTypes.map(p => p.type).join(', ')}`);
  console.log(`📊 Total products to create: ${designs.length * productTypes.length}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const design of designs) {
    console.log(`\n📦 Processing: ${design.name}`);
    
    // Upload design file using public URL
    const fileUrl = `${BASE_URL}/boutique-designs/${design.file}`;
    console.log(`   Uploading from: ${fileUrl}`);
    
    const fileId = await uploadFileToPrintful(fileUrl);
    if (!fileId) {
      console.log(`⚠️  Skipping ${design.name} - upload failed`);
      failCount += productTypes.length;
      continue;
    }
    
    console.log(`   ✅ File uploaded, ID: ${fileId}`);
    
    // Create products for Hats and Stickers
    for (const productType of productTypes) {
      const result = await createPrintfulProduct(design, productType, fileId);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limit: 1 req/2sec
    }
  }
  
  console.log('\n\n✨ Hats & Stickers sync complete!');
  console.log(`✅ Successfully created: ${successCount} products`);
  console.log(`❌ Failed: ${failCount} products`);
  console.log(`📊 Success rate: ${Math.round((successCount / (successCount + failCount)) * 100)}%`);
  console.log('\n📋 Summary:');
  console.log(`   🧢 Hats: ${designs.length} designs × 2 colors = ${designs.length * 2} products`);
  console.log(`   🏷️  Stickers: ${designs.length} designs × 1 size = ${designs.length} products`);
}

syncHatsAndStickers().catch(console.error);

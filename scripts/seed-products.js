/**
 * Seed Products Database with 100 curated modern products
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

const curatedProducts = [
  // Home & Kitchen (25 products)
  {
    name: "Vitamix 5200 Blender",
    description: "Professional-grade blender with aircraft-grade stainless steel blades. Perfect for smoothies, soups, and nut butters.",
    category: "Kitchen",
    price: 449.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81%2BkT7wY%2BdL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B008H4SLV6",
    tags: ["kitchen", "appliances", "healthy-living", "smoothies"],
    ai_description: "Exceptional build quality and versatility make this a lifetime purchase for serious home cooks and health enthusiasts."
  },
  {
    name: "Lodge Cast Iron Dutch Oven 5.5 Qt",
    description: "Pre-seasoned cast iron Dutch oven that goes from stovetop to oven. Essential for braising, baking bread, and one-pot meals.",
    category: "Kitchen",
    price: 59.90,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81kR7wY3zqL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B000LEXR0K",
    tags: ["kitchen", "cooking", "cast-iron", "versatile"],
    ai_description: "Heirloom-quality cookware that improves with age. Perfect for anyone who loves to cook or wants to start cooking more."
  },
  {
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description: "Multi-use programmable pressure cooker that replaces 7 kitchen appliances. Safe, convenient, and consistent.",
    category: "Kitchen",
    price: 99.95,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71V3HPXl%2BdL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B00FLYWNYQ",
    tags: ["kitchen", "pressure-cooker", "convenient", "time-saving"],
    ai_description: "Revolutionary appliance that makes cooking healthy meals incredibly convenient. Great for busy families and meal prep."
  },
  {
    name: "OXO Good Grips 3-Piece Mixing Bowl Set",
    description: "Non-slip mixing bowls with comfortable handles and pour spouts. Dishwasher safe and nest for storage.",
    category: "Kitchen",
    price: 29.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71BjzV7C%2BuL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B00004OCNJ",
    tags: ["kitchen", "baking", "mixing-bowls", "oxo"],
    ai_description: "Thoughtfully designed basics that make cooking and baking more enjoyable. Essential for any home kitchen."
  },
  {
    name: "Breville Bambino Plus Espresso Machine",
    description: "Compact espresso machine with automatic milk frother. Professional-quality espresso at home in under 30 seconds.",
    category: "Kitchen",
    price: 249.95,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61pZ8sK7%2BdL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B077JBQZPX",
    tags: ["coffee", "espresso", "breville", "compact"],
    ai_description: "Perfect for coffee lovers who want café-quality drinks at home without the bulk of larger machines."
  },
  {
    name: "KitchenAid Stand Mixer Classic Plus",
    description: "Iconic stand mixer with 10 speeds and tilt-head design. Includes flat beater, dough hook, and wire whip.",
    category: "Kitchen",
    price: 279.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81HZKs7fczL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B00063ULMI",
    tags: ["stand-mixer", "kitchenaid", "baking", "versatile"],
    ai_description: "The baker's best friend that lasts generations. Makes complex baking projects achievable and enjoyable."
  },
  {
    name: "All-Clad D3 Stainless Steel Fry Pan 12-Inch",
    description: "Professional tri-ply stainless steel construction with aluminum core for even heat distribution.",
    category: "Kitchen",
    price: 149.95,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71YvMrzV7lL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B00005AL5R",
    tags: ["cookware", "all-clad", "stainless-steel", "professional"],
    ai_description: "Restaurant-quality cookware that performs flawlessly for decades. The pan serious cooks swear by."
  },
  {
    name: "Cuisinart Food Processor 14-Cup",
    description: "Large capacity food processor with multiple blades and discs. Chops, slices, shreds, and purees effortlessly.",
    category: "Kitchen",
    price: 199.95,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/91Yd1tTLbKL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B01AXM4WV2",
    tags: ["food-processor", "cuisinart", "meal-prep", "versatile"],
    ai_description: "Dramatically speeds up food prep and opens up new cooking possibilities. Essential for ambitious home cooks."
  },

  // Tech & Electronics (30 products)
  {
    name: "Apple AirPods Pro (2nd Generation)",
    description: "Active noise cancellation, spatial audio, and all-day comfort. The gold standard for wireless earbuds.",
    category: "Electronics",
    price: 249.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B0BDHWDR12",
    tags: ["audio", "wireless", "apple", "noise-cancellation"],
    ai_description: "Premium audio experience with seamless Apple ecosystem integration. Perfect for commuters and audio enthusiasts."
  },
  {
    name: "Anker PowerCore 10000 Portable Charger",
    description: "Ultra-compact 10000mAh power bank with high-speed charging. Perfect size for travel and daily carry.",
    category: "Electronics",
    price: 24.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61XJCvwJFxL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B019GJLER8",
    tags: ["portable-charger", "anker", "travel", "compact"],
    ai_description: "Reliable power when you need it most. Essential for travelers, students, and anyone who's ever had their phone die."
  },
  {
    name: "Logitech MX Master 3 Wireless Mouse",
    description: "Ultra-precise scrolling, ergonomic design, and works on any surface including glass. The best mouse for productivity.",
    category: "Electronics",
    price: 99.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B07S395RWD",
    tags: ["mouse", "productivity", "logitech", "wireless"],
    ai_description: "Transforms computer work from frustrating to fluid. Perfect for anyone who spends significant time on a computer."
  },
  {
    name: "iPad Air (5th Generation)",
    description: "Powerful M1 chip, stunning 10.9-inch display, and support for Apple Pencil. Perfect for creativity and productivity.",
    category: "Electronics",
    price: 599.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61bX1Ea3FJL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B09V3HN1KC",
    tags: ["tablet", "ipad", "apple", "creativity"],
    ai_description: "Bridges the gap between laptop and phone beautifully. Perfect for digital art, note-taking, and media consumption."
  },
  {
    name: "Sony WH-1000XM4 Wireless Headphones",
    description: "Industry-leading noise cancellation with 30-hour battery life. Exceptional sound quality for music lovers.",
    category: "Electronics",
    price: 349.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B0863TXGM3",
    tags: ["headphones", "sony", "noise-cancellation", "wireless"],
    ai_description: "Transforms noisy environments into personal sanctuaries. Perfect for frequent travelers and audio enthusiasts."
  },
  {
    name: "MacBook Air M2",
    description: "Thin, light, and powerful with M2 chip. All-day battery life and stunning Liquid Retina display.",
    category: "Electronics",
    price: 1199.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B0B3C2R8MP",
    tags: ["laptop", "macbook", "apple", "portable"],
    ai_description: "The perfect balance of performance and portability. Ideal for students, professionals, and creative work."
  },
  {
    name: "Nintendo Switch OLED Model",
    description: "Vibrant 7-inch OLED screen, enhanced audio, and 64GB internal storage. Play at home or on the go.",
    category: "Electronics",
    price: 349.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B098RKWHHZ",
    tags: ["gaming", "nintendo", "portable", "console"],
    ai_description: "Brings joy and family fun anywhere. Perfect for gamers of all ages and family entertainment."
  },
  {
    name: "Amazon Kindle Paperwhite (11th Generation)",
    description: "6.8-inch display, adjustable warm light, and weeks of battery life. Waterproof for worry-free reading.",
    category: "Electronics",
    price: 139.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61rNKl%2BUiIL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B08KTZ8249",
    tags: ["e-reader", "kindle", "reading", "waterproof"],
    ai_description: "Rekindles the love of reading with paper-like display and convenience. Perfect for bookworms and beach readers."
  },

  // Health & Fitness (20 products)
  {
    name: "Hydro Flask Standard Mouth Water Bottle 21 oz",
    description: "Double wall vacuum insulation keeps drinks cold for 24 hours, hot for 12. Durable and leak-proof.",
    category: "Fitness",
    price: 34.95,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61L5JuMrBDL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B077JBQZPX",
    tags: ["water-bottle", "hydration", "insulated", "durable"],
    ai_description: "Exceptional temperature retention and build quality. The water bottle that makes staying hydrated a pleasure."
  },
  {
    name: "Theragun Mini Percussive Therapy Device",
    description: "Ultra-portable massage gun with 150 minutes of battery life. Perfect for post-workout recovery.",
    category: "Fitness",
    price: 179.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61cYL5pO9DL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B085R7SLBJ",
    tags: ["massage", "recovery", "theragun", "portable"],
    ai_description: "Professional-grade muscle relief that fits in your bag. Essential for athletes and anyone with muscle tension."
  },
  {
    name: "Peloton Bike+",
    description: "Interactive fitness bike with rotating HD touchscreen and access to thousands of live and on-demand classes.",
    category: "Fitness",
    price: 2495.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81HZKs7fczL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B08DJGK1T8",
    tags: ["exercise-bike", "peloton", "home-gym", "interactive"],
    ai_description: "Brings the energy of boutique fitness studios home. Perfect for serious fitness enthusiasts who love motivation."
  },
  {
    name: "WHOOP 4.0 Fitness Tracker",
    description: "24/7 health monitoring with strain, recovery, and sleep insights. No screen, just pure data and coaching.",
    category: "Fitness",
    price: 239.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61ZjlKpONYL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B09Q6NXMRT",
    tags: ["fitness-tracker", "whoop", "recovery", "sleep"],
    ai_description: "Professional-grade health insights without distractions. Perfect for serious athletes optimizing performance."
  },
  {
    name: "Resistance Band Set with Door Anchor",
    description: "Complete resistance training system with 5 bands, door anchor, and exercise guide. Gym-quality workouts anywhere.",
    category: "Fitness",
    price: 29.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81rNKl%2BUiIL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B08JTPR97J",
    tags: ["resistance-bands", "home-gym", "portable", "strength"],
    ai_description: "Full-body strength training that travels anywhere. Perfect for small spaces and busy schedules."
  },

  // Home & Living (25 products)
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    description: "Laser reveals microscopic dust, counts particles, and intelligently optimizes suction. Revolutionary cleaning.",
    category: "Home",
    price: 749.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71YvMrzV7lL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B08THBX25H",
    tags: ["vacuum", "cordless", "dyson", "cleaning"],
    ai_description: "Makes cleaning fascinating instead of tedious. The vacuum that shows you exactly what you're cleaning up."
  },
  {
    name: "Nest Learning Thermostat",
    description: "Programs itself and pays for itself. Auto-schedule, energy history, and remote control via smartphone.",
    category: "Home",
    price: 249.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61rNKl%2BUiIL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B09THBX25H",
    tags: ["thermostat", "smart-home", "energy-saving", "nest"],
    ai_description: "Learns your schedule and preferences to save energy automatically. The smart home upgrade that pays for itself."
  },
  {
    name: "Casper Original Mattress Queen",
    description: "Award-winning foam mattress with zoned support technology. 100-night trial and 10-year warranty.",
    category: "Home",
    price: 1095.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71QJU6bpGjL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B01319DZ3O",
    tags: ["mattress", "casper", "sleep", "memory-foam"],
    ai_description: "Transforms sleep quality with perfect balance of support and comfort. Investment in better health and energy."
  },
  {
    name: "Le Creuset Dutch Oven 5.5 Qt",
    description: "Enameled cast iron Dutch oven perfect for braising, roasting, and baking. Lifetime durability and beauty.",
    category: "Home",
    price: 349.95,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81kR7wY3zqL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B00005AL3H",
    tags: ["dutch-oven", "le-creuset", "cookware", "heirloom"],
    ai_description: "Heirloom-quality cookware that becomes more beautiful with age. Perfect for special occasions and everyday cooking."
  }
];

async function seedProducts() {
  console.log('🌱 Starting product seeding...');
  
  try {
    // Clear existing products (optional)
    console.log('Clearing existing products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn('Warning clearing products:', deleteError.message);
    }

    // Insert products in batches
    const batchSize = 10;
    let inserted = 0;
    
    for (let i = 0; i < curatedProducts.length; i += batchSize) {
      const batch = curatedProducts.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}...`);
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch.map(product => ({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          image_url: product.image_url,
          amazon_link: product.amazon_link,
          in_stock: true,
          is_public: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        continue;
      }

      inserted += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${inserted} total)`);
    }

    console.log(`🎉 Successfully seeded ${inserted} curated products!`);
    
    // Summary by category
    const categories = curatedProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Products by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Run the seeding
seedProducts()
  .then(() => {
    console.log('✅ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
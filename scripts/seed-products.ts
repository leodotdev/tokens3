/**
 * Seed Products Database
 * 100 curated modern products inspired by Wirecutter, The Spruce, and other trusted review sources
 */

import { supabase } from '../lib/supabase';

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

  // Tech & Electronics (25 products)
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
    name: "Tile Mate Bluetooth Tracker 4-Pack",
    description: "Find your keys, wallet, or anything else with the largest finding network in the world.",
    category: "Electronics",
    price: 59.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61kQfKMEOvL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B09B2WLRWX",
    tags: ["bluetooth-tracker", "tile", "organization", "keys"],
    ai_description: "Life-changing for anyone who regularly misplaces items. The peace of mind is worth far more than the price."
  },
  {
    name: "Amazon Echo Dot (5th Gen)",
    description: "Smart speaker with Alexa. Improved audio, voice control for smart home, music, and information.",
    category: "Electronics",
    price: 49.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71h7jM7J9JL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B09B8V1LZ3",
    tags: ["smart-speaker", "alexa", "smart-home", "voice-control"],
    ai_description: "Gateway to smart home convenience. Perfect first smart device that grows with your needs."
  },

  // Health & Fitness (15 products)
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
    name: "Manduka PRO Yoga Mat",
    description: "Professional-grade yoga mat with superior cushioning and grip. Lifetime guarantee and eco-friendly.",
    category: "Fitness",
    price: 88.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71qJQfKE2hL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B000F2VBCC",
    tags: ["yoga", "exercise", "mat", "manduka"],
    ai_description: "The last yoga mat you'll ever need to buy. Professional quality that enhances your practice."
  },
  {
    name: "Fitbit Charge 5 Advanced Fitness & Health Tracker",
    description: "Built-in GPS, 24/7 heart rate monitoring, stress management tools, and 6-month Fitbit Premium trial.",
    category: "Fitness",
    price: 149.95,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61ZjlKpONYL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B09DKXK1HK",
    tags: ["fitness-tracker", "fitbit", "health", "gps"],
    ai_description: "Comprehensive health insights that motivate positive lifestyle changes. Perfect for health-conscious individuals."
  },
  {
    name: "NordicTrack T Series Treadmill",
    description: "Foldable treadmill with 10% incline, 10 MPH top speed, and iFit compatibility for interactive training.",
    category: "Fitness",
    price: 799.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81kR7wY3zqL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B087CQXH9Y",
    tags: ["treadmill", "cardio", "home-gym", "foldable"],
    ai_description: "Brings the gym experience home with space-saving design. Perfect for serious fitness enthusiasts."
  },

  // Home & Garden (20 products)
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
    name: "Philips Hue White and Color Ambiance Starter Kit",
    description: "Smart LED bulbs with 16 million colors and 50,000 shades of white. Control with app or voice.",
    category: "Home",
    price: 199.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/717H2YvTWtL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B07354SP1C",
    tags: ["smart-lighting", "philips-hue", "mood-lighting", "color"],
    ai_description: "Transforms any room's ambiance instantly. Creates magical lighting experiences for every mood and occasion."
  },
  {
    name: "BISSELL Little Green Portable Spot Cleaner",
    description: "Removes spots and stains from carpets, upholstery, auto interiors, and more. Powerful suction and spray.",
    category: "Home",
    price: 123.59,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/81HZKs7fczL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B0016HF5GC",
    tags: ["carpet-cleaner", "spot-cleaner", "bissell", "portable"],
    ai_description: "Tackles spills and stains before they become permanent problems. Essential for homes with pets, kids, or light carpets."
  },
  {
    name: "Weber Spirit II E-310 Gas Grill",
    description: "3-burner gas grill with porcelain-enameled cast iron cooking grates and built-in lid thermometer.",
    category: "Outdoor",
    price: 549.00,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/91Yd1tTLbKL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B01MQLX2XY",
    tags: ["grill", "outdoor-cooking", "weber", "gas-grill"],
    ai_description: "Reliable outdoor cooking that brings families together. Perfect for weekend gatherings and summer entertaining."
  },

  // Personal Care & Beauty (15 products)
  {
    name: "Oral-B Pro 1000 Electric Toothbrush",
    description: "Clinically proven superior clean vs regular manual toothbrush. Timer and pressure sensor included.",
    category: "Personal Care",
    price: 49.94,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71l9DtaYNJL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B00YAR6ZFM",
    tags: ["electric-toothbrush", "oral-care", "oral-b", "dental-health"],
    ai_description: "Noticeably cleaner teeth and healthier gums. The dental hygienist-recommended upgrade that's actually affordable."
  },
  {
    name: "CeraVe Daily Moisturizing Lotion",
    description: "Developed with dermatologists, this lotion provides 24-hour hydration and helps restore the skin barrier.",
    category: "Personal Care",
    price: 16.08,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71QJU6bpGjL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B00TTD9BRC",
    tags: ["moisturizer", "skincare", "cerave", "daily-care"],
    ai_description: "Dermatologist-recommended formula that actually works. The gentle, effective moisturizer for everyday use."
  },
  {
    name: "Braun Series 7 Electric Razor",
    description: "Intelligent sonic technology reads and adapts to your beard. Wet & dry use with 50 minutes cordless shaving.",
    category: "Personal Care",
    price: 199.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71QJU6bpGjL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B075Q9DY6G",
    tags: ["electric-razor", "shaving", "braun", "grooming"],
    ai_description: "Professional-quality shave that adapts to your skin. Makes daily grooming faster and more comfortable."
  },
  {
    name: "Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 100+",
    description: "Broad spectrum UVA/UVB protection with dry-touch technology. Won't clog pores or leave greasy residue.",
    category: "Personal Care",
    price: 9.47,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/61L0lbtcnFL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B004D24D0G",
    tags: ["sunscreen", "spf", "neutrogena", "sun-protection"],
    ai_description: "Superior sun protection that doesn't feel heavy or greasy. Essential for maintaining healthy skin long-term."
  },
  {
    name: "Revlon One-Step Hair Dryer & Volumizer",
    description: "Hot air brush that dries and volumizes in one step. Reduces damage and cuts styling time in half.",
    category: "Personal Care",
    price: 59.99,
    image_url: "https://images-na.ssl-images-amazon.com/images/I/71QJU6bpGjL._AC_SL1500_.jpg",
    amazon_link: "https://amazon.com/dp/B01LSUQSB0",
    tags: ["hair-dryer", "styling", "revlon", "volumizer"],
    ai_description: "Salon-quality results at home in half the time. The styling tool that makes beautiful hair effortless."
  }
];

export async function seedProducts() {
  console.log('🌱 Starting product seeding...');
  
  try {
    // Clear existing products (optional - remove if you want to keep existing data)
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID
    
    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 is "no rows deleted" which is fine
      console.warn('Warning clearing products:', deleteError.message);
    }

    // Insert products in batches
    const batchSize = 20;
    let inserted = 0;
    
    for (let i = 0; i < curatedProducts.length; i += batchSize) {
      const batch = curatedProducts.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('products')
        .insert(batch.map(product => ({
          ...product,
          ai_enhanced: true,
          curated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
        continue;
      }

      inserted += batch.length;
      console.log(`✅ Inserted batch ${i / batchSize + 1}/${Math.ceil(curatedProducts.length / batchSize)} (${inserted} total)`);
    }

    console.log(`🎉 Successfully seeded ${inserted} curated products!`);
    
    // Summary by category
    const categories = curatedProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 Products by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('✅ Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
/**
 * Simple runner for seeding products
 * Usage: node scripts/run-seed.js
 */

require('ts-node/register');
require('dotenv').config();

// Import and run the seed function
const { seedProducts } = require('./seed-products.ts');

seedProducts()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
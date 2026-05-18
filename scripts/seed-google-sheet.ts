import { seedGoogleSheetHeader } from '../src/services/googleSheets.js';

async function main() {
  await seedGoogleSheetHeader();
  console.log('Google Sheet header seeded successfully.');
}

main().catch((error) => {
  console.error('Failed to seed Google Sheet header:', error);
  process.exit(1);
});

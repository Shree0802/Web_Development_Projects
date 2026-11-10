const { chromium } = require('playwright');
const path = require('path');
const { spawn } = require('child_process');

async function testNavbar() {
  const server = spawn('node', ['server/src/index.js'], { cwd: __dirname });
  await new Promise(r => setTimeout(r, 2000));

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Take screenshot of navbar
  const navbar = page.locator('header').first();
  const navbarScreenshot = path.resolve(__dirname, 'tests/screenshots/new_navbar_logo.png');
  await navbar.screenshot({ path: navbarScreenshot });

  // Take screenshot of whole top header & hero
  const topScreenshot = path.resolve(__dirname, 'tests/screenshots/new_header_with_logo.png');
  await page.screenshot({ path: topScreenshot });

  console.log('✅ Captured screenshots of new logo & navbar:');
  console.log(' - ' + navbarScreenshot);
  console.log(' - ' + topScreenshot);

  await browser.close();
  server.kill();
}

testNavbar().catch(err => {
  console.error(err);
  process.exit(1);
});

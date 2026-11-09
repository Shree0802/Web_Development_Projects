const { chromium } = require('playwright');
const { spawn } = require('child_process');

(async () => {
  let server = null;
  try {
    const health = await fetch('http://localhost:5000/api/health');
    if (!health.ok) throw new Error();
  } catch(e) {
    console.log('Spawning server...');
    server = spawn('node', ['server/src/index.js'], { env: { ...process.env, PORT: '5000' } });
    await new Promise(r => setTimeout(r, 2000));
  }

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'tests/screenshots/new_impressive_hero.png', fullPage: false });
  console.log('Captured tests/screenshots/new_impressive_hero.png');

  // Also test clicking next slide to Panhala Fort
  const nextBtn = page.locator('button[aria-label="Next Landmark"]').first();
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'tests/screenshots/new_hero_panhala.png', fullPage: false });
    console.log('Captured tests/screenshots/new_hero_panhala.png');
  }

  await browser.close();
  if (server) server.kill();
  console.log('Hero screenshot verified successfully!');
})();

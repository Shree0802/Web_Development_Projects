const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderLogo() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 512, height: 512, deviceScaleFactor: 2 } });
  
  const svgPath = path.resolve(__dirname, 'client/public/images/logo.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body, html { margin: 0; padding: 0; background: transparent; overflow: hidden; }
          svg { width: 512px; height: 512px; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `);

  await page.waitForTimeout(300);

  const pngPath = path.resolve(__dirname, 'client/public/images/logo.png');
  const jpgPath = path.resolve(__dirname, 'client/public/images/logo.jpg');

  // Take screenshot as PNG (supports transparency)
  await page.screenshot({ path: pngPath, omitBackground: true });
  // Take screenshot as JPEG
  await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 95 });

  console.log('✅ Generated client/public/images/logo.png & logo.jpg');

  // Copy to server and root
  fs.copyFileSync(svgPath, path.resolve(__dirname, 'server/public/images/logo.svg'));
  fs.copyFileSync(pngPath, path.resolve(__dirname, 'server/public/images/logo.png'));
  fs.copyFileSync(jpgPath, path.resolve(__dirname, 'server/public/images/logo.jpg'));

  fs.copyFileSync(svgPath, path.resolve(__dirname, 'images/logo.svg'));
  fs.copyFileSync(pngPath, path.resolve(__dirname, 'images/logo.png'));
  fs.copyFileSync(jpgPath, path.resolve(__dirname, 'images/logo.jpg'));

  if (fs.existsSync(path.resolve(__dirname, 'client/dist/images'))) {
    fs.copyFileSync(svgPath, path.resolve(__dirname, 'client/dist/images/logo.svg'));
    fs.copyFileSync(pngPath, path.resolve(__dirname, 'client/dist/images/logo.png'));
    fs.copyFileSync(jpgPath, path.resolve(__dirname, 'client/dist/images/logo.jpg'));
  }

  console.log('✅ Synchronized new logo across all directories');
  await browser.close();
}

renderLogo().catch(err => {
  console.error(err);
  process.exit(1);
});

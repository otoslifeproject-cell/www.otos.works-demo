#!/usr/bin/env node
/**
 * Export wireframe HTML screens to PNG at 2x resolution.
 * Requires: npm install puppeteer (or npx puppeteer)
 * Usage: node export-png.js  or  npm run export
 *
 * Output: ./exports/ — desktop at 2880px wide, mobile at 2x device frame.
 */

const fs = require('fs');
const path = require('path');

const exportsDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

const baseUrl = 'file://' + __dirname.replace(/\\/g, '/') + '/';

const mobileView = { width: 393 + 24, height: 852 + 24 + 120, scale: 2 };
const desktopView = { width: 1440, height: 900, scale: 2 };
const flowMapView = { width: 1240, height: 4800, scale: 2 };

const screens = [
  // User-flow diagram (screenshot for decks / website)
  { file: 'flow-overview.html', name: '0-demo-routes-flow-map', ...flowMapView },
  // Wireframe 1 — Participant onboarding
  { file: 'mobile-onboarding-welcome.html', name: '1-participant-welcome', ...mobileView },
  { file: 'mobile-onboarding-consent.html', name: '1-participant-consent', ...mobileView },
  { file: 'mobile-onboarding-id.html', name: '1-participant-id', ...mobileView },
  { file: 'mobile-onboarding-checkin.html', name: '1-participant-checkin', ...mobileView },
  { file: 'mobile-onboarding-nextstep.html', name: '1-participant-nextstep', ...mobileView },
  { file: 'mobile-onboarding-done.html', name: '1-participant-done', ...mobileView },
  // Wireframe 2 — Bedside / alcohol liaison
  { file: 'mobile-helen-scan.html', name: '2-helen-scan', ...mobileView },
  { file: 'mobile-helen-participant.html', name: '2-helen-participant', ...mobileView },
  { file: 'mobile-helen-record.html', name: '2-helen-record', ...mobileView },
  { file: 'mobile-helen-adhd-route.html', name: '2-helen-adhd-route', ...mobileView },
  { file: 'mobile-helen-receipt.html', name: '2-helen-receipt', ...mobileView },
  // Wireframe 3 — Coordinator
  { file: 'desktop-coordinator-dashboard.html', name: '3-coordinator-dashboard', ...desktopView },
  // Wireframe 4 — Commissioner
  { file: 'desktop-commissioner-report.html', name: '4-commissioner-report', ...desktopView },
  // Legacy
  { file: 'desktop-dashboard.html', name: 'desktop-dashboard', ...desktopView },
  { file: 'desktop-ops-touchpoints.html', name: 'desktop-ops-touchpoints', ...desktopView },
  { file: 'desktop-alert-escalation.html', name: 'desktop-alert-escalation', ...desktopView },
  { file: 'mobile-checkin.html', name: 'mobile-checkin', ...mobileView },
  { file: 'mobile-alert.html', name: 'mobile-alert', ...mobileView },
];

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer not found. Run: npm install puppeteer');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });

  for (const s of screens) {
    if (!fs.existsSync(path.join(__dirname, s.file))) {
      console.log('Skip (missing):', s.file);
      continue;
    }
    const page = await browser.newPage();
    await page.setViewport({
      width: s.width,
      height: s.height,
      deviceScaleFactor: s.scale,
    });
    const url = baseUrl + s.file;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
    const outPath = path.join(exportsDir, s.name + '.png');
    await page.screenshot({ path: outPath, type: 'png' });
    await page.close();
    console.log('Saved:', outPath);
  }

  await browser.close();
  console.log('Done. Output in', exportsDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

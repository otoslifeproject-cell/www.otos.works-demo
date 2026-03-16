#!/usr/bin/env node
/**
 * Export wireframe HTML screens to PDF (one page per screen, plus one merged PDF).
 * Requires: npm install puppeteer pdf-lib
 * Usage: node export-pdf.js  or  npm run export-pdf
 *
 * Output: ./exports/ — individual PDFs and wireframes-all.pdf
 */

const fs = require('fs');
const path = require('path');

const exportsDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

const baseUrl = 'file://' + __dirname.replace(/\\/g, '/') + '/';

const mobileView = { width: 393 + 24, height: 852 + 24 + 80 };
const desktopView = { width: 1440, height: 900 };

const screens = [
  { file: 'mobile-onboarding-welcome.html', name: '1-participant-welcome', ...mobileView },
  { file: 'mobile-onboarding-consent.html', name: '1-participant-consent', ...mobileView },
  { file: 'mobile-onboarding-id.html', name: '1-participant-id', ...mobileView },
  { file: 'mobile-onboarding-checkin.html', name: '1-participant-checkin', ...mobileView },
  { file: 'mobile-onboarding-nextstep.html', name: '1-participant-nextstep', ...mobileView },
  { file: 'mobile-onboarding-done.html', name: '1-participant-done', ...mobileView },
  { file: 'mobile-helen-scan.html', name: '2-helen-scan', ...mobileView },
  { file: 'mobile-helen-participant.html', name: '2-helen-participant', ...mobileView },
  { file: 'mobile-helen-record.html', name: '2-helen-record', ...mobileView },
  { file: 'mobile-helen-adhd-route.html', name: '2-helen-adhd-route', ...mobileView },
  { file: 'mobile-helen-receipt.html', name: '2-helen-receipt', ...mobileView },
  { file: 'desktop-coordinator-dashboard.html', name: '3-coordinator-dashboard', ...desktopView },
  { file: 'desktop-commissioner-report.html', name: '4-commissioner-report', ...desktopView },
];

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer not found. Run: npm install puppeteer');
    process.exit(1);
  }

  let pdfLib;
  try {
    pdfLib = require('pdf-lib');
  } catch (e) {
    pdfLib = null;
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const pdfBuffers = [];

  for (const s of screens) {
    if (!fs.existsSync(path.join(__dirname, s.file))) {
      console.log('Skip (missing):', s.file);
      continue;
    }
    const page = await browser.newPage();
    await page.setViewport({
      width: s.width,
      height: s.height,
      deviceScaleFactor: 1,
    });
    const url = baseUrl + s.file;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});

    const pdfPath = path.join(exportsDir, s.name + '.pdf');
    const buffer = await page.pdf({
      path: pdfPath,
      width: s.width + 'px',
      height: s.height + 'px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    if (buffer) pdfBuffers.push(buffer);
    await page.close();
    console.log('Saved:', pdfPath);
  }

  await browser.close();

  if (pdfLib && pdfBuffers.length > 0) {
    const mergedPdf = await pdfLib.PDFDocument.create();
    for (const buf of pdfBuffers) {
      const src = await pdfLib.PDFDocument.load(buf);
      const pages = await mergedPdf.copyPages(src, src.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }
    const mergedPath = path.join(exportsDir, 'wireframes-all.pdf');
    fs.writeFileSync(mergedPath, await mergedPdf.save());
    console.log('Saved:', mergedPath);
  } else if (pdfBuffers.length > 0 && !pdfLib) {
    console.log('Install pdf-lib to generate wireframes-all.pdf: npm install pdf-lib');
  }

  console.log('Done. Output in', exportsDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

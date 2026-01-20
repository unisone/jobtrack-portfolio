#!/usr/bin/env node
/**
 * Generate PDF resumes from the resume pages
 * Run with: node scripts/generate-pdfs.mjs
 * Requires dev server running on localhost:3000
 */

import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const resumes = [
  {
    name: 'Alex_Zaytsev_BSA_ProdOps_Resume',
    url: 'http://localhost:3000/resumes/bsa',
  },
  {
    name: 'Alex_Zaytsev_QA_Automation_Resume',
    url: 'http://localhost:3000/resumes/qa',
  },
  {
    name: 'Alex_Zaytsev_AI_Engineer_Resume',
    url: 'http://localhost:3000/resumes/ai-engineer',
  },
];

async function generatePDFs() {
  const outputDir = join(projectRoot, 'public', 'resumes');

  // Create output directory
  await mkdir(outputDir, { recursive: true });

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const resume of resumes) {
    console.log(`Generating ${resume.name}...`);

    const page = await browser.newPage();

    // Set viewport for letter size at 96 DPI
    await page.setViewport({
      width: 816,  // 8.5" * 96 DPI
      height: 1056, // 11" * 96 DPI
    });

    await page.goto(resume.url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for content to render
    await page.waitForSelector('header', { timeout: 10000 });

    // Generate PDF
    const pdfPath = join(outputDir, `${resume.name}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
      printBackground: true,
      preferCSSPageSize: false,
    });

    console.log(`✓ Saved: ${pdfPath}`);
    await page.close();
  }

  await browser.close();
  console.log('\n✅ All PDFs generated successfully!');
  console.log(`📁 Location: ${outputDir}`);
}

generatePDFs().catch((error) => {
  console.error('Error generating PDFs:', error);
  process.exit(1);
});

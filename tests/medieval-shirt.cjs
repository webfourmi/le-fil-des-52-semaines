'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
require('../assets/medieval-shirt.js');

const { calculate } = globalThis.Fil52MedievalShirt;
const typical = { chest: 94, hips: 101, shoulders: 39, arm: 59, biceps: 30, wrist: 17, neck: 36, finishedLength: 88 };
const options = { ease: 22, margin: 1, slit: 14 };
const fitted = calculate(typical, options);
assert.equal(fitted.body * 2, 1230);
assert.equal(fitted.positions.front.w, 635);
assert.equal(fitted.positions.front.h, 900);
assert.equal(fitted.armhole, fitted.rootWidth / 2 + fitted.gusset);
assert.equal(fitted.positions.front.count + fitted.positions.back.count + fitted.positions.sleeve.count + fitted.positions.gusset.count, 6);
const bare = calculate(typical, { ...options, margin: 0 });
assert.equal(bare.positions.front.w + 20, fitted.positions.front.w);
assert.equal(bare.positions.sleeve.h + 20, fitted.positions.sleeve.h);
assert.throws(() => calculate({ ...typical, wrist: undefined }, options), /Mesures manquantes/);
assert.throws(() => calculate({ ...typical, arm: 10 }, options), /proportions/);
for (const row of [
  { chest: 72, hips: 76, shoulders: 32, arm: 49, biceps: 22, wrist: 13, neck: 29, finishedLength: 68 },
  { chest: 145, hips: 151, shoulders: 55, arm: 74, biceps: 47, wrist: 24, neck: 49, finishedLength: 120 }
]) {
  const result = calculate(row, { ...options, ease: 28, margin: 1.5 });
  assert(result.body * 2 >= 10 * (Math.max(row.chest, row.hips) + 28));
  assert(result.positions.sleeve.h > 100);
}

async function main() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.setDefaultTimeout(10000);
    await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:8765/');
    await page.getByRole('button', { name: 'Viera', exact: true }).click();
    await page.getByRole('button', { name: 'Mes mensurations', exact: true }).click();
    const form = page.locator('#measurement-form');
    await form.getByLabel('Prénom').fill('Fiche pilote');
    await form.getByRole('button', { name: 'Enregistrer la fiche' }).click();
    await form.getByRole('status').getByText('Fiche enregistrée').waitFor();
    await page.getByRole('button', { name: 'Patron de la chemise médiévale' }).click();
    await page.getByText(/Mesures manquantes/).waitFor();
    assert.equal(await page.locator('[data-shirt-print]').count(), 0);
    await page.evaluate(values => Fil52Measurements.list('m').then(([person]) =>
      Fil52Measurements.replace('m', [{ ...person, values }])
    ), typical);
    await page.locator('#medieval-shirt-content').getByRole('status').waitFor();
    await page.getByRole('button', { name: 'Mes mensurations', exact: true }).click();
    await page.getByRole('button', { name: 'Patron de la chemise médiévale' }).click();
    await page.getByRole('heading', { name: 'Aperçu avant impression' }).waitFor();
    assert.equal(await page.locator('.shirt-pieces figure').count(), 4);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2));
    await page.getByLabel('Longueur finie souhaitée (cm)', { exact: true }).fill('96');
    await page.getByRole('button', { name: 'Calculer le patron' }).click();
    await page.getByText(/longueur 96 cm/).waitFor();
    for (const [format, width, height] of [['A4', 210, 297], ['A0', 841, 1189]]) {
      const pending = page.context().waitForEvent('page');
      await page.locator('[data-shirt-print="' + format + '"]').click();
      const print = await pending;
      await print.getByText('Carré test 5 × 5 cm').waitFor();
      const pages = await print.locator('.sheet').count();
      assert(format === 'A4' ? pages > 6 : pages === 5);
      assert(await print.locator('.sheet').evaluateAll(sheets => sheets.every(sheet => sheet.scrollHeight <= sheet.clientHeight + 1)));
      const square = await print.locator('.test').boundingBox();
      assert(Math.abs(square.width * 25.4 / 96 - 50) < 0.1);
      const pdf = await print.pdf({ preferCSSPageSize: true });
      assert.equal(pdf.toString('ascii', 0, 4), '%PDF');
      const pageBoxes = [...pdf.toString('latin1').matchAll(/\/MediaBox\s*\[0 0 ([\d.]+) ([\d.]+)\]/g)];
      assert.equal(pageBoxes.length, pages);
      for (const box of pageBoxes) {
        assert(Math.abs(Number(box[1]) * 25.4 / 72 - width) < 0.6);
        assert(Math.abs(Number(box[2]) * 25.4 / 72 - height) < 0.6);
      }
      if (process.env.SHIRT_TEST_PDF_DIR) {
        const fs = require('node:fs/promises');
        const path = require('node:path');
        await fs.writeFile(path.join(process.env.SHIRT_TEST_PDF_DIR, 'chemise-' + format + '.pdf'), pdf);
      }
      await print.close();
    }
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.context().setOffline(true);
    await page.reload();
    await page.getByRole('button', { name: 'Mes mensurations', exact: true }).click();
    await page.getByRole('button', { name: 'Patron de la chemise médiévale' }).click();
    await page.getByRole('heading', { name: 'Aperçu avant impression' }).waitFor();
    console.log('OK : trois gabarits, marges, fiche incomplète, impression A4/A0, échelle, pagination et parcours hors connexion.');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

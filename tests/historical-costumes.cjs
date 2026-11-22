'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 840 } });
      const page = await context.newPage();
      page.setDefaultTimeout(9000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const url = process.env.TEST_BASE_URL || 'http://127.0.0.1:8765/';
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Viera', exact: true }).click();
      const nav = width <= 850 ? '#bottomnav' : '#nav';
      await page.locator(nav + ' [data-page="learn"]').click();
      const toolbar = page.getByRole('navigation', { name: 'Rubriques et outils de couture' });
      const choice = page.getByRole('navigation', { name: 'Choisir une rubrique de couture' });
      const courses = choice.getByRole('button', { name: 'Cours', exact: true });
      const historical = choice.getByRole('button', { name: 'Costumes historiques', exact: true });
      assert((await choice.boundingBox()).y >= (await toolbar.boundingBox()).y + (await toolbar.boundingBox()).height);
      assert(Math.abs((await courses.boundingBox()).y - (await historical.boundingBox()).y) < 3);
      await historical.click();
      const tools = page.getByRole('navigation', { name: 'Outils des costumes historiques' });
      assert.equal(await tools.getByRole('button').count(), 2);
      const modelCards = page.locator('.historical-model');
      assert.equal(await modelCards.count(), 2);
      await tools.getByRole('button', { name: 'Rechercher un costume historique' }).click();
      const search = page.getByRole('searchbox', { name: 'Rechercher un modèle' });
      assert(await search.evaluate(input => document.activeElement === input));
      await search.fill('cotte medievale');
      assert.equal(await modelCards.filter({ visible: true }).count(), 1);
      await search.fill('Moyen Âge');
      assert.equal(await modelCards.filter({ visible: true }).count(), 2);
      await search.fill('introuvable');
      await page.getByRole('status').getByText(/Aucun modèle/).waitFor();
      await tools.getByRole('button', { name: 'Rechercher un costume historique' }).click();
      assert.equal(await modelCards.filter({ visible: true }).count(), 2);
      await tools.getByRole('button', { name: 'Patrons des costumes historiques' }).click();
      const categories = page.getByRole('combobox', { name: 'Rubrique des patrons' });
      assert.equal(await categories.inputValue(), 'historical');
      assert.equal(await page.locator('#historical-patterns .patterncard').count(), 2);
      assert.equal(await page.locator('#patterns-sewing').count(), 0);
      await categories.selectOption('bonus');
      assert.equal(await page.locator('#historical-patterns').count(), 0);
      await page.getByRole('heading', { name: 'Aumônière brodée et neuf points à la main' }).waitFor();
      await categories.selectOption({ label: 'Costumes historiques' });
      await page.getByRole('link', { name: 'Adapter la cotte à mes mesures' }).click();
      await page.getByRole('heading', { name: 'Cotte médiévale sur mesure', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Patrons des costumes historiques', exact: true }).click();
      assert.equal(await categories.inputValue(), 'historical');
      await page.locator(nav + ' [data-page="world"]').click();
      await page.getByRole('button', { name: 'Histoire de la couture' }).click();
      await page.getByRole('button', { name: 'Choisir un article' }).click();
      await page.locator('#culture-article-select').selectOption('history:medieval-03');
      const links = page.locator('#medieval-model-links');
      await links.getByRole('link', { name: 'Chemise médiévale', exact: true }).click();
      await page.getByRole('heading', { name: 'Chemise médiévale sur mesure', exact: true }).waitFor();
      await page.goBack();
      await links.getByRole('link', { name: 'Cotte médiévale', exact: true }).click();
      await page.reload();
      await page.getByRole('heading', { name: 'Cotte médiévale sur mesure', exact: true }).waitFor();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2));
      if (width === 390) {
        await page.waitForFunction(() => !!navigator.serviceWorker.controller);
        await context.setOffline(true);
        await page.reload();
        await page.getByRole('heading', { name: 'Cotte médiévale sur mesure', exact: true }).waitFor();
        await page.locator(nav + ' [data-page="learn"]').click();
        await historical.click();
        assert.equal(await modelCards.count(), 2);
      }
      assert.deepEqual(errors, []);
      await context.close();
      console.log('OK à ' + width + ' px : onglets, recherche, bibliothèque de patrons et liens de l’article.');
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

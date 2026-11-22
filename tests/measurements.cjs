'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch();
  try {
    const url = process.env.TEST_BASE_URL || 'http://127.0.0.1:8765/';
    const start = async identity => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      await page.goto(url);
      await page.getByRole('button', { name: identity, exact: true }).click();
      await openMeasurements(page);
      return page;
    };
    const openMeasurements = page => page.getByRole('button', { name: 'Mes mensurations', exact: true }).click();
    const source = await start('Viera');
    const form = source.locator('#measurement-form');
    await form.getByLabel('Prénom').fill('Camille');
    await form.getByLabel('Tour de taille (cm)').fill('74.5');
    await form.getByLabel('Notes d’ajustement').fill('Prévoir une toile.');
    await form.getByText('Guide illustré pour prendre les mesures').click();
    const guide = form.getByLabel('Mesure à illustrer');
    const instructions = form.locator('#measurement-instructions');
    const diagram = form.locator('#measurement-diagram');
    const choices = await guide.locator('option').evaluateAll(options => options.map(option => option.value));
    assert.equal(choices.length, 19);
    const captions = new Set();
    const drawings = new Set();
    for (const key of choices) {
      await guide.selectOption(key);
      captions.add(await instructions.textContent());
      drawings.add(await diagram.evaluate(canvas => canvas.toDataURL()));
    }
    assert.equal(captions.size, 19);
    assert.equal(drawings.size, 19);
    await guide.selectOption('rise');
    assert.match(await instructions.textContent(), /chaise dure/);
    assert.equal(await form.getByLabel('Tour de taille (cm)').inputValue(), '74.5');
    await form.getByRole('button', { name: 'Enregistrer la fiche' }).click();
    await form.getByRole('status').getByText('Fiche enregistrée').waitFor();
    for (const name of ['Alex', 'Dominique', 'Lou', 'Sacha']) {
      await source.getByRole('button', { name: 'Nouvelle fiche' }).click();
      await form.getByLabel('Prénom').fill(name);
      await form.getByRole('button', { name: 'Enregistrer la fiche' }).click();
      await form.getByRole('status').getByText('Fiche enregistrée').waitFor();
    }
    await source.reload();
    await openMeasurements(source);
    const selector = source.locator('#measurement-person');
    await selector.locator('option').nth(5).waitFor({ state: 'attached' });
    const camille = await selector.getByRole('option', { name: /^Camille ·/ }).getAttribute('value');
    await selector.selectOption(camille);
    assert.equal(await form.getByLabel('Tour de taille (cm)').inputValue(), '74.5');
    await form.getByLabel('Prénom').fill('Camille R.');
    await form.getByRole('button', { name: 'Enregistrer la fiche' }).click();
    await form.getByRole('status').getByText('Fiche enregistrée').waitFor();
    await form.getByRole('button', { name: 'Dupliquer' }).click();
    await form.getByRole('status').getByText('Fiche dupliquée').waitFor();
    source.once('dialog', dialog => dialog.accept());
    await form.getByRole('button', { name: 'Supprimer' }).click();
    await form.getByRole('status').getByText('Fiche supprimée').waitFor();
    assert.equal(await selector.locator('option').count(), 6);

    const mathilde = await start('Mathilde');
    await mathilde.locator('#measurement-person').waitFor();
    assert.equal(await mathilde.locator('#measurement-person option').count(), 1);
    const download = async (page, button) => {
      const [file] = await Promise.all([page.waitForEvent('download'), button.click()]);
      return JSON.parse(await fs.readFile(await file.path(), 'utf8'));
    };
    await selector.selectOption(camille);
    const single = await download(source, form.getByRole('button', { name: 'Exporter cette fiche' }));
    assert.equal(single.people.length, 1);
    const all = await download(source, source.getByRole('button', { name: 'Exporter toutes les fiches' }));
    assert.equal(all.people.length, 5);
    const openBackup = page => page.getByRole('button', { name: 'Sauvegardes de l’atelier' }).click();
    await openBackup(source);
    const backup = await download(source, source.locator('#backup-export'));
    assert.equal(backup.measurements.people.length, 5);

    const target = await start('Viera');
    await openBackup(target);
    async function restore(data, expected) {
      await target.locator('#backup-file').setInputFiles({ name: 'atelier.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
      await target.locator('#backup-preview').getByText(expected).waitFor();
      target.once('dialog', dialog => dialog.accept());
      await target.locator('#backup-restore').click();
      await target.locator('#backup-preview').waitFor({ state: 'hidden' });
      await target.getByText('Carnet et galeries restaurés.').waitFor();
    }
    await restore(backup, /5 fiche\(s\) de mensurations/);
    delete backup.measurements;
    await restore(backup, /Fiches de mensurations actuelles conservées/);
    await target.reload();
    await openMeasurements(target);
    await target.locator('#measurement-person').selectOption(camille);
    assert.equal(await target.getByLabel('Prénom').inputValue(), 'Camille R.');
    assert.equal(await target.getByLabel('Tour de taille (cm)').inputValue(), '74.5');
    await target.waitForFunction(() => !!navigator.serviceWorker.controller);
    await target.context().setOffline(true);
    await target.reload();
    await openMeasurements(target);
    await target.getByText('Guide illustré pour prendre les mesures').click();
    await target.getByLabel('Mesure à illustrer').selectOption('rise');
    assert.match(await target.locator('#measurement-instructions').textContent(), /chaise dure/);
    console.log('OK : 19 illustrations, saisie préservée et guide hors connexion.');
    console.log('OK : cinq fiches, édition, duplication, suppression, séparation des profils, exports et restauration compatible.');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

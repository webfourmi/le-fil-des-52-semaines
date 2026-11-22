'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const url = process.env.TEST_BASE_URL || 'http://127.0.0.1:8765/';
    const start = async () => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      page.setDefaultTimeout(8000);
      await page.goto(url);
      await page.getByRole('button', { name: 'Viera', exact: true }).click();
      return page;
    };
    const source = await start();
    const reminder = source.getByRole('region', { name: 'Rappel de sauvegarde' });
    const setReminderAge = days => source.evaluate(age => {
      localStorage.setItem('fil52.backup.reminderStart.m', new Date(Date.now() - age * 86400000).toISOString());
    }, days);
    await setReminderAge(6);
    await source.reload();
    assert.equal(await reminder.count(), 0);
    await setReminderAge(7);
    await source.reload();
    await reminder.getByRole('button').click();
    const [download] = await Promise.all([
      source.waitForEvent('download'),
      source.locator('#backup-export').click()
    ]);
    const file = await fs.readFile(await download.path());
    assert.equal(JSON.parse(file).profile, 'm');
    assert(!file.includes('reminderStart'));
    await source.locator('#backup-health').getByText(/Dernier export lancé le/).waitFor();
    await source.reload();
    assert.equal(await reminder.count(), 0);

    const target = await start();
    await target.locator('details.pwa-panel summary').click();
    await target.getByRole('button', { name: 'Sauvegarder mon carnet' }).click();
    const input = target.locator('#backup-file');
    const restore = target.locator('#backup-restore');
    const preview = target.locator('#backup-preview');
    const selectBackup = () => input.setInputFiles({ name: 'atelier.json', mimeType: 'application/json', buffer: file });
    await input.setInputFiles({ name: 'invalide.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
    await preview.getByText(/Import refusé/).waitFor();
    assert(await restore.isDisabled());
    await selectBackup();
    await preview.getByText(/Sauvegarde du/).waitFor();
    await target.locator('#backup-cancel').click();
    assert(await restore.isDisabled());
    assert(!await preview.isVisible());
    await selectBackup();
    await preview.getByText(/Sauvegarde du/).waitFor();
    target.once('dialog', dialog => dialog.dismiss());
    await restore.click();
    assert(await preview.isVisible());
    target.once('dialog', dialog => dialog.accept());
    await restore.click();
    await target.getByText('Carnet et galeries restaurés.').waitFor();
    assert.equal(await target.evaluate(() => localStorage.getItem('fil52.backup.last.m')), null);
    console.log('OK : rappel à J+7, export, validation, annulations, restauration et suivi propre au navigateur.');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });

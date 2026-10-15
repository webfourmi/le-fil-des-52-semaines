/* Le fil des 52 semaines : sauvegarde portable de progression (schema 1).
   Aucune donnée n'est envoyée à un serveur. */
(function (root) {
  'use strict';
  const FORMAT = 'le-fil-des-52-semaines.progress';
  const SCHEMA = 1;
  const PERSONS = ['m', 'f'];
  const KINDS = ['mat', 'steps', 'blocks'];
  const MAX_ENTRIES = 4000;
  const MAX_NOTE_LENGTH = 12000;
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const fail = message => { throw new Error(message); };
  const isPlain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  function validateIds(value, label, kind) {
    if (!Array.isArray(value) || value.length > MAX_ENTRIES) fail('Liste invalide : ' + label);
    const max = kind === 'blocks' ? 52 : 1000000;
    if (!value.every(x => Number.isInteger(x) && x >= (kind === 'blocks' ? 1 : 0) && x <= max)) {
      fail('Numéros invalides : ' + label);
    }
    return [...new Set(value)];
  }
  function validateNotes(value, label) {
    if (!isPlain(value) || Object.keys(value).length > 52) fail('Notes invalides : ' + label);
    const clean = {};
    for (const [key, note] of Object.entries(value)) {
      if (!/^(?:[1-9]|[1-4][0-9]|5[0-2])$/.test(key) ||
          typeof note !== 'string' || note.length > MAX_NOTE_LENGTH) {
        fail('Note invalide : ' + label);
      }
      clean[key] = note;
    }
    return clean;
  }
  function validateData(raw) {
    if (!isPlain(raw)) fail('Le fichier ne contient pas de progression.');
    const data = { mat: {}, steps: {}, blocks: {}, notes: {} };
    for (const kind of KINDS) {
      if (!isPlain(raw[kind])) fail('Champ manquant : ' + kind);
      for (const person of PERSONS) {
        data[kind][person] = validateIds(raw[kind][person], kind + '/' + person, kind);
      }
    }
    if (!isPlain(raw.notes)) fail('Notes manquantes.');
    for (const person of PERSONS) data.notes[person] = validateNotes(raw.notes[person], person);
    return data;
  }
  function exportData(state) {
    const data = validateData(state);
    return {
      format: FORMAT,
      schema: SCHEMA,
      exportedAt: new Date().toISOString(),
      data
    };
  }
  function parseBackup(text) {
    if (typeof text !== 'string' || !text || text.length > MAX_FILE_SIZE) {
      fail('Fichier vide ou trop volumineux (maximum 2 Mo).');
    }
    let file;
    try { file = JSON.parse(text); } catch (_) { fail('Ce fichier n’est pas un JSON valide.'); }
    if (!isPlain(file) || file.format !== FORMAT || file.schema !== SCHEMA) {
      fail('Ce n’est pas une sauvegarde compatible du Fil des 52 semaines.');
    }
    if (typeof file.exportedAt !== 'string' || !Number.isFinite(Date.parse(file.exportedAt))) {
      fail('La date de sauvegarde est invalide.');
    }
    return { exportedAt: file.exportedAt, data: validateData(file.data) };
  }
  function applyBackup(current, backup, scope) {
    if (!['m', 'f', 'both'].includes(scope)) fail('Choisissez un parcours à restaurer.');
    const validated = validateData(backup.data);
    const next = { ...current, mat: { ...current.mat }, steps: { ...current.steps },
      blocks: { ...current.blocks }, notes: { ...current.notes } };
    for (const person of (scope === 'both' ? PERSONS : [scope])) {
      for (const kind of KINDS) next[kind][person] = [...validated[kind][person]];
      next.notes[person] = { ...validated.notes[person] };
    }
    return next;
  }
  root.Fil52Backup = { FORMAT, SCHEMA, MAX_FILE_SIZE, exportData, parseBackup, applyBackup };
})(globalThis);

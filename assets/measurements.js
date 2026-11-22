/* Fiches de mensurations de Mon atelier, enregistrées par profil dans IndexedDB. */
(function (root) {
  'use strict';

  const fields = [
    ['height', 'Stature', 30, 250],
    ['chest', 'Tour de poitrine', 20, 280],
    ['waist', 'Tour de taille', 20, 280],
    ['hips', 'Tour de bassin', 20, 280],
    ['shoulders', 'Carrure', 10, 100],
    ['back', 'Longueur du dos', 10, 100],
    ['arm', 'Longueur du bras', 10, 110],
    ['biceps', 'Tour de biceps', 5, 110],
    ['wrist', 'Tour de poignet', 5, 60],
    ['neck', 'Tour de cou', 10, 100],
    ['inseam', 'Entrejambe', 10, 140],
    ['rise', 'Hauteur de fourche', 5, 100],
    ['thigh', 'Tour de cuisse', 10, 160],
    ['knee', 'Tour de genou', 10, 100],
    ['calf', 'Tour de mollet', 5, 100],
    ['ankle', 'Tour de cheville', 5, 70],
    ['bustHeight', 'Hauteur de poitrine', 5, 80],
    ['bustSpan', 'Écart de poitrine', 5, 75],
    ['finishedLength', 'Longueur finie souhaitée', 5, 250]
  ];
  let opening;

  function database() {
    if (!opening) {
      opening = new Promise((resolve, reject) => {
        const request = indexedDB.open('fil52.measurements', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('profiles');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }).catch(error => {
        opening = null;
        throw error;
      });
    }
    return opening;
  }

  function validate(rows) {
    if (!Array.isArray(rows)) throw Error('Liste de fiches de mensurations invalide.');
    const ids = new Set();
    return rows.map(row => {
      if (!row || typeof row.id !== 'string' || !/^[a-z0-9-]{1,90}$/i.test(row.id) || ids.has(row.id) ||
          typeof row.name !== 'string' || !row.name.trim() || row.name.length > 80 ||
          typeof row.notes !== 'string' || row.notes.length > 3000 ||
          typeof row.updatedAt !== 'string' || !Number.isFinite(Date.parse(row.updatedAt)) ||
          !row.values || typeof row.values !== 'object' || Array.isArray(row.values)) {
        throw Error('Fiche de mensurations invalide.');
      }
      ids.add(row.id);
      const values = {};
      for (const [key, label, min, max] of fields) {
        if (!Object.hasOwn(row.values, key)) continue;
        const value = row.values[key];
        if (!Number.isFinite(value) || value < min || value > max) {
          throw Error(label + ' doit être comprise entre ' + min + ' et ' + max + ' cm.');
        }
        values[key] = value;
      }
      return { id: row.id, name: row.name.trim(), notes: row.notes, updatedAt: row.updatedAt, values };
    });
  }

  async function access(profile, change) {
    if (profile !== 'm' && profile !== 'f') throw Error('Profil de l’atelier invalide.');
    const db = await database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('profiles', change ? 'readwrite' : 'readonly');
      const store = transaction.objectStore('profiles');
      const request = store.get(profile);
      let rows, failure;
      request.onsuccess = () => {
        rows = request.result || [];
        if (!change) return;
        try {
          rows = validate(change(rows));
          store.put(rows, profile);
        } catch (error) {
          failure = error;
          transaction.abort();
        }
      };
      transaction.oncomplete = () => resolve(rows);
      transaction.onabort = () => reject(failure || transaction.error || Error('Enregistrement interrompu.'));
    });
  }

  function download(rows) {
    const file = new Blob([JSON.stringify({ format: 'fil52-mensurations', version: 1, people: rows }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'de-fil-en-aiguille-mensurations.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function mount(container, profile, safe) {
    let selected = '';
    let busy = false;
    let rows;

    function show(message = '') {
      const row = rows.find(item => item.id === selected);
      container.innerHTML = `
        <section class="card"><h2>Mes personnes</h2>
          <div class="actions">
            <button type="button" class="secondary" data-measure-action="new">Nouvelle fiche</button>
            <button type="button" class="secondary" data-measure-action="export-all" ${rows.length ? '' : 'disabled'}>Exporter toutes les fiches</button>
          </div>
          <label>Fiche à ouvrir <select id="measurement-person"><option value="">Nouvelle fiche</option>
            ${rows.map(item => `<option value="${safe(item.id)}" ${item.id === selected ? 'selected' : ''}>${safe(item.name)} · ${new Date(item.updatedAt).toLocaleDateString('fr-FR')}</option>`).join('')}
          </select></label>
        </section>
        <section class="card section"><h2>${row ? 'Modifier la fiche' : 'Créer une fiche'}</h2>
          <form id="measurement-form" class="supply-form">
            <label>Prénom <input name="name" maxlength="80" required value="${safe(row?.name || '')}"></label>
            <p class="small supply-wide">Mesure en centimètres, avec un mètre souple posé à plat sans serrer. Renseigne les mesures dont tu disposes.</p>
            ${fields.map(([key, label, min, max]) => `<label>${label} (cm)<input name="${key}" type="number" inputmode="decimal" step="any" min="${min}" max="${max}" value="${row?.values[key] ?? ''}"></label>`).join('')}
            <label class="supply-wide">Notes d’ajustement <textarea name="notes" maxlength="3000">${safe(row?.notes || '')}</textarea></label>
            <p class="small supply-wide" role="status">${safe(message || (row ? `${fields.length - Object.keys(row.values).length} mesures non renseignées · modifiée le ${new Date(row.updatedAt).toLocaleString('fr-FR')}` : ''))}</p>
            <div class="actions supply-wide">
              <button class="primary" type="submit">Enregistrer la fiche</button>
              ${row ? '<button class="secondary" type="button" data-measure-action="duplicate">Dupliquer</button><button class="secondary" type="button" data-measure-action="export-one">Exporter cette fiche</button><button class="secondary" type="button" data-measure-action="delete">Supprimer</button>' : ''}
            </div>
          </form>
        </section>`;
    }

    try {
      rows = await access(profile);
    } catch {
      container.textContent = 'Impossible de lire les fiches sur cet appareil.';
      return;
    }
    if (!container.isConnected) return;
    show();

    async function change(update, selection, message) {
      if (busy) return;
      busy = true;
      const controls = [...container.querySelectorAll('button:not(:disabled), select, input, textarea')];
      for (const item of controls) item.disabled = true;
      try {
        rows = await access(profile, update);
        selected = selection;
        show(message);
      } catch (error) {
        container.querySelector('[role=status]').textContent = error.message;
        for (const item of controls) item.disabled = false;
      } finally {
        busy = false;
      }
    }

    container.addEventListener('change', event => {
      if (event.target.id !== 'measurement-person') return;
      selected = event.target.value;
      show();
    });
    container.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.target);
      const id = selected || crypto.randomUUID();
      const values = {};
      for (const [key] of fields) {
        if (form.get(key) !== '') values[key] = Number(form.get(key));
      }
      const row = { id, name: form.get('name'), notes: form.get('notes'), values, updatedAt: new Date().toISOString() };
      change(current => current.some(item => item.id === id)
        ? current.map(item => item.id === id ? row : item)
        : [...current, row], id, 'Fiche enregistrée sur cet appareil.');
    });
    container.addEventListener('click', event => {
      const action = event.target.closest('[data-measure-action]')?.dataset.measureAction;
      const row = rows.find(item => item.id === selected);
      if (action === 'new') {
        selected = '';
        show();
        container.querySelector('[name=name]').focus();
      }
      if (action === 'export-all') download(rows);
      if (action === 'export-one' && row) download([row]);
      if (action === 'duplicate' && row) {
        const copy = { ...row, id: crypto.randomUUID(), name: (row.name.slice(0, 72) + ' (copie)'), updatedAt: new Date().toISOString() };
        change(current => [...current, copy], copy.id, 'Fiche dupliquée.');
      }
      if (action === 'delete' && row && confirm('Supprimer la fiche de ' + row.name + ' ?')) {
        change(current => current.filter(item => item.id !== row.id), '', 'Fiche supprimée.');
      }
    });
  }

  root.Fil52Measurements = {
    validate,
    list: profile => access(profile),
    replace: (profile, rows) => access(profile, () => rows),
    mount
  };
})(globalThis);

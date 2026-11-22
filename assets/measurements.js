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
  // Coordinates refer to the same front or back silhouette on a 180 × 288 canvas.
  // Rings show visible and hidden halves of a tape measure around the body.
  const landmarks = {
    height: ['Du sommet du crâne au sol, pieds nus, debout contre un mur.', 'line', [24, 9, 24, 276]],
    chest: ['Fais le tour à l’endroit le plus fort de la poitrine, sous les bras. Garde le ruban horizontal et respire normalement.', 'ring', [90, 92, 24, 5]],
    waist: ['Fais le tour de la taille naturelle, au creux qui se marque en inclinant le buste sur le côté.', 'ring', [90, 119, 18, 4]],
    hips: ['Fais le tour au point le plus fort des hanches et des fesses, pieds rapprochés.', 'ring', [90, 142, 26, 5]],
    shoulders: ['Dans le dos, mesure d’une pointe d’épaule à l’autre. Repère les os aux extrémités des épaules.', 'line', [65, 66, 115, 66], true],
    back: ['Penche un peu la tête pour repérer la vertèbre saillante à la base du cou. Redresse-toi, puis mesure le long du dos jusqu’à la taille naturelle.', 'line', [90, 57, 90, 119], true],
    arm: ['Pars de la pointe de l’épaule et descends jusqu’à l’os du poignet, en passant sur le coude légèrement fléchi.', 'line', [115, 66, 127, 109, 136, 146]],
    biceps: ['Bras relâché, fais le tour de la partie la plus large du haut du bras.', 'ring', [121, 88, 7, 3]],
    wrist: ['Fais le tour du poignet au niveau des os saillants.', 'ring', [136, 146, 5, 3]],
    neck: ['Fais le tour à la base du cou, à l’endroit où reposerait un col de chemise.', 'ring', [90, 55, 10, 3]],
    inseam: ['Mesure depuis le haut de l’entrejambe jusqu’au sol, le long de l’intérieur de la jambe, pieds nus.', 'line', [91, 158, 96, 207, 98, 276]],
    rise: ['Assieds-toi bien droit sur une chaise dure. Mesure la hauteur verticale entre la taille naturelle et l’assise, sur le côté.', 'seat', [128, 119, 128, 156]],
    thigh: ['Fais le tour du haut de la cuisse, à son point le plus large, juste sous l’entrejambe.', 'ring', [104, 170, 12, 4]],
    knee: ['Jambe droite et relâchée, fais le tour du genou au niveau du milieu de la rotule.', 'ring', [105, 207, 9, 3]],
    calf: ['Fais le tour de la partie la plus large du mollet, debout, sans serrer.', 'ring', [106, 229, 9, 3]],
    ankle: ['Fais le tour juste au-dessus des os de la cheville, à l’endroit le plus fin.', 'ring', [105, 259, 6, 3]],
    bustHeight: ['Mesure depuis la jonction du cou et de l’épaule jusqu’à la pointe de poitrine du même côté.', 'line', [98, 56, 104, 92]],
    bustSpan: ['Mesure la distance horizontale entre les deux pointes de poitrine.', 'line', [77, 92, 103, 92]],
    finishedLength: ['Repère le point de départ indiqué sur le patron. Pour une chemise, mesure depuis l’épaule, près du cou, jusqu’au bas souhaité. Le trait illustre cet exemple.', 'line', [98, 56, 101, 119, 105, 184]]
  };

  function drawGuide(canvas, key) {
    const ctx = canvas.getContext('2d');
    const [, kind, points, back] = landmarks[key];
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 180, 288);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.fillStyle = '#eee9de';
    ctx.strokeStyle = '#536457';
    ctx.lineWidth = 1.3;
    const outline = kind === 'seat'
      ? 'M81 44L81 53Q70 58 69 72L72 113L69 148Q70 156 80 157L117 157L118 200L116 222L118 226L133 226Q139 224 134 221L128 217L129 164Q130 141 118 139L90 138L92 112L96 77Q96 61 91 54L91 44Z'
      : 'M83 43L81 53Q77 59 67 62Q61 64 59 74L53 105L40 146L37 156Q36 162 41 160L47 151L63 111L69 87Q67 106 72 118Q70 126 65 138Q62 151 65 168L69 202L67 229L72 263L68 271Q62 277 70 277L81 277L82 263L83 231L85 207L90 161L95 207L97 231L98 263L99 277L110 277Q118 277 112 271L108 263L113 229L111 202L115 168Q118 151 115 138Q110 126 108 118Q113 106 111 87L117 111L133 151L139 160Q144 162 143 156L140 146L127 105L121 74Q119 64 113 62Q103 59 99 53L97 43Z';
    ctx.fill(new Path2D(outline));
    ctx.stroke(new Path2D(outline));
    ctx.beginPath();
    ctx.ellipse(kind === 'seat' ? 86 : 90, 28, 14, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (back) {
      ctx.beginPath();
      ctx.moveTo(90, 57);
      ctx.lineTo(90, 138);
      ctx.stroke();
    }
    if (kind === 'seat') {
      ctx.stroke(new Path2D('M64 108V158H116M68 158V225M108 158V225'));
    }
    ctx.strokeStyle = '#973f34';
    ctx.fillStyle = '#973f34';
    ctx.lineWidth = 2.6;
    if (kind === 'ring') {
      const [x, y, rx, ry] = points;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI);
      ctx.stroke();
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, Math.PI, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let index = 2; index < points.length; index += 2) ctx.lineTo(points[index], points[index + 1]);
    ctx.stroke();
    for (const index of [0, points.length - 2]) {
      ctx.beginPath();
      ctx.arc(points[index], points[index + 1], 3.4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

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
        <section class="card"><h2>Mes fiches</h2>
          <div class="actions">
            <button type="button" class="secondary" data-measure-action="new">Nouvelle fiche</button>
            <button type="button" class="secondary" data-measure-action="export-all" ${rows.length ? '' : 'disabled'}>Exporter toutes les fiches</button>
          </div>
          <label>Fiche à ouvrir <select id="measurement-person">
            ${rows.map(item => `<option value="${safe(item.id)}" ${item.id === selected ? 'selected' : ''}>${safe(item.name)} · ${new Date(item.updatedAt).toLocaleDateString('fr-FR')}</option>`).join('')}
            <option value="" ${selected ? '' : 'selected'}>＋ Nouvelle fiche</option>
          </select></label>
        </section>
        <section class="card section"><h2>${row ? 'Modifier la fiche' : 'Créer une fiche'}</h2>
          <form id="measurement-form" class="supply-form">
            <label>Prénom <input name="name" maxlength="80" required value="${safe(row?.name || '')}"></label>
            <p class="small supply-wide">Mesure en centimètres, avec un mètre souple posé à plat sans serrer. Renseigne les mesures dont tu disposes.</p>
            <details class="supply-wide measurement-guide">
              <summary>Guide illustré pour prendre les mesures</summary>
              <div class="measurement-guide-body">
                <canvas id="measurement-diagram" width="360" height="576" aria-hidden="true"></canvas>
                <div>
                  <label for="measurement-guide-choice">Mesure à illustrer</label>
                  <select id="measurement-guide-choice">
                    ${fields.map(([key, label]) => `<option value="${key}" ${key === 'chest' ? 'selected' : ''}>${label}</option>`).join('')}
                  </select>
                  <p id="measurement-instructions" aria-live="polite"></p>
                </div>
              </div>
            </details>
            ${fields.map(([key, label, min, max]) => `<label>${label} (cm)<input name="${key}" type="number" inputmode="decimal" step="any" min="${min}" max="${max}" value="${row?.values[key] ?? ''}"></label>`).join('')}
            <label class="supply-wide">Notes d’ajustement <textarea name="notes" maxlength="3000">${safe(row?.notes || '')}</textarea></label>
            <p class="small supply-wide" role="status">${safe(message || (row ? `${fields.length - Object.keys(row.values).length} mesures non renseignées · modifiée le ${new Date(row.updatedAt).toLocaleString('fr-FR')}` : ''))}</p>
            <div class="actions supply-wide">
              <button class="primary" type="submit">Enregistrer la fiche</button>
              ${row ? '<button class="secondary" type="button" data-measure-action="duplicate">Dupliquer</button><button class="secondary" type="button" data-measure-action="export-one">Exporter cette fiche</button><button class="secondary" type="button" data-measure-action="delete">Supprimer</button>' : ''}
            </div>
          </form>
        </section>`;
      showGuide();
    }

    function showGuide() {
      const key = container.querySelector('#measurement-guide-choice').value;
      container.querySelector('#measurement-instructions').textContent = landmarks[key][0];
      drawGuide(container.querySelector('#measurement-diagram'), key);
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
      if (event.target.id === 'measurement-guide-choice') {
        showGuide();
        return;
      }
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

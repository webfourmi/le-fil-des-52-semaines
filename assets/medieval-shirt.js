/* Chemise d’inspiration XIIIe siècle, patron pilote calculé sur l’appareil. */
(function (root) {
  'use strict';

  const required = [
    ['chest', 'Tour de poitrine', 20, 280],
    ['hips', 'Tour de bassin', 20, 280],
    ['shoulders', 'Carrure', 10, 100],
    ['arm', 'Longueur du bras', 10, 110],
    ['biceps', 'Tour de biceps', 5, 110],
    ['wrist', 'Tour de poignet', 5, 60],
    ['neck', 'Tour de cou', 10, 100],
    ['finishedLength', 'Longueur finie', 35, 150]
  ];
  const formats = { A4: [210, 297], A0: [841, 1189] };
  const text = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const round = value => Math.round(value * 10) / 10;
  const cm = value => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value / 10) + ' cm';

  function calculate(measures, options) {
    const missing = required.filter(([key]) => !Number.isFinite(measures[key]));
    if (missing.length) throw Error('Mesures manquantes : ' + missing.map(([, label]) => label).join(', ') + '.');
    for (const [key, label, min, max] of required) {
      if (measures[key] < min || measures[key] > max) throw Error(label + ' hors plage pour ce modèle.');
    }
    const { ease, margin, slit } = options;
    if (![16, 22, 28].includes(ease) || ![0, 1, 1.5].includes(margin) || ![10, 14, 18].includes(slit)) {
      throw Error('Réglages du patron invalides.');
    }
    const body = Math.max(measures.chest + ease, measures.hips + ease, 2 * (measures.shoulders + 2)) * 5;
    const length = measures.finishedLength * 10;
    const shoulderDrop = (body / 10 - measures.shoulders) / 2;
    const sleeve = (measures.arm - shoulderDrop) * 10;
    const rootWidth = (measures.biceps + 12) * 10;
    // The loose cuff needs to admit the hand. Check the opening on the toile.
    const cuff = Math.max(measures.wrist + 9, 20) * 10;
    const gusset = Math.max(65, Math.min(120, rootWidth * 0.26));
    const armhole = rootWidth / 2 + gusset;
    const neckRadius = (measures.neck + 4) * 10 / (2 * Math.PI);
    const frontDepth = neckRadius * 1.45;
    const backDepth = neckRadius * 0.45;
    if (sleeve < 100 || cuff >= rootWidth || length < armhole + 120 || body / 2 - neckRadius < 65) {
      throw Error('Ces mesures dépassent les proportions du modèle pilote. Vérifie la carrure, le bras, le biceps, le poignet et la longueur choisie.');
    }
    const m = margin * 10;
    const halfTaper = (rootWidth - cuff) / 2;
    const slope = halfTaper / sleeve;
    const offset = m * Math.hypot(1, slope);
    const top = offset + m * slope;
    const sleeveW = rootWidth + 2 * top;
    const armTop = rootWidth / 2 + top;
    const cuffInset = slope * (sleeve + 2 * m);
    const notchDepth = gusset / Math.hypot(1, slope);
    const positions = {
      front: makePanel('Devant', frontDepth, slit * 10),
      back: makePanel('Dos', backDepth, 0),
      sleeve: {
        name: 'Manche', count: 2, w: round(sleeveW), h: round(sleeve + 2 * m),
        cut: `M0 0H${sleeveW}L${sleeveW - cuffInset} ${sleeve + 2*m}H${cuffInset}Z`,
        sew: `M${top} ${m}h${rootWidth}l-${halfTaper} ${sleeve}h-${cuff}Z`,
        marks: `M${armTop} 0v12M${top+slope*notchDepth-3} ${m+notchDepth}h12M${top+rootWidth-slope*notchDepth+3} ${m+notchDepth}h-12`,
        grain: [armTop, Math.min(sleeve / 3, 65)], label: [armTop, m + sleeve * 0.56]
      },
      gusset: {
        name: 'Gousset d’aisselle', count: 2, w: gusset + 2 * m, h: gusset + 2 * m,
        cut: `M0 0H${gusset + 2*m}V${gusset + 2*m}H0Z`,
        sew: `M${m} ${m}h${gusset}v${gusset}h-${gusset}Z`,
        grain: [(gusset + 2*m)/2, m + 8], label: [(gusset + 2*m)/2, m + gusset * 0.72]
      }
    };

    function makePanel(name, depth, opening) {
      const w = body + 2*m, h = length + 2*m, center = w/2;
      return {
        name, count: 1, w, h,
        cut: `M0 0H${w}V${h}H0Z`,
        sew: `M${m} ${m}h${body}v${length}h-${body}Z`,
        neck: `M${center-neckRadius} ${m} A${neckRadius} ${depth} 0 0 0 ${center+neckRadius} ${m}` +
          (opening ? ` M${center} ${m+depth}v${opening}` : ''),
        marks: `M${center-neckRadius} 0V${m+4}M${center+neckRadius} 0V${m+4}M0 ${m+rootWidth/2}h12M${w} ${m+rootWidth/2}h-12M0 ${m+armhole}h12M${w} ${m+armhole}h-12`,
        grain: [center, m+Math.min(length/3, 210)], label: [center, m+length*0.55]
      };
    }
    return { positions, body, length, sleeve, rootWidth, cuff, gusset, armhole, ...options, measures };
  }

  function diagram(piece, x, y, w, h) {
    const [gx, gy] = piece.grain;
    const [lx, ly] = piece.label;
    const outline = part => part ? '<path d="' + part + '" />' : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true">
      <g fill="none" stroke="#17251a" stroke-width=".6">${outline(piece.cut)}${outline(piece.marks)}</g>
      <g fill="none" stroke="#435846" stroke-width=".45" stroke-dasharray="4 2">${outline(piece.sew)}</g>
      <g fill="none" stroke="#88452f" stroke-width=".7" stroke-dasharray="2 1">${outline(piece.neck)}</g>
      <path d="M${gx} ${gy}v28m-2-4l2 4 2-4M${gx-2} ${gy+4}l2-4 2 4" fill="none" stroke="#17251a" stroke-width=".5" />
      <text x="${gx + 4}" y="${gy + 16}" font-size="3.5">Droit-fil</text>
      <text x="${lx}" y="${ly}" font-size="${piece.name === 'Gousset d’aisselle' ? 3.6 : 5}" text-anchor="middle">${piece.name} · couper ${piece.count}</text>
    </svg>`;
  }

  function slices(size, window) {
    const step = window - 10;
    return Math.max(1, Math.ceil((size + 8 - 10) / step));
  }

  function printable(pattern, format) {
    const [width, height] = formats[format];
    const frameW = width - 20, frameH = height - 35;
    const stepX = frameW - 10, stepY = frameH - 10;
    const tiles = [];
    const layout = [];
    for (const piece of Object.values(pattern.positions)) {
      const columns = slices(piece.w, frameW), rows = slices(piece.h, frameH);
      layout.push(`${piece.name} : ${columns} colonne(s) × ${rows} rangée(s)`);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          tiles.push(`<section class="sheet"><p>${piece.name} · rangée ${row+1}/${rows} · colonne ${col+1}/${columns} · planche ${tiles.length+1}</p>
          <div class="frame">${diagram(piece, col * stepX - 4, row * stepY - 4, frameW, frameH)}
            ${col < columns - 1 ? '<span class="right"></span>' : ''}
            ${row < rows - 1 ? '<span class="bottom"></span>' : ''}
          </div></section>`);
        }
      }
    }
    return `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Patron de chemise médiévale · ${format}</title><style>
      @page { size: ${width}mm ${height}mm; margin: 0 }
      *{box-sizing:border-box} body{margin:0;font:11pt system-ui;color:#17251a} .sheet{width:${width}mm;height:${height}mm;padding:10mm;overflow:hidden;break-after:page}
      .sheet:last-child{break-after:auto} .sheet>p{margin:0 0 3mm} .frame{position:relative;width:${frameW}mm;height:${frameH}mm;outline:.2mm solid #999}
      .frame svg{display:block}.right,.bottom{position:absolute;pointer-events:none}.right{right:10mm;top:0;bottom:0;border-left:.2mm dashed #999}.bottom{bottom:10mm;left:0;right:0;border-top:.2mm dashed #999}
      .test{width:50mm;height:50mm;border:.25mm solid;display:grid;place-items:center;margin:3mm 0}
      h1{font-size:18pt;margin:0 0 3mm} h2{font-size:12pt;margin:3mm 0 1mm} ul,ol{margin:1mm 0;padding-left:6mm} .toolbar{padding:8px;position:sticky;top:0;background:white;z-index:1} .toolbar button{font:inherit}
      @media print{.toolbar{display:none}}
    </style><body><div class="toolbar"><button type="button" onclick="window.print()">Imprimer ou enregistrer en PDF</button></div>
      <section class="sheet"><h1>Chemise médiévale sur mesure</h1>
      <p>Patron pilote d’inspiration XIIIe siècle · ${format} · ${tiles.length} planches. Imprimer en taille réelle (100 %), sans ajustement, sans en-têtes ni pieds de page. Vérifier le carré avant de couper.</p>
      <div class="test">Carré test 5 × 5 cm</div>
      <h2>Mesures et réglages</h2><p>${required.map(([key,label]) => label + ' ' + cm(pattern.measures[key] * 10)).join(' · ')}. Aisance minimale ${pattern.ease} cm · marges ${pattern.margin} cm · fente ${pattern.slit} cm.</p>
      <h2>Dimensions de coupe</h2><p>${Object.values(pattern.positions).map(piece => piece.name + ' : ' + cm(piece.w) + ' × ' + cm(piece.h) + ' (×' + piece.count + ')').join(' · ')}. La largeur indiquée pour la manche est sa largeur maximale.</p>
      <h2>Assemblage des feuilles</h2><ul>${layout.map(line => '<li>' + line + '</li>').join('')}</ul>
      <p>Assemble chaque pièce de gauche à droite, puis de haut en bas. Coupe sur les lignes de raccord en gris à droite et en bas. Superpose ces bords aux bords gauche et haut des planches suivantes. Trait continu : coupe. Tirets : couture. Pointillés rouille : encolure et fente à ouvrir après les épaules.</p>
      <h2>Montage de la toile</h2>
      <ol><li>Coupe un devant, un dos, deux manches et deux goussets. Si les marges sont à zéro, ajoute-les à la coupe. Termine l’encolure au biais, sans marge supplémentaire sur son tracé.</li>
      <li>Couds chaque épaule du bord extérieur au repère de l’encolure. Sur le devant et le dos, coupe le tracé rouille et rejoins le bord supérieur aux deux repères. Ouvre la fente devant. Essaie le passage de la tête avant de poser le biais.</li>
      <li>Aligne le milieu du haut de manche sur l’épaule. Assemble les demi-largeurs aux côtés du corps jusqu’au premier repère. Sur chaque côté, couds deux bords voisins du carré aux bords de manche, de l’emmanchure aux crans. Couds les deux autres bords aux segments du devant et du dos entre les crans. Ferme la manche et le côté à partir des pointes du carré.</li>
      <li>Vérifie l’aisance en levant les bras et le passage des mains. Termine les poignets et le bas par un ourlet.</li></ol>
      <p>Modèle pilote à essayer dans une toile avant de couper le tissu final. Le dessin s’inspire des constructions géométriques de la période.</p></section>
      ${tiles.join('')}</body></html>`;
  }

  async function mount(container, profile) {
    let people;
    try { people = await root.Fil52Measurements.list(profile); }
    catch { container.textContent = 'Impossible de lire les fiches sur cet appareil.'; return; }
    if (!container.isConnected) return;
    if (!people.length) { container.textContent = 'Crée d’abord une fiche dans Mes mensurations.'; return; }
    container.innerHTML = `<form class="supply-form">
      <label>Personne<select name="person">${people.map(row => `<option value="${text(row.id)}">${text(row.name)}</option>`).join('')}</select></label>
      <label>Aisance minimale du corps<select name="ease"><option value="16">16 cm</option><option value="22" selected>22 cm</option><option value="28">28 cm</option></select></label>
      <label>Longueur finie souhaitée (cm)<input name="length" type="number" inputmode="decimal" step="any" min="35" max="150" placeholder="Valeur de la fiche"></label>
      <label>Marges de couture et d’ourlet<select name="margin"><option value="0">Sans marges</option><option value="1" selected>1 cm</option><option value="1.5">1,5 cm</option></select></label>
      <label>Longueur de la fente d’encolure<select name="slit"><option value="10">10 cm</option><option value="14" selected>14 cm</option><option value="18">18 cm</option></select></label>
      <div class="actions supply-wide"><button type="submit" class="primary">Calculer le patron</button></div>
    </form><div id="shirt-preview"></div>`;
    const form = container.querySelector('form');
    const result = container.querySelector('#shirt-preview');
    let pattern;
    function update(event) {
      event?.preventDefault();
      pattern = null;
      if (!form.checkValidity()) {
        result.innerHTML = '<p role="status">Renseigne une longueur de 35 à 150 cm.</p>';
        return;
      }
      const data = new FormData(form);
      const person = people.find(row => row.id === data.get('person'));
      const measures = { ...person.values };
      if (data.get('length')) measures.finishedLength = Number(data.get('length'));
      form.elements.namedItem('length').placeholder = person.values.finishedLength ?? 'À renseigner';
      try {
        pattern = calculate(measures, Object.fromEntries(['ease', 'margin', 'slit'].map(key => [key, Number(data.get(key))])));
      } catch (error) {
        result.innerHTML = `<p role="status">${text(error.message)} Complète les valeurs dans Mes mensurations.</p>`;
        return;
      }
      result.innerHTML = `<section class="section"><h2>Aperçu avant impression</h2>
        <p>Tour fini ${cm(pattern.body * 2)} · manche depuis l’épaule tombante ${cm(pattern.sleeve)} · longueur ${cm(pattern.length)}.</p>
        <div class="shirt-pieces">${Object.values(pattern.positions).map(piece => `<figure>${diagram(piece, -3, -3, piece.w+6, piece.h+6)}<figcaption>${piece.name} · ${cm(piece.w)} × ${cm(piece.h)} · couper ${piece.count}</figcaption></figure>`).join('')}</div>
        <p>Patron pilote. Vérifie l’aisance, l’encolure et le passage des mains sur une toile avant la coupe finale.</p>
        <div class="actions"><button type="button" class="secondary" data-shirt-print="A4">Imprimer ou PDF A4</button><button type="button" class="secondary" data-shirt-print="A0">Imprimer ou PDF A0</button></div>
      </section>`;
    }
    form.addEventListener('submit', update);
    form.addEventListener('change', event => {
      if (event.target.name === 'person') form.elements.namedItem('length').value = '';
      update(event);
    });
    result.addEventListener('click', event => {
      const format = event.target.closest('[data-shirt-print]')?.dataset.shirtPrint;
      if (!pattern || !formats[format]) return;
      const url = URL.createObjectURL(new Blob([printable(pattern, format)], { type: 'text/html;charset=utf-8' }));
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
    update();
  }

  root.Fil52MedievalShirt = { calculate, printable, mount };
})(globalThis);

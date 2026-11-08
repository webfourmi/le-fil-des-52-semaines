(function installChristmas(root){
'use strict';
const projects={
christmasStocking:{
 title:'La botte de Noël personnalisée',emoji:'🧦',time:'2 à 3 h',level:'Intermédiaire',pattern:'./assets/noel-botte-patron.html',tagline:'Une botte doublée, avec revers contrastant, attache et prénom brodé ou appliqué.',
 result:'Une botte décorative d’environ 22 cm de haut et 16 cm de large au niveau du pied, selon le tissu et le rembourrage éventuel.',
 materials:['2 pièces extérieures en coton rouge, vert ou imprimé, découpées en miroir avec le patron A4, marges de 1 cm incluses.','2 pièces de doublure en coton uni, découpées en miroir avec le même patron.','1 bande de revers en coton contrastant de 21 × 9 cm (à couper à la règle).','1 ruban solide de 18 cm pour l’attache, plié en deux.','Fil assorti, épingles ou pinces, ciseaux, fer à repasser.','Option : feutrine ou chutes de coton pour le prénom, thermocollant adapté et fil à broder.'],
 steps:[
 ['Imprimer et découper','Imprime la feuille A4 à taille réelle, sans adaptation. Vérifie le carré témoin de 5 cm. Découpe le contour de la botte, une fois en tissu endroit vers le haut et une fois envers vers le haut pour obtenir les deux pièces en miroir. Recommence pour la doublure.'],
 ['Assembler les extérieurs','Place les deux pièces extérieures endroit contre endroit. Pique à 1 cm sur les côtés et le pied, en laissant le haut ouvert. Crante légèrement la marge des courbes convexes et fais de petites entailles dans les courbes rentrantes, sans entamer la couture.'],
 ['Préparer la doublure','Assemble les deux pièces de doublure endroit contre endroit, avec une couture à 1 cm. Laisse une ouverture d’environ 7 cm sur le côté droit pour le retournement final.'],
 ['Préparer le revers et l’attache','Ferme la bande de revers en anneau en piquant ses petits côtés endroit contre endroit à 1 cm. Replie le tube sur sa hauteur, envers contre envers, puis presse. Plie le ruban de 18 cm en deux : ses extrémités restent prises dans la couture du haut, au côté de la botte.'],
 ['Assembler les épaisseurs','Retourne le corps extérieur sur l’endroit. Glisse-le à l’intérieur de la doublure restée sur l’envers, les endroits face à face. Place l’anneau du revers entre les deux couches, bords bruts alignés sur le haut ; insère l’attache entre l’extérieur et le revers. Épingle et pique le haut à 1 cm.'],
 ['Retourner et finir','Retourne par l’ouverture de la doublure, ferme cette dernière au point invisible ou à la machine. Replace la doublure dans la botte, relève le revers et presse avec une pattemouille si nécessaire. Ajoute le prénom sur le revers, à la main ou en appliqué, puis vérifie l’attache.']
 ],
 variations:['Version patchwork : assemble d’abord de petites chutes pour obtenir une pièce assez grande, puis découpe la silhouette.','Version traditionnelle : revers écru, ruban rouge et initiale brodée.','Version récup : chemise de coton pour la doublure, chute de velours pour le revers.'],
 caution:'Botte décorative, non prévue pour supporter des charges lourdes. Ne pas suspendre près d’une source de chaleur.'
},
christmasStars:{
 title:'La guirlande de cinq étoiles rembourrées',emoji:'⭐',time:'1 h 30 à 2 h',level:'Débutant',pattern:'./assets/noel-etoiles-patron.html',tagline:'Cinq étoiles textiles assemblées sur une ficelle de lin, à offrir ou à suspendre.',
 result:'Une guirlande d’environ 1,20 m, avec cinq étoiles souples de 10 cm environ.',
 materials:['10 pièces de coton, soit 2 faces pour chacune des 5 étoiles, à couper avec le gabarit A4.','Une poignée de rembourrage polyester ou des chutes de molleton propres pour cinq étoiles.','1,20 m de ficelle de lin ou de ruban pour la guirlande.','5 petits rubans de 12 cm environ pour les boucles de suspension (facultatif si les étoiles sont directement cousues).','Fil, aiguille, épingles, ciseaux de précision, baguette à bout arrondi pour former les pointes.','Option : 5 petits grelots ou perles de bois à fixer solidement, hors de portée des jeunes enfants.'],
 steps:[
 ['Imprimer et reporter','Imprime le gabarit A4 à taille réelle, vérifie le carré de 5 cm, puis reporte la grande étoile dix fois sur l’envers des tissus (deux par étoile). Les marges de 7,5 mm sont incluses.'],
 ['Superposer et maintenir','Forme cinq paires endroit contre endroit. Glisse la boucle de ruban à l’intérieur si souhaité, extrémités près d’une pointe et boucle tournée vers le centre. Épingle sans déformer.'],
 ['Piquer les contours','Pique tout le tour à 7,5 mm du bord, en laissant 3 cm ouverts sur l’un des segments droits, pas dans une pointe. À chaque changement de direction, aiguille en bas, lève le pied et pivote.'],
 ['Dégarnir et retourner','Dégarnis les cinq pointes et incise légèrement les angles rentrants, sans couper la couture. Retourne avec précaution et forme les pointes avec une baguette non pointue.'],
 ['Rembourrer et fermer','Garnis légèrement, sans tendre les coutures. Ferme chaque ouverture au point invisible, puis presse doucement sous une pattemouille si le tissu le permet.'],
 ['Monter la guirlande','Répartis les cinq étoiles à intervalles réguliers sur le cordon d’environ 1,20 m. Noue ou couds solidement les petites boucles de suspension. Termine par des boucles aux extrémités pour accrocher la guirlande.']
 ],
 variations:['Étoiles alternées rouges, vert sauge et écru.','Une face patchwork et une face unie pour chaque étoile.','Version sans rembourrage pour un marque-place ou une décoration de paquet.'],
 caution:'Décoration uniquement. Évite les petits éléments détachables pour une chambre d’enfant.'
},
christmasPouch:{
 title:'Le pochon cadeau de Noël réutilisable',emoji:'🎁',time:'1 h à 1 h 30',level:'Débutant +',pattern:'./assets/noel-pochon-patron.html',tagline:'Un sac cadeau à double cordon coulissant, réutilisable d’une fête à l’autre.',
 result:'Un pochon fini d’environ 24 × 30 cm, adapté à un livre, quelques douceurs emballées ou un petit présent.',
 materials:['2 rectangles de coton de 26 × 35 cm, à tracer à la règle (marges comprises).','2 cordons de 80 cm chacun, coton ou ruban souple de 3 à 5 mm de diamètre.','Fil assorti, ciseaux, épingles, règle, fer et épingle de sûreté ou passe-lacet.','Option : un petit rectangle de tissu de 8 × 5 cm pour une étiquette cadeau appliquée.'],
 steps:[
 ['Découper les rectangles','Coupe deux rectangles de 26 × 35 cm. Sur l’envers, marque un repère à 1 cm du bord latéral pour la couture, puis les limites de coulisse à 4 cm du bord supérieur. Le patron A4 donne le plan coté ; ces grands rectangles se mesurent à la règle, sans prétendre qu’ils tiennent sur une feuille.'],
 ['Préparer les ouvertures','Sur chaque panneau, replie les côtés sur 5 mm puis encore 5 mm sur les 4 premiers centimètres depuis le haut. Repasse et surpique ces petits ourlets : ils protègent les quatre bords des futures sorties de cordon.'],
 ['Assembler côtés et fond','Place les deux panneaux endroit contre endroit. Pique les côtés à 1 cm en commençant à 4 cm sous le haut, puis le fond à 1 cm. Renforce les arrêts à la base des ouvertures. Surfile les marges si le coton s’effiloche.'],
 ['Former les coulisses','Sur chacun des deux panneaux supérieurs, rentre le haut de 1 cm, puis replie de 3 cm vers l’envers. Presse et pique à environ 2 mm du bord replié intérieur sans fermer les entrées latérales de la coulisse.'],
 ['Passer deux cordons','Passe le premier cordon de 80 cm de gauche à droite à travers les deux coulisses, puis noue ensemble ses deux extrémités à gauche. Passe le second en sens inverse, noue à droite. Vérifie que chaque côté se resserre en tirant les nœuds opposés.'],
 ['Finitions','Retourne, ajuste les coins, repasse avec une pattemouille si nécessaire, ajoute une étiquette textile et teste l’ouverture et la fermeture plusieurs fois.']
 ],
 variations:['Petit format : couper deux rectangles de 20 × 26 cm et adapter les cordons à environ 65 cm.','Version livre : coton uni et étiquette brodée au prénom du destinataire.','Version raffinée : doublure facultative et cordon satiné contrastant.'],
 caution:'Ne pas laisser les longs cordons accessibles à un tout-petit. Pour transporter une bouteille lourde, prévoir un tissu renforcé et un patron adapté.'
}
};
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function render(id){
 const p=projects[id];if(!p)return '';
 return `<section class="weektop christmas-intro"><div><span class="eyebrow">🎄 Bonus de Noël · Projet en cours d’écriture</span><h1>${p.emoji} ${escape(p.title)}</h1><p class="lead">${escape(p.tagline)}</p><p class="small">${escape(p.level)} · ${escape(p.time)} · Fournitures pour un seul ouvrage</p></div></section>
 <section class="card section christmas-bonus"><div class="actions"><button class="secondary" type="button" data-page="bonus">← Tous les bonus</button><a class="primary course-pattern-link" data-pattern-preview="${id}" href="${p.pattern}">⎙ Imprimer gabarit A4</a></div>
 <div class="christmas-info"><div><b>Résultat attendu</b><p>${escape(p.result)}</p></div><div><b>Patron et découpe</b><p>Consulte le gabarit A4 avant de couper. Les mesures et les marges sont indiquées dans la fiche. Les lignes de coupe se distinguent des repères de couture.</p></div></div>
 <h2>Fournitures</h2><p class="small">Quantités prévues pour <b>un seul</b> ouvrage, sans les multiplier pour les deux couvertures ou les deux participantes.</p><ul>${p.materials.map(x=>`<li>${escape(x)}</li>`).join('')}</ul>
 <h2>Réalisation, pas à pas</h2><ol class="christmas-steps">${p.steps.map(([title,body])=>`<li><h3>${escape(title)}</h3><p>${escape(body)}</p></li>`).join('')}</ol>
 <h2>Variantes</h2><ul>${p.variations.map(x=>`<li>${escape(x)}</li>`).join('')}</ul>
 <p class="tip"><b>À savoir :</b> ${escape(p.caution)}</p>
 <div class="actions"><a class="primary course-pattern-link" href="${p.pattern}" data-pattern-preview="${id}">⎙ Imprimer gabarit A4</a><button type="button" class="secondary" data-page="bonus">Retour aux bonus</button></div>
 <p class="small">Projet en cours d’écriture. Le patron et la fiche sont proposés pour essai, jusqu’à validation éditoriale.</p></section>`;
}
root.Fil52Christmas={render,projects};
})(globalThis);

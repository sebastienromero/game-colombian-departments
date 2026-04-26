# 🗺️ Progression du projet – Colombian Departments

---

## 1. Setup du projet
- [x] 1.1 Initialiser le repo Git
- [x] 1.2 Créer le projet React + Vite
- [x] 1.3 Organiser la structure des dossiers (`app/`, `docs/`)
- [x] 1.4 Rédiger le README
- [x] 1.5 Rédiger le game design (`docs/game-design.md`)
- [x] 1.6 Configurer le déploiement GitHub Pages
- [x] 1.7 Vérifier que le déploiement fonctionne sur mobile

### ✅ Tests de validation
- [x] `npm run dev` lance l'app sans erreur
- [x] L'app est accessible sur `https://sebastienromero.github.io/game-colombian-departments/`
- [x] L'app s'affiche correctement sur mobile (Chrome / Safari)

---

## 2. Données
- [x] 2.1 Créer le fichier `app/src/data/departments.json`
- [x] 2.2 Renseigner les 32 départements avec leur capitale
- [x] 2.3 Ajouter la région de chaque département (Andina, Caribe, Pacífica, Orinoquía, Amazónica)

### ✅ Tests de validation
- [x] Le fichier JSON est valide (pas d'erreur de syntaxe)
- [x] Les 32 départements sont présents
- [x] Chaque département a : `id`, `nom`, `capitale`, `region`

---

## 3. Mode Quiz
- [ ] 3.1 Afficher une question au hasard (département → capitale ou capitale → département)
- [ ] 3.2 Afficher 4 propositions (1 bonne + 3 au hasard)
- [ ] 3.3 Valider la réponse et afficher le résultat
- [ ] 3.4 Enchaîner les 32 questions
- [ ] 3.5 Afficher le score final
- [ ] 3.6 Sauvegarder le score dans le `localStorage`
- [ ] 3.7 Afficher l'historique des meilleurs scores

### ✅ Tests de validation
- [ ] Les 4 propositions sont toujours différentes
- [ ] La bonne réponse est toujours parmi les 4 choix
- [ ] Le score s'incrémente correctement
- [ ] Le score est sauvegardé après fermeture du navigateur
- [ ] Le quiz fonctionne sur mobile (boutons facilement cliquables)

---

## 4. Mode Carte interactive
- [ ] 4.1 Intégrer la carte SVG de la Colombie
- [ ] 4.2 Chaque département est un élément SVG cliquable/colorable
- [ ] 4.3 Un département s'illumine au hasard
- [ ] 4.4 Afficher les deux champs de saisie (département + capitale)
- [ ] 4.5 Valider la réponse et colorier le département (vert / jaune / rouge)
- [ ] 4.6 Gérer la rotation (verts exclus, jaunes/rouges rejoués)
- [ ] 4.7 Détecter la victoire (32 départements verts)
- [ ] 4.8 Sauvegarder la progression dans le `localStorage`

### ✅ Tests de validation
- [ ] La carte s'affiche correctement sur mobile
- [ ] Un département vert ne revient plus dans la rotation
- [ ] Un département jaune ou rouge peut être amélioré
- [ ] La victoire est détectée quand les 32 sont verts
- [ ] La progression est restaurée après fermeture du navigateur

---

## 5. UI / UX
- [ ] 5.1 Écran d'accueil avec choix du mode (Quiz ou Carte)
- [ ] 5.2 Design responsive et mobile-first
- [ ] 5.3 Animations de feedback (bonne/mauvaise réponse)
- [ ] 5.4 Bouton "rejouer" en fin de partie

### ✅ Tests de validation
- [ ] L'app est utilisable d'une seule main sur mobile
- [ ] Les textes sont lisibles sans zoom
- [ ] Les boutons ont une taille suffisante (min. 44px)

---

## 6. Déploiement final
- [ ] 6.1 Build de production sans erreur
- [ ] 6.2 Déploiement sur GitHub Pages
- [ ] 6.3 Vérification sur mobile (iOS + Android)

### ✅ Tests de validation
- [ ] `npm run build` ne génère aucune erreur
- [ ] L'URL publique est fonctionnelle
- [ ] Les deux modes de jeu fonctionnent en production

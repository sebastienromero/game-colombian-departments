# 🇨🇴 game-colombian-departments
A game to learn the colombian departments and their capital cities.

**Objectif :** apprendre les départements et les capitales des départements de Colombie.

---

## 🛠️ Stack technique

- **React + Vite** (JavaScript)
- **Responsive / mobile-first** (optimisé pour smartphone)
- **localStorage** pour la sauvegarde de la progression et l'historique des scores
- **Déploiement** : GitHub Pages

---

## 🌐 Langue

- Interface entièrement en **français**
- Noms des départements et capitales en **espagnol**
- Les réponses sont **strictes** : l'orthographe exacte est requise (accents inclus)

---

## 🚀 Installation

```bash
git clone https://github.com/sebastienromero/game-colombian-departments.git
cd game-colombian-departments
npm install
npm run dev
```

## 📦 Déploiement (GitHub Pages)

```bash
npm run build
npm run deploy
```

---

## 🗺️ Mode 1 : Carte interactive

### Déroulement
1. Une **carte vierge** de la Colombie est affichée (32 départements découpés, non colorés)
2. Un département s'**illumine** au hasard
3. Le joueur saisit dans deux champs :
   - 📝 Le nom du département
   - 🏙️ Le nom de la capitale
4. Validation :
   - ✅ **Les deux bonnes réponses** → département coloré en **vert**
   - 🟡 **Une seule bonne réponse** → département coloré en **jaune**, bonne réponse affichée, on continue
   - ❌ **Aucune bonne réponse** → département coloré en **rouge**, bonne réponse affichée, on continue
5. Les départements **verts** ne reviennent plus dans la rotation
6. Les départements **jaunes et rouges** peuvent revenir pour être améliorés (rouge → jaune → vert)

### 🏆 Victoire
Colorier les **32 départements en vert** d'affilée sans erreur complète.

---

## ❓ Mode 2 : Quiz

### Déroulement
1. Une question est posée au hasard, par exemple :
   - *"Quelle est la capitale du département de l'Antioquia ?"*
   - *"À quel département appartient la ville de Pasto ?"*
2. Le joueur choisit parmi **4 propositions**
3. Validation :
   - ✅ **Bonne réponse** → point ajouté au score
   - ❌ **Mauvaise réponse** → la bonne réponse est affichée
4. La partie se termine après les **32 questions** (une par département)

### 🏆 Victoire
Obtenir le **score maximum** (32/32) en une seule partie.
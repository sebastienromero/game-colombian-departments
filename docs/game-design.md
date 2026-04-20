# 🎮 Game Design – Colombian Departments

## 🎯 Objectif
Apprendre les **32 départements de Colombie** et leurs capitales, en jouant.

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
2. Le joueur choisit parmi **4 propositions** (1 bonne + 3 au hasard)
3. Validation :
   - ✅ **Bonne réponse** → point ajouté au score
   - ❌ **Mauvaise réponse** → la bonne réponse est affichée
4. La partie se termine après les **32 questions** (une par département)

### 🏆 Victoire
Obtenir le **score maximum** (32/32) en une seule partie.

---

## ⚙️ Règles générales

| Paramètre | Valeur |
|---|---|
| 🌐 Langue de l'interface | Français |
| 🗣️ Noms des départements / capitales | Espagnol |
| ✏️ Validation des réponses | Stricte (orthographe exacte, accents inclus) |
| 💾 Sauvegarde | localStorage (progression + historique des scores) |
| 📱 Plateforme | Web, mobile-first |

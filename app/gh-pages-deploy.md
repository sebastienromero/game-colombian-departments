# Déploiement GitHub Pages pour l'app React

## 1. Installer le package de déploiement

Dans le dossier `app/` :

```bash
npm install --save-dev gh-pages
```

## 2. Modifier `vite.config.js`

Ajoute la propriété `base` :

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/game-colombian-departments/', // <-- Ajoute cette ligne
  plugins: [react()],
})
```

## 3. Modifier `package.json`

Ajoute les scripts :

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist",
  ...
}
```

Ajoute aussi la clé homepage :

```json
"homepage": "https://sebastienromero.github.io/game-colombian-departments/"
```

## 4. Déployer

```bash
npm run deploy
```

## 5. Tester sur mobile

- Ouvre l’URL : https://sebastienromero.github.io/game-colombian-departments/ sur ton téléphone
- Vérifie l’affichage, l’ergonomie, la navigation

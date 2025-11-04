# Fantasy Loop - Web Edition (Angular)

Interface web moderne pour le moteur de jeu Fantasy Loop, construite avec Angular 20.

## 🎮 Fonctionnalités

- **Interface Terminal** - Terminal interactif avec historique de commandes (flèches ↑/↓)
- **Panneau de Lieu** - Affichage visuel de la pièce actuelle avec actions rapides
- **Panneau d'Inventaire** - Gestion visuelle des objets avec boutons d'action
- **Design Rétro Terminal** - Style console classique avec effets verts sur fond noir
- **Responsive** - S'adapte aux différentes tailles d'écran
- **Sauvegarde Locale** - Utilise localStorage pour sauvegarder les parties

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
cd fantasy-loop-web
npm install
```

### Lancement

```bash
npm start
```

L'application sera disponible sur `http://localhost:4200/`

### Build Production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## 📁 Structure du Projet

```
fantasy-loop-web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── game-terminal/      # Composant terminal principal
│   │   │   ├── inventory-panel/    # Panneau d'inventaire
│   │   │   └── room-panel/         # Panneau de lieu
│   │   ├── services/
│   │   │   └── game-engine.service.ts  # Service moteur de jeu
│   │   ├── models/
│   │   │   └── game.models.ts      # Modèles de données
│   │   ├── app.ts                  # Composant racine
│   │   ├── app.html                # Template principal
│   │   └── app.scss                # Styles globaux
│   ├── styles.scss                 # Styles CSS globaux
│   └── index.html                  # Page HTML principale
├── public/
│   └── assets/
│       └── games/                  # Fichiers de configuration de jeux
└── package.json
```

## 🎨 Composants

### Game Terminal
- Affiche tous les messages du jeu
- Accepte les commandes du joueur
- Historique de commandes navigable avec ↑/↓
- Auto-scroll vers les nouveaux messages

### Inventory Panel
- Affiche les stats du joueur (nom, santé)
- Liste tous les objets en inventaire
- Boutons pour examiner, utiliser, ou jeter les objets
- Indicateurs visuels pour objets utilisables

### Room Panel
- Nom et description de la pièce actuelle
- Boutons rapides pour les sorties disponibles
- Liste des objets dans la pièce
- Actions rapides sur les objets (examiner, prendre)

## 🎮 Utilisation

### Commandes Terminal

Toutes les commandes du jeu CLI sont disponibles :

```
Movement:  go [direction], north/n, south/s, east/e, west/w
Actions:   take [item], drop [item], examine [item], use [item]
Info:      look/l, inventory/inv/i, status
System:    help/h, save [filename], load [filename]
```

### Interface Graphique

Vous pouvez également utiliser les boutons dans les panneaux :
- **Panneau de Lieu** : Cliquez sur les directions pour vous déplacer
- **Panneau d'Inventaire** : Utilisez les boutons d'action sur les objets
- **Terminal** : Tapez les commandes traditionnelles

## 🎯 Charger des Jeux Personnalisés

Les fichiers de configuration JSON peuvent être placés dans `public/assets/games/`.

## 🔧 Développement

### Scripts Disponibles

```bash
npm start          # Lancer le serveur de développement
npm run build      # Build de production
npm run watch      # Build en mode watch
```

### Technologies Utilisées

- **Angular 20** - Framework frontend
- **TypeScript** - Langage
- **RxJS** - Programmation réactive
- **SCSS** - Styles CSS avancés
- **Standalone Components** - Architecture Angular moderne

## 📱 Responsive Design

L'interface s'adapte automatiquement :

- **Desktop (>1200px)** : 3 colonnes (lieu | terminal | inventaire)
- **Tablet (768-1200px)** : 2 colonnes
- **Mobile (<768px)** : 1 colonne empilée

---

**Développé avec Angular pour une expérience de jeu textuel moderne ! 🎮✨**

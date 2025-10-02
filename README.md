Colonize.io — Alpha 2D V 0.2
=======================================

Enhancements over V1:
- Free camera in space with OrbitControls.
- Sidebar appears on hover over a planet to show player stats.
- Glow effect on owned planets and animated nebula for immersion.
- Improved starfield with slight shimmer.
- Fleet trails to visualize movement.

How to run:
1. unzip and cd into folder
2. npm install
3. npm start
4. Open http://localhost:3000


# 🌌 Colonize.io

> Stratégie spatiale multijoueur temps réel - 100% navigateur

## 📋 Vue d'ensemble

**Colonize.io** est un jeu de stratégie spatiale multijoueur en temps réel jouable directement dans le navigateur. Pas de téléchargement, pas d'installation - juste ton navigateur et l'espace infini.

### Concept

- **Type**: Stratégie spatiale temps réel
- **Joueurs**: 20-50 simultanés par partie
- **Technologie**: WebSocket + WebGL (Three.js) + Node.js
- **Style**: Immersion spatiale 3D avec planètes réalistes
- **Cible**: Joueurs occasionnels et compétitifs

## 🎮 Gameplay

### Objectif

Colonise des planètes, construis ta flotte et domine la galaxie !

### Mécaniques de base

**Démarrage**
- Tu commences avec 1 planète-mère
- Les planètes génèrent automatiquement des crédits

**Actions disponibles**
- 🪐 Coloniser de nouvelles planètes
- 🚀 Construire des vaisseaux (chasseurs, croiseurs, cuirassés)
- ⚔️ Envoyer des flottes vers d'autres planètes
- 🏗️ Améliorer les bâtiments (fonderie, boucliers)
- 🛡️ Activer des défenses planétaires

### Interface & Contrôles

**Sélection de planète**
- Clic sur une planète → panneau latéral s'affiche
- Informations visibles:
  - Nom de la planète
  - Niveau de fonderie
  - Points de bouclier
  - Garnison (vaisseaux présents)
  - Boutons d'amélioration

**Navigation**
- **Clic gauche**: Sélectionner une planète
- **Clic sur planète ennemie**: Attaquer depuis la planète sélectionnée
- **Scroll**: Zoom caméra

## 🎨 Direction artistique

### Graphismes 3D

- Planètes en 3D avec textures variées (terre, lave, glace, désert...)
- Fond spatial animé (étoiles scintillantes, nébuleuses)
- Halo bleu autour de tes planètes
- Interface minimaliste et futuriste
- **Performance cible**: 60 FPS constant

### UI/UX

- Canvas 3D principal (vue spatiale)
- Panel latéral contextuel
- Indicateur de ressources (haut gauche)
- Notifications discrètes (attaques, colonisations)

## 🛠️ Stack technique

### Client

```
- HTML5 / CSS3 / JavaScript
- Three.js (rendu 3D WebGL)
- Socket.io (temps réel)
- Responsive (PC / tablettes / mobile)
```

### Serveur

```
- Node.js + Express
- Socket.io (synchronisation temps réel)
- Gestion des parties et état du jeu
- Boucle serveur pour mise à jour périodique
```

### Optimisations

- Géométries instanciées pour performances
- Limitation polygones par planète
- Compression textures
- Architecture optimisée pour 50 joueurs + 50 planètes à 60 FPS

## 🚀 Roadmap

### MVP (v0.1)

- [x] Carte spatiale 3D
- [ ] Support 20-50 joueurs simultanés
- [ ] Système de colonisation
- [ ] Envoi de flottes
- [ ] Panel planète interactif

### Version 1.0

- [ ] Optimisation FPS finale
- [ ] Système de progression (stats, scores)
- [ ] Interface polie et immersive
- [ ] Balance gameplay affinée

### Évolutions futures (v2+)

- [ ] Système d'alliances
- [ ] Classement global (ELO/leaderboard)
- [ ] Compétences spéciales
- [ ] Skins de planètes personnalisables
- [ ] Mode Battle Royale

## 🏗️ Architecture multijoueur

**Temps réel**
- Communication via WebSocket (Socket.io)
- Identification unique par joueur (ID généré à la connexion)
- Synchronisation état des planètes côté serveur
- Broadcast des actions aux clients

**Scalabilité**
- Architecture optimisée pour 50 joueurs simultanés
- Gestion de multiples parties en parallèle
- État du jeu centralisé serveur

## 📦 Installation & Développement

```bash
# Clone le repo
git clone https://github.com/ton-user/colonize-io.git
cd colonize-io

# Install dependencies
npm install

# Run dev server
npm run dev

# Run production
npm start
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à ouvrir une issue ou une PR.

## 📝 License

AGPL 3

---

**Note**: Colonize.io est actuellement en développement actif. Le nom est provisoire et pourrait changer.

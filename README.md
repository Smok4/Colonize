# 🌌 Colonize.io - Alpha 3D V 0.3

> Un jeu de stratégie spatiale multijoueur temps réel - 100% navigateur

## 🌟 Nouveautés V0.3
- Vue spatiale complètement en 3D avec OrbitControls
- Effet de lueur sur les planètes possédées
- Nébuleuses animées pour plus d'immersion
- Champ d'étoiles amélioré avec scintillement
- Traces de flotte pour visualiser les mouvements
- Panneau latéral contextuel au survol des planètes
- Interface utilisateur améliorée et plus intuitive

## 📋 Vue d'ensemble

**Colonize.io** est un jeu de stratégie spatiale multijoueur en temps réel jouable directement dans le navigateur. Pas de téléchargement, pas d'installation - juste ton navigateur et l'espace infini.

### Concept

- **Type**: Stratégie spatiale temps réel
- **Joueurs**: 20-50 simultanés par partie
- **Technologie**: WebSocket + WebGL (Three.js) + Node.js
- **Style**: Immersion spatiale 3D avec planètes réalistes
- **Cible**: Joueurs occasionnels et compétitifs

## 🚀 Installation rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/Smok4/Colonize.git

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm start

# 4. Ouvrir dans le navigateur
http://localhost:3000
```

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

### Contrôles
- **Clic gauche**: Sélectionner/interagir avec une planète
- **Clic droit + déplacement**: Rotation de la caméra
- **Scroll**: Zoom avant/arrière
- **Clic gauche maintenu + déplacement**: Déplacer la vue

## 🎨 Caractéristiques techniques

### Graphismes
- Moteur 3D complet avec Three.js
- Planètes texturées et détaillées
- Effets visuels avancés (lueur, nébuleuses, traces de flotte)
- Interface utilisateur intuitive et réactive

### Audio
- Effets sonores immersifs
- Ambiance spatiale
- Sons de feedback pour les actions

### Performance
- Optimisé pour 60 FPS
- Support multi-plateformes
- Chargement rapide des ressources

## 🛠️ Stack technique

### Frontend
- HTML5 / CSS3 / JavaScript
- Three.js pour le rendu 3D
- Socket.io pour la communication temps réel

### Backend
- Node.js + Express
- WebSocket pour la synchronisation
- Architecture optimisée pour le multijoueur

## �️ Roadmap

### Prochaines fonctionnalités
- [ ] Système d'alliances
- [ ] Chat in-game
- [ ] Classement des joueurs
- [ ] Nouvelles unités et bâtiments
- [ ] Événements spéciaux
- [ ] Mode Battle Royale

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à :
- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📝 License

AGPL 3

---

**Note**: Colonize.io est actuellement en développement actif. Le nom est provisoire et pourrait changer.
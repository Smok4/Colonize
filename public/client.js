// public/client.js

// Ajout des styles pour les technologies
const techStyles = document.createElement('style');
techStyles.textContent = `
    #tech-panel {
        background: linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 20, 40, 0.95));
        border: 2px solid #1a4a6e;
        box-shadow: 0 0 30px rgba(0, 150, 255, 0.2);
        backdrop-filter: blur(10px);
    }

    .tech-tree {
        position: relative;
        padding: 20px;
        margin: 10px;
        border: 1px solid rgba(30, 144, 255, 0.2);
        border-radius: 15px;
        background: linear-gradient(45deg, rgba(0, 20, 40, 0.6), rgba(0, 40, 80, 0.6));
    }

    .tech-tier {
        position: relative;
        margin-bottom: 30px;
    }

    .tech-tier::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 2px;
        background: linear-gradient(to right, 
            rgba(30, 144, 255, 0), 
            rgba(30, 144, 255, 0.5), 
            rgba(30, 144, 255, 0));
        z-index: 0;
    }

    .tier-header {
        position: relative;
        z-index: 1;
        background: linear-gradient(90deg, 
            rgba(0, 20, 40, 0.9), 
            rgba(0, 40, 80, 0.9), 
            rgba(0, 20, 40, 0.9));
        padding: 10px 20px;
        border-radius: 20px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 0 20px rgba(0, 100, 255, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .tier-header:hover {
        background: linear-gradient(90deg,
            rgba(0, 30, 60, 0.9),
            rgba(0, 50, 100, 0.9),
            rgba(0, 30, 60, 0.9));
        box-shadow: 0 0 30px rgba(0, 150, 255, 0.3);
        transform: translateY(-2px);
    }

    .tier-header .toggle-icon {
        font-size: 1.2em;
        margin-right: 10px;
        transition: transform 0.3s ease;
    }

    .tier-header.collapsed .toggle-icon {
        transform: rotate(-90deg);
    }

    .tech-tier-items {
        transition: all 0.5s ease;
        max-height: 1000px;
        opacity: 1;
        overflow: hidden;
    }

    .tech-tier.collapsed .tech-tier-items {
        max-height: 0;
        opacity: 0;
        margin: 0;
        padding: 0;
    }

    .tier-header:active {
        transform: translateY(1px);
        box-shadow: 0 0 15px rgba(0, 150, 255, 0.2);
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        pointer-events: none;
        animation: rippleEffect 1s linear;
    }

    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 0.5;
            width: 0;
            height: 0;
        }
        100% {
            transform: scale(4);
            opacity: 0;
            width: 50px;
            height: 50px;
        }
    }

    .tech-item {
        position: relative;
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.9), rgba(0, 40, 80, 0.9));
        border: 2px solid #1a4a6e;
        border-radius: 15px;
        padding: 20px;
        margin: 15px;
        transition: all 0.4s ease;
        box-shadow: 0 0 20px rgba(0, 100, 255, 0.1);
        backdrop-filter: blur(5px);
        transform-style: preserve-3d;
        perspective: 1000px;
    }

    .tech-item:hover {
        transform: translateY(-5px) rotateX(5deg);
        box-shadow: 0 10px 25px rgba(0, 150, 255, 0.2);
        border-color: #2a8bff;
    }

    .tech-item.researched {
        border-color: #4CAF50;
        background: linear-gradient(135deg, 
            rgba(0, 40, 0, 0.9), 
            rgba(0, 60, 20, 0.9));
        box-shadow: 0 0 30px rgba(76, 175, 80, 0.2);
    }

    .tech-item.researched::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(76, 175, 80, 0.1));
        z-index: -1;
        border-radius: 13px;
    }

    .tech-item.available {
        border-color: #2196F3;
        animation: techPulse 2s infinite;
    }

    @keyframes techPulse {
        0% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.1); }
        50% { box-shadow: 0 0 30px rgba(33, 150, 243, 0.3); }
        100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.1); }
    }

    .tech-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tech-name {
        font-size: 1.2em;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        margin-left: 10px;
        flex-grow: 1;
    }

    .tech-status-icon {
        font-size: 1.4em;
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
    }

    .tech-item.researched {
        border-color: #4CAF50;
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.9), rgba(0, 50, 0, 0.8));
    }

    .tech-activation {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .tech-description {
        color: #a0c3e6;
        font-style: italic;
        margin-bottom: 15px;
        line-height: 1.4;
        padding: 10px;
        background: rgba(0, 20, 40, 0.3);
        border-radius: 8px;
        border-left: 3px solid #2196F3;
    }

    .tech-requirements {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
    }

    .requirement {
        font-size: 0.9em;
        padding: 4px 12px;
        border-radius: 12px;
        background: rgba(255, 0, 0, 0.2);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: #ff6b6b;
    }

    .requirement.met {
        background: rgba(76, 175, 80, 0.2);
        border-color: rgba(76, 175, 80, 0.3);
        color: #81c784;
    }

    .tech-cost {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }

    .resource-cost {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.9em;
        transition: all 0.3s ease;
    }

    .resource-cost.available {
        background: rgba(76, 175, 80, 0.2);
        border: 1px solid rgba(76, 175, 80, 0.3);
        color: #81c784;
    }

    .resource-cost.unavailable {
        background: rgba(255, 0, 0, 0.2);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: #ff6b6b;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        filter: drop-shadow(0 0 5px rgba(0, 150, 255, 0.5));
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #2a3b4c;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #4CAF50;
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }

    /* Effets d'activation/désactivation */
    .activation-ring {
        position: absolute;
        inset: -10px;
        border: 2px solid #4CAF50;
        border-radius: 20px;
        animation: activationRing 1s ease-out forwards;
    }

    @keyframes activationRing {
        0% {
            transform: scale(0.8);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    .tech-activation-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        color: white;
        border-radius: 10px;
        transform: translateY(100%);
        animation: slideUp 0.3s forwards;
        z-index: 1000;
    }

    .tech-activation-notification.success {
        background: linear-gradient(135deg, #43a047, #2e7d32);
        border: 2px solid #81c784;
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
    }

    .tech-activation-notification.warning {
        background: linear-gradient(135deg, #ef5350, #c62828);
        border: 2px solid #e57373;
        box-shadow: 0 0 20px rgba(239, 83, 80, 0.3);
    }

    @keyframes slideUp {
        to {
            transform: translateY(0);
        }
    }

    .tech-requirements-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 40, 80, 0.95));
        border: 2px solid #1a4a6e;
        border-radius: 15px;
        color: white;
        z-index: 1000;
        box-shadow: 0 0 30px rgba(0, 150, 255, 0.2);
        backdrop-filter: blur(10px);
        opacity: 1;
        transition: opacity 0.5s ease;
    }

    .tech-item.deactivating {
        animation: deactivateShake 0.5s ease-in-out;
    }

    @keyframes deactivateShake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }

    .power-indicator {
        width: 40px;
        height: 40px;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.5s ease;
    }

    .power-indicator:hover {
        transform: rotate(180deg);
    }

    .power-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 12px;
        background: radial-gradient(circle at center, #4CAF50, #2E7D32);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 
            0 0 10px #4CAF50,
            0 0 20px rgba(76, 175, 80, 0.5),
            0 0 30px rgba(76, 175, 80, 0.3);
        transition: all 0.3s ease;
    }

    .power-indicator.active .power-core::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 50%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.8));
        animation: corePulse 2s linear infinite;
    }

    @keyframes corePulse {
        0% { transform: rotate(0deg); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: rotate(360deg); opacity: 0; }
    }

    .power-rings {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid #4CAF50;
        border-radius: 50%;
        animation: pulse 2s infinite;
        opacity: 0;
    }

    .power-indicator.active .power-core {
        background: #00ff00;
        box-shadow: 0 0 20px #00ff00;
    }

    .power-indicator.active .power-rings {
        opacity: 1;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.8);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    .tech-power-usage {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .power-bar {
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .power-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.5s ease;
    }

    .power-text {
        font-size: 12px;
        color: #888;
        margin-top: 5px;
        display: block;
        text-align: center;
    }

    .tech-effects {
        position: relative;
        padding: 15px;
        background: rgba(0, 20, 40, 0.3);
        border-radius: 10px;
        overflow: hidden;
    }

    .tech-effects::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(to right,
            rgba(33, 150, 243, 0),
            rgba(33, 150, 243, 0.5),
            rgba(33, 150, 243, 0));
    }

    .tech-effects-content {
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
    }

    .tech-effects-content.researched {
        color: #81c784;
        text-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
    }

    .tech-effects-content span {
        display: inline-block;
        margin: 5px 0;
        padding: 5px 10px;
        border-radius: 15px;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(33, 150, 243, 0.3);
    }

    /* Animation pour les effets technologiques */
    @keyframes effectGlow {
        0% { text-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
        50% { text-shadow: 0 0 15px rgba(76, 175, 80, 0.8); }
        100% { text-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
    }

    .tech-item.researched .tech-effects-content span {
        animation: effectGlow 2s infinite;
    }

    /* Style pour les notifications */
    .tech-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.9), rgba(0, 40, 80, 0.9));
        border: 2px solid #2196F3;
        border-radius: 10px;
        color: white;
        font-size: 1.1em;
        z-index: 1000;
        transform: translateY(100%);
        animation: slideIn 0.5s forwards, fadeOut 0.5s 2.5s forwards;
        box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
    }

    /* Style pour l'infobulle de planète */
    #planet-tooltip {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 40, 80, 0.95));
        border: 2px solid #1a4a6e;
        border-radius: 15px;
        padding: 20px;
        color: white;
        width: 300px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 0 30px rgba(0, 150, 255, 0.2);
        backdrop-filter: blur(10px);
        z-index: 1000;
    }

    #planet-tooltip.visible {
        opacity: 1;
    }

    .tooltip-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .tooltip-planet-type {
        font-size: 1.2em;
        font-weight: bold;
        margin-left: 10px;
    }

    .tooltip-owner {
        color: #4CAF50;
        font-style: italic;
        margin-left: auto;
    }

    .tooltip-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-top: 10px;
    }

    .tooltip-stat {
        background: rgba(0, 0, 0, 0.2);
        padding: 8px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .tooltip-stat-icon {
        font-size: 1.2em;
    }

    .tooltip-stat-value {
        color: #64B5F6;
    }

    /* Style pour le leaderboard */
    #leaderboard {
        position: fixed;
        left: 20px;
        top: 130px;
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 40, 80, 0.95));
        border: 2px solid #1a4a6e;
        border-radius: 15px;
        padding: 15px;
        color: white;
        width: 250px;
        box-shadow: 0 0 30px rgba(0, 150, 255, 0.2);
        backdrop-filter: blur(10px);
    }

    .leaderboard-header {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
    }

    .leaderboard-player {
        display: flex;
        align-items: center;
        padding: 8px;
        margin: 5px 0;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    }

    .leaderboard-player:hover {
        background: rgba(0, 0, 0, 0.3);
        transform: translateX(5px);
    }

    .player-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .player-stats {
        margin-left: auto;
        display: flex;
        gap: 15px;
    }

    .player-stat {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .player-stat-icon {
        font-size: 0.9em;
    }

    /* Style pour l'indicateur de planète du joueur */
    .planet-indicator {
        position: absolute;
        pointer-events: none;
        animation: bounce 2s infinite;
    }

    .planet-arrow {
        width: 40px;
        height: 40px;
        position: relative;
        margin-bottom: 10px;
    }

    .planet-arrow::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border-top: 4px solid #4CAF50;
        border-right: 4px solid #4CAF50;
        transform: rotate(135deg);
    }

    .planet-highlight {
        position: absolute;
        border: 3px solid #4CAF50;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
    }

    @keyframes slideIn {
        to { transform: translateY(0); }
    }

    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(techStyles);

// ---------- Variables Globales ----------
let gameState = { 
    planets: [], 
    fleets: [], 
    players: {}, 
    leaderboard: [] 
};
let selectedPlanetId = null;
let myPlayerId = null;
let mousePos = { x: 0, y: 0 };
let previousPlanetsState = {};
let clientPlanets = {};
let animations = [];
let stars = [];
let lastTime = 0;
let camera = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let hasDragged = false;
let isSettingRallyPoint = false;
let isDrawingPath = false;
let currentPath = [];
let currentZoom = 1.0;

// ---------- Constantes ----------
const LOGICAL_WIDTH = 3200;
const LOGICAL_HEIGHT = 1800;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_SPEED = 0.06;
const ZOOM_MARGIN = 0.05;
const NEUTRAL_COLOR = '#999999';

const socket = io({
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

// Gestion des événements de connexion Socket.IO
socket.on('connect', () => {
    console.log('Connecté au serveur!');
    document.body.classList.remove('disconnected');
    loadTechnologyStates(); // Charger l'état des technologies
});

socket.on('disconnect', () => {
    console.log('Déconnecté du serveur');
    document.body.classList.add('disconnected');
});

socket.on('connect_error', (error) => {
    console.error('Erreur de connexion:', error);
});

socket.on('connected', (data) => {
    console.log('ID reçu du serveur:', data.id);
    console.log(data.message);
});

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.style.cursor = 'grab';

// Fonction pour contraindre la caméra aux limites de la carte
function constrainCamera() {
    const viewWidth = canvas.width / currentZoom;
    const viewHeight = canvas.height / currentZoom;
    
    // S'assurer que la vue ne dépasse pas les limites de la carte
    if (viewWidth >= LOGICAL_WIDTH) {
        // Si la vue est plus large que la carte, centrer horizontalement
        camera.x = (LOGICAL_WIDTH - viewWidth) / 2;
    } else {
        // Sinon, garder la vue dans les limites
        camera.x = Math.max(0, Math.min(LOGICAL_WIDTH - viewWidth, camera.x));
    }
    
    if (viewHeight >= LOGICAL_HEIGHT) {
        // Si la vue est plus haute que la carte, centrer verticalement
        camera.y = (LOGICAL_HEIGHT - viewHeight) / 2;
    } else {
        // Sinon, garder la vue dans les limites
        camera.y = Math.max(0, Math.min(LOGICAL_HEIGHT - viewHeight, camera.y));
    }
}

// Déjà déclaré au début du fichier, ces constantes sont supprimées

// Fonction utilitaire pour contraindre une valeur entre min et max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Fonction déjà déclarée, cette version est supprimée

// --- Références UI ---
const resourceValues = {
    credits: document.querySelector('.credits .resource-value'),
    minerals: document.querySelector('.minerals .resource-value'),
    energy: document.querySelector('.energy .resource-value')
};

const selectionPanel = document.getElementById('selection-panel');
const planetName = document.getElementById('planet-name');
const planetStats = document.getElementById('planet-stats');
const garrisonList = document.getElementById('garrison-list');
const upgradeForgeBtn = document.querySelector('.upgrade-btn[data-type="forge"]');
const upgradeShieldBtn = document.querySelector('.upgrade-btn[data-type="shield"]');
const gameOverScreen = document.getElementById('game-over-screen');

if (gameOverScreen) {
    gameOverScreen.classList.add('hidden');
}

// Variables globales déjà déclarées au début du fichier

// --- Contrôle du pourcentage de flotte ---
const fleetPercentageSlider = document.getElementById('fleet-percentage');
const fleetPercentageValue = document.getElementById('fleet-percentage-value');

// Fonction simplifiée pour calculer les vaisseaux à envoyer
function calculateFleetToSend(ships) {
    const percentage = parseInt(fleetPercentageSlider.value) / 100;
    const fleetToSend = {};
    for (const type in ships) {
        fleetToSend[type] = Math.floor(ships[type] * percentage);
    }
    return fleetToSend;
}

// Mise à jour de l'affichage de la garnison
function updateGarrisonDisplay() {
    const planet = gameState.planets.find(p => p.id === selectedPlanetId);
    if (!planet || !garrisonList) return;
    
    const percentage = parseInt(fleetPercentageSlider.value);
    const selectedShips = calculateFleetToSend(planet.ships);
    
    garrisonList.innerHTML = `
        <span>Ch: ${selectedShips.fighter}/${planet.ships.fighter}</span>
        <span>Cr: ${selectedShips.cruiser}/${planet.ships.cruiser}</span>
        <span>Cu: ${selectedShips.battleship}/${planet.ships.battleship}</span>
    `;
}

// Écouteur d'événement pour le slider
if (fleetPercentageSlider && fleetPercentageValue) {
    fleetPercentageSlider.addEventListener('input', function() {
        const value = this.value;
        fleetPercentageValue.textContent = `${value}%`;
        updateGarrisonDisplay();
    });
}

// --- Gestionnaire de Textures ---
const textures = {};
function loadTextures() {
    const textureNames = [
        'moon', 
        'sun', 
        'saturn', 
        'earth', 
        'mars', 
        'mercury', 
        'jupiter', 
        'neptune', 
        'uranus'
    ];

    const promises = textureNames.map(name => new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `textures/${name}.jpg`;
        
        img.onload = () => {
            console.log(`Texture ${name} chargée.`);
            textures[name] = img;
            resolve();
        };
        
        img.onerror = () => {
            console.error(`Erreur de chargement de la texture ${name}`);
            reject(new Error(`Le fichier textures/${name}.jpg est manquant ou inaccessible.`));
        };
    }));
    
    return Promise.all(promises)
        .then(() => {
            console.log('Toutes les textures ont été chargées avec succès.');
        })
        .catch(error => {
            console.error('Erreur lors du chargement des textures:', error);
            throw error;
        });
}

// --- Classes pour les Animations ---
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 2;
        this.life = 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.flickerRate = Math.random() * 0.2 + 0.8;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= dt * 0.8; // Durée de vie plus longue
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.rotation += this.rotationSpeed;
        this.size *= 0.99;
    }

    draw() {
        const flicker = 0.7 + Math.sin(Date.now() * this.flickerRate) * 0.3;
        const alpha = Math.max(0, this.life) * flicker;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Particule principale
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${alpha})`);
        gradient.addColorStop(0.6, `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Forme en étoile
        for(let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2 / 5) + this.rotation;
            const length = this.size * (1 + Math.sin(Date.now() * 0.01) * 0.2);
            if(i === 0) {
                ctx.moveTo(Math.cos(angle) * length, Math.sin(angle) * length);
            } else {
                ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Effet de lueur
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        
        ctx.restore();
    }
}
class Explosion {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.shockwave = { radius: 0, opacity: 1 };
        this.isDone = false;
        this.age = 0;
        
        // Création des particules en cercles concentriques
        const rings = 3;
        const particlesPerRing = 15;
        
        for (let ring = 0; ring < rings; ring++) {
            for (let i = 0; i < particlesPerRing; i++) {
                const angle = (i / particlesPerRing) * Math.PI * 2;
                const variance = (Math.random() - 0.5) * 0.2;
                this.particles.push(new Particle(
                    x + Math.cos(angle) * ring * 10,
                    y + Math.sin(angle) * ring * 10,
                    color
                ));
            }
        }
        
        // Particules additionnelles aléatoires
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    update(dt) {
        this.age += dt;
        
        // Mise à jour de l'onde de choc
        this.shockwave.radius += dt * 200;
        this.shockwave.opacity = Math.max(0, 1 - this.age * 2);

        // Mise à jour des particules
        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => p.life > 0);

        // Vérification si l'explosion est terminée
        if (this.particles.length === 0 && this.shockwave.opacity <= 0) {
            this.isDone = true;
        }
    }

    draw() {
        // Dessin de l'onde de choc
        if (this.shockwave.opacity > 0) {
            // Onde de choc principale
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.shockwave.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.shockwave.opacity * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Effet de lueur de l'onde de choc
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.shockwave.radius * 0.8,
                this.x, this.y, this.shockwave.radius
            );
            gradient.addColorStop(0, `rgba(${parseInt(this.color.slice(1,3),16)}, ${parseInt(this.color.slice(3,5),16)}, ${parseInt(this.color.slice(5,7),16)}, 0)`);
            gradient.addColorStop(0.5, `rgba(${parseInt(this.color.slice(1,3),16)}, ${parseInt(this.color.slice(3,5),16)}, ${parseInt(this.color.slice(5,7),16)}, ${this.shockwave.opacity * 0.2})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        // Effet de lueur centrale
        const centerGlow = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, 50
        );
        centerGlow.addColorStop(0, `rgba(${parseInt(this.color.slice(1,3),16)}, ${parseInt(this.color.slice(3,5),16)}, ${parseInt(this.color.slice(5,7),16)}, ${Math.max(0, 0.5 - this.age)})`);
        centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = centerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 50, 0, Math.PI * 2);
        ctx.fill();

        // Dessin des particules
        this.particles.forEach(p => p.draw());
    }
}
class CaptureRing {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        this.color = color;
        this.life = 1;
        this.isDone = false;
        this.rings = [];
        this.particles = [];
        
        // Créer plusieurs anneaux
        for (let i = 0; i < 3; i++) {
            this.rings.push({
                radius: this.radius,
                opacity: 1,
                speed: 80 + i * 20,
                phase: i * (Math.PI / 3)
            });
        }
        
        // Créer des particules d'énergie
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = this.radius * (0.8 + Math.random() * 0.4);
            this.particles.push({
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance,
                angle: angle,
                speed: 0.5 + Math.random() * 0.5,
                size: 2 + Math.random() * 2,
                opacity: 0.8 + Math.random() * 0.2
            });
        }
    }

    update(dt) {
        // Mise à jour des anneaux
        this.rings.forEach(ring => {
            ring.radius += dt * ring.speed;
            ring.opacity = Math.max(0, this.life - (ring.radius - this.baseRadius) / 200);
        });

        // Mise à jour des particules
        this.particles.forEach(particle => {
            particle.angle += particle.speed * dt;
            particle.x = this.x + Math.cos(particle.angle) * this.baseRadius;
            particle.y = this.y + Math.sin(particle.angle) * this.baseRadius;
            particle.opacity = Math.max(0, this.life);
        });

        // Mise à jour de la durée de vie
        this.life -= dt * 0.7;
        if (this.life <= 0) {
            this.isDone = true;
        }
    }

    draw() {
        const rgb = {
            r: parseInt(this.color.slice(1, 3), 16),
            g: parseInt(this.color.slice(3, 5), 16),
            b: parseInt(this.color.slice(5, 7), 16)
        };

        // Dessiner le halo central
        const centerGlow = ctx.createRadialGradient(
            this.x, this.y, this.baseRadius * 0.8,
            this.x, this.y, this.baseRadius * 1.2
        );
        centerGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        centerGlow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.life * 0.2})`);
        centerGlow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        
        ctx.fillStyle = centerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Dessiner les anneaux avec effet de lueur
        this.rings.forEach(ring => {
            ctx.beginPath();
            ctx.arc(this.x, this.y, ring.radius, 0, Math.PI * 2);
            
            // Effet de lueur
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${ring.opacity})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Réinitialiser les effets de lueur
            ctx.shadowBlur = 0;
        });

        // Dessiner les particules
        this.particles.forEach(particle => {
            const flicker = 0.7 + Math.sin(Date.now() * 0.01 + particle.angle) * 0.3;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${particle.opacity * flicker})`;
            
            // Effet de lueur pour les particules
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Effet de pulsation au centre
        const pulseSize = this.baseRadius * (1 + Math.sin(Date.now() * 0.005) * 0.1);
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.life * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// --- Fonctions Utilitaires ---
const sfx = { audioContext: null, sounds: {}, init() { this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); }, unlock() { if (this.audioContext && this.audioContext.state === 'suspended') { this.audioContext.resume(); } }, load(name, path, loop = false, volume = 1.0) { if (!this.audioContext) this.init(); fetch(path).then(response => { if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return response.arrayBuffer(); }).then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer)).then(audioBuffer => { this.sounds[name] = { buffer: audioBuffer, loop, volume }; if (name === 'ambient') { this.play('ambient'); } }).catch(e => console.error(`Erreur lors du chargement du son ${name}:`, e)); }, play(name) { if (!this.sounds[name] || !this.audioContext) return; this.unlock(); const source = this.audioContext.createBufferSource(); source.buffer = this.sounds[name].buffer; const gainNode = this.audioContext.createGain(); gainNode.gain.setValueAtTime(this.sounds[name].volume, this.audioContext.currentTime); source.connect(gainNode).connect(this.audioContext.destination); source.loop = this.sounds[name].loop; source.start(0); } };
function updateAndDrawAnimations(dt) { animations.forEach(anim => anim.update(dt)); animations = animations.filter(anim => !anim.isDone); animations.forEach(anim => anim.draw()); }
function initStars() { for (let i = 0; i < 200; i++) { stars.push({ x: Math.random() * LOGICAL_WIDTH, y: Math.random() * LOGICAL_HEIGHT, radius: Math.random() * 1.5, alpha: Math.random(), speed: Math.random() * 0.2 + 0.1 }); } }
function drawStars() { stars.forEach(star => { star.y -= star.speed; if (star.y < 0) { star.y = LOGICAL_HEIGHT; } ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`; ctx.fill(); }); }
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function getLogicalMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) / currentZoom + camera.x,
        y: (event.clientY - rect.top) / currentZoom + camera.y
    };
}
function getClickedPlanet(logicalMousePos) {
    const CLICK_MARGIN = 1.3; // Marge de 30% pour une meilleure accessibilité
    const MAX_CLICK_RADIUS = 50; // Rayon maximum en pixels pour éviter des zones de clic trop grandes
    
    // Debug des planètes disponibles
    console.log("Planètes dans le gameState:", gameState.planets.length);
    
    // Calculer les distances une seule fois pour chaque planète
    const planetsWithDistance = gameState.planets
        .map(planet => {
            // Calculer la distance avec le théorème de Pythagore
            const dx = planet.x - logicalMousePos.x;
            const dy = planet.y - logicalMousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculer le rayon de clic avec limite maximum
            const clickRadius = Math.min(planet.radius * CLICK_MARGIN, MAX_CLICK_RADIUS);
            
            return {
                planet,
                distance,
                clickRadius
            };
        });
    
    // Debug des distances calculées
    console.log("Distances calculées:", planetsWithDistance.map(p => ({
        id: p.planet.id,
        distance: p.distance,
        radius: p.clickRadius
    })));
    
    // Trier par distance et retourner la planète la plus proche dans le rayon de clic
    const nearestPlanet = planetsWithDistance
        .filter(p => p.distance < p.clickRadius)
        .sort((a, b) => a.distance - b.distance)[0];
    
    console.log("Planète la plus proche trouvée:", nearestPlanet ? nearestPlanet.planet : null);
    
    return nearestPlanet ? nearestPlanet.planet : null;
}

// --- Fonctions de Dessin ---
function drawPlanet(planet) {
    const texture = textures[planet.type];
    const time = Date.now() * 0.001;

    // Sauvegarder le contexte initial
    ctx.save();
    
    // Effet de base avec halo lumineux
    ctx.globalCompositeOperation = 'lighter';
    const baseGlow = ctx.createRadialGradient(
        planet.x, planet.y, planet.radius * 0.5,
        planet.x, planet.y, planet.radius * 1.5
    );
    baseGlow.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    baseGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    baseGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = baseGlow;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Debug : Afficher la zone de clic si la planète est sélectionnée
    if (planet.id === selectedPlanetId) {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius * 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Restaurer le contexte pour le prochain effet
    ctx.restore();
    ctx.save();
    
    // Effet d'ombre portée
    const shadowGradient = ctx.createRadialGradient(
        planet.x + planet.radius * 0.2, planet.y + planet.radius * 0.2,
        0,
        planet.x + planet.radius * 0.2, planet.y + planet.radius * 0.2,
        planet.radius * 1.2
    );
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    shadowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.arc(planet.x + planet.radius * 0.2, planet.y + planet.radius * 0.2, planet.radius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Restaurer le contexte pour le prochain effet
    ctx.restore();
    ctx.save();
    
    // Dessin de la planète
    ctx.globalCompositeOperation = 'source-over';
    
    // Créer un masque circulaire
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.clip();
    
    if (texture) {
        ctx.drawImage(
            texture,
            planet.x - planet.radius,
            planet.y - planet.radius,
            planet.radius * 2,
            planet.radius * 2
        );
    } else {
        ctx.fillStyle = NEUTRAL_COLOR;
        ctx.fill();
    }

    // Restaurer le contexte pour le prochain effet
    ctx.restore();
    ctx.save();

    // Atmosphère
    const player = gameState.players[planet.owner];
    if (player) {
        const color = player.color;
        const atmosphereSize = planet.radius + 7 + Math.sin(time) * 2;
        
        // Convertir la couleur hex en RGB
        const r = parseInt(color.slice(1,3),16);
        const g = parseInt(color.slice(3,5),16);
        const b = parseInt(color.slice(5,7),16);

        ctx.globalCompositeOperation = 'screen';
        const atmosGrad = ctx.createRadialGradient(
            planet.x, planet.y, planet.radius,
            planet.x, planet.y, atmosphereSize * 1.4
        );
        atmosGrad.addColorStop(0, 'transparent');
        atmosGrad.addColorStop(0.4, `rgba(${r},${g},${b},0.1)`);
        atmosGrad.addColorStop(0.6, `rgba(${r},${g},${b},0.15)`);
        atmosGrad.addColorStop(0.8, `rgba(${r},${g},${b},0.1)`);
        atmosGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = atmosGrad;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, atmosphereSize * 1.4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Restaurer le contexte pour le prochain effet
    ctx.restore();
    ctx.save();

    // Bouclier
    if (planet.shieldHP > 0) {
        ctx.globalCompositeOperation = 'lighter';
        const pulseTime = Date.now() * 0.003;
        const pulse = Math.sin(pulseTime) * 3;
        const opacity = 0.5 + Math.sin(pulseTime) * 0.2;
        
        ctx.strokeStyle = `rgba(0, 220, 255, ${opacity})`;
        ctx.lineWidth = 2 + pulse/2;
        
        for (let i = 0; i < 3; i++) {
            const rotation = (pulseTime + i * Math.PI / 3) % (Math.PI * 2);
            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = rotation + j * Math.PI / 3;
                const radius = planet.radius + 10 + pulse;
                const x = planet.x + Math.cos(angle) * radius;
                const y = planet.y + Math.sin(angle) * radius;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        const shieldGlow = ctx.createRadialGradient(
            planet.x, planet.y, planet.radius + 5,
            planet.x, planet.y, planet.radius + 15 + pulse
        );
        shieldGlow.addColorStop(0, 'rgba(0, 220, 255, 0.1)');
        shieldGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = shieldGlow;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius + 15 + pulse, 0, Math.PI * 2);
        ctx.fill();
    }

    // Restaurer le contexte pour le prochain effet
    ctx.restore();
    ctx.save();

    // Sélection
    if (planet.id === selectedPlanetId) {
        const selectionTime = Date.now() * 0.006;
        const selectionPulse = Math.sin(selectionTime) * 2;
        const selectionOpacity = 0.7 + Math.sin(selectionTime) * 0.3;
        
        ctx.strokeStyle = `rgba(0, 255, 0, ${selectionOpacity})`;
        ctx.lineWidth = 3 + selectionPulse;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius + 5 + selectionPulse/2, 0, Math.PI * 2);
        ctx.stroke();
        
        for (let i = 0; i < 8; i++) {
            const angle = selectionTime + i * Math.PI / 4;
            const orbitRadius = planet.radius + 15 + Math.sin(selectionTime * 2 + i) * 3;
            const x = planet.x + Math.cos(angle) * orbitRadius;
            const y = planet.y + Math.sin(angle) * orbitRadius;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 0, ${0.5 + Math.sin(selectionTime + i) * 0.5})`;
            ctx.fill();
        }
    }

    // Restaurer le contexte pour le prochain effet
    ctx.restore();
    ctx.save();

    // Nombre de vaisseaux
    if (planet.ships) {
        ctx.globalCompositeOperation = 'source-over';
        const totalShips = Object.values(planet.ships).reduce((a, b) => a + b, 0);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.max(12, Math.min(16, planet.radius / 3))}px "Roboto Mono"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 3;
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeText(totalShips, planet.x, planet.y);
        ctx.fillText(totalShips, planet.x, planet.y);
    }

    // Restaurer le contexte final
    ctx.restore();
}
// Fonction supprimée
function drawSunGlow(planet) { const pulse = Math.sin(Date.now() * 0.002) * 10; const glowGradient = ctx.createRadialGradient(planet.x, planet.y, planet.radius, planet.x, planet.y, planet.radius + 20 + pulse); glowGradient.addColorStop(0, 'rgba(255, 220, 100, 0.6)'); glowGradient.addColorStop(0.8, 'rgba(255, 200, 0, 0.2)'); glowGradient.addColorStop(1, 'transparent'); ctx.fillStyle = glowGradient; ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius + 20 + pulse, 0, Math.PI * 2); ctx.fill(); }

// --- Boucle de Jeu Principale ---
function updatePlanetAnimations(dt) {
    // Les planètes sont maintenant immobiles
    // On garde la fonction vide pour d'éventuelles animations futures
}

// Gestionnaire de mouvement de souris pour l'infobulle
canvas.addEventListener('mousemove', (event) => {
    const mousePos = getLogicalMousePos(event);
    const hoveredPlanet = getClickedPlanet(mousePos);
    updatePlanetTooltip(hoveredPlanet);
});

canvas.addEventListener('mouseout', () => {
    updatePlanetTooltip(null);
});

function gameLoop(currentTime) {
    const dt = (currentTime - lastTime) / 1000; lastTime = currentTime;
    updatePlanetAnimations(dt);
    updateLeaderboard(); // Mise à jour du leaderboard à chaque frame
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Appliquer le zoom et la caméra
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(-camera.x, -camera.y);
    
    // Dessiner le chemin en cours de création
    if (isDrawingPath && currentPath.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentPath[0].x, currentPath[0].y);
        for (let i = 1; i < currentPath.length; i++) {
            ctx.lineTo(currentPath[i].x, currentPath[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Effacer tout le canvas
    ctx.clearRect(0, 0, canvas.width / currentZoom, canvas.height / currentZoom);
    drawStars();

    const myPlayer = gameState.players[myPlayerId];
    if (myPlayer) {
        // Calculer les ressources totales en incluant les ressources stockées sur les planètes
        const totalResources = {
            credits: myPlayer.resources.credits,
            minerals: myPlayer.resources.minerals,
            energy: myPlayer.resources.energy
        };

        // Ajouter les ressources stockées sur chaque planète
        gameState.planets.forEach(planet => {
            if (planet.owner === myPlayerId) {
                if (planet.resources) {
                    totalResources.minerals += Math.floor(planet.resources.minerals.storage || 0);
                    totalResources.energy += Math.floor(planet.resources.energy.storage || 0);
                }
            }
        });

        // Mettre à jour l'affichage
        for (const resource in resourceValues) {
            const newValue = Math.floor(totalResources[resource]);
            const oldValue = parseInt(resourceValues[resource].textContent) || 0;
            
            if (newValue !== oldValue) {
                resourceValues[resource].textContent = newValue;
                resourceValues[resource].classList.remove('updating');
                void resourceValues[resource].offsetWidth; // Force reflow
                resourceValues[resource].classList.add('updating');
            }
        }
    }

    gameState.planets.forEach(planet => {
        drawPlanet(planet);
    });
    gameState.fleets.forEach(fleet => { const player = gameState.players[fleet.owner]; ctx.fillStyle = player ? player.color : NEUTRAL_COLOR; ctx.beginPath(); ctx.arc(fleet.x, fleet.y, 5, 0, Math.PI * 2); ctx.fill(); if (fleet.isBoosted) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0; } });
    gameState.planets.forEach(planet => {
        if (planet.type === 'sun') {
            drawSunGlow(planet);
        }
    });
    updateAndDrawAnimations(dt);
    
    if (selectedPlanetId !== null) { const originPlanet = gameState.planets.find(p => p.id === selectedPlanetId); if (originPlanet) { ctx.beginPath(); ctx.moveTo(originPlanet.x, originPlanet.y); ctx.lineTo(mousePos.x, mousePos.y); ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; ctx.lineWidth = 2; ctx.setLineDash([5, 10]); ctx.stroke(); ctx.setLineDash([]); } }

    const selectedPlanet = gameState.planets.find(p => p.id === selectedPlanetId);
    if (selectedPlanet && selectedPlanet.owner === myPlayerId && myPlayer) {
        selectionPanel.classList.remove('hidden');
        planetName.textContent = `Planète ${selectedPlanet.type} #${selectedPlanet.id}`;
        
        planetStats.innerHTML = `
            <span>Fonderie Lvl: ${selectedPlanet.forgeLevel}</span> | 
            <span>Bouclier: ${selectedPlanet.shieldHP} HP</span><br>
            <span>Production Minerais: ${selectedPlanet.resources.minerals.production}/s</span> | 
            <span>Stock: ${Math.floor(selectedPlanet.resources.minerals.storage)}</span><br>
            <span>Production Énergie: ${selectedPlanet.resources.energy.production}/s</span> | 
            <span>Stock: ${Math.floor(selectedPlanet.resources.energy.storage)}</span>
        `;
        
        updateGarrisonDisplay();
        const forgeCost = 250 * (selectedPlanet.forgeLevel + 1);
        upgradeForgeBtn.textContent = `Fonderie (${forgeCost} Cr)`;
        upgradeForgeBtn.disabled = myPlayer.credits < forgeCost;
        upgradeShieldBtn.disabled = selectedPlanet.shieldHP > 0;
        upgradeShieldBtn.textContent = selectedPlanet.shieldHP > 0 ? 'Bouclier Actif' : `Bouclier (400 Cr)`;
    } else {
        selectionPanel.classList.add('hidden');
    }

    ctx.restore();
    requestAnimationFrame(gameLoop);
}

// --- Gestion de l'arbre technologique ---

// Fonction pour vérifier les conditions d'activation d'une technologie
function checkActivationRequirements(tech, player) {
    // Vérifier les ressources requises pour l'activation
    const activationCost = tech.activationCost || {
        energy: Math.floor(tech.cost.energy * 0.1) || 0,
        minerals: Math.floor(tech.cost.minerals * 0.1) || 0
    };

    // Calculer les ressources totales disponibles
    const totalResources = {...player.resources};
    gameState.planets.forEach(planet => {
        if (planet.owner === myPlayerId && planet.resources) {
            totalResources.minerals = (totalResources.minerals || 0) + (planet.resources.minerals.storage || 0);
            totalResources.energy = (totalResources.energy || 0) + (planet.resources.energy.storage || 0);
        }
    });

    // Vérifier si on a assez de ressources
    for (const [resource, amount] of Object.entries(activationCost)) {
        if (totalResources[resource] < amount) {
            return false;
        }
    }

    // Vérifier les prérequis d'activation spéciaux
    if (tech.activationRequirements) {
        for (const req of tech.activationRequirements) {
            if (!req.check(player)) {
                return false;
            }
        }
    }

    return true;
}

// Fonction pour activer une technologie
function activateTechnology(tech, category) {
    const player = gameState.players[myPlayerId];
    if (!player) return false;

    if (!checkActivationRequirements(tech, player)) {
        showActivationRequirements(tech, player);
        return false;
    }

    // Consommer les ressources d'activation
    const activationCost = tech.activationCost || {
        energy: Math.floor(tech.cost.energy * 0.1) || 0,
        minerals: Math.floor(tech.cost.minerals * 0.1) || 0
    };

    // Émettre l'événement d'activation
    socket.emit('activateTechnology', {
        techId: tech.id,
        category: category,
        cost: activationCost
    });

    // Effet visuel et sonore d'activation
    playActivationEffect(tech);

    return true;
}

// Fonction pour désactiver une technologie
function deactivateTechnology(tech, category) {
    socket.emit('deactivateTechnology', {
        techId: tech.id,
        category: category
    });

    // Effet visuel et sonore de désactivation
    playDeactivationEffect(tech);
}

// Fonction pour afficher les conditions d'activation
function showActivationRequirements(tech, player) {
    const activationCost = tech.activationCost || {
        energy: Math.floor(tech.cost.energy * 0.1) || 0,
        minerals: Math.floor(tech.cost.minerals * 0.1) || 0
    };

    const totalResources = {...player.resources};
    gameState.planets.forEach(planet => {
        if (planet.owner === myPlayerId && planet.resources) {
            totalResources.minerals = (totalResources.minerals || 0) + (planet.resources.minerals.storage || 0);
            totalResources.energy = (totalResources.energy || 0) + (planet.resources.energy.storage || 0);
        }
    });

    let requirements = ['Pour activer cette technologie, il vous faut :'];
    
    for (const [resource, amount] of Object.entries(activationCost)) {
        const current = totalResources[resource] || 0;
        const icon = resource === 'energy' ? '⚡' : '⛰️';
        requirements.push(`${icon} ${resource}: ${current}/${amount}`);
    }

    if (tech.activationRequirements) {
        tech.activationRequirements.forEach(req => {
            if (!req.check(player)) {
                requirements.push(`❌ ${req.description}`);
            }
        });
    }

    // Créer une notification avec les requis
    const notification = document.createElement('div');
    notification.className = 'tech-requirements-notification';
    notification.innerHTML = requirements.join('<br>');
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Effets visuels et sonores
function playActivationEffect(tech) {
    // Son d'activation
    sfx.play('capture');

    // Animation d'activation
    const techElement = document.querySelector(`[data-tech-id="${tech.id}"]`);
    if (techElement) {
        const activationRing = document.createElement('div');
        activationRing.className = 'activation-ring';
        techElement.appendChild(activationRing);
        
        setTimeout(() => activationRing.remove(), 1000);

        // Notification
        const notification = document.createElement('div');
        notification.className = 'tech-activation-notification success';
        notification.innerHTML = `🔋 ${tech.name} activée!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
}

function playDeactivationEffect(tech) {
    // Son de désactivation
    sfx.play('loss');

    // Animation de désactivation
    const techElement = document.querySelector(`[data-tech-id="${tech.id}"]`);
    if (techElement) {
        techElement.classList.add('deactivating');
        setTimeout(() => techElement.classList.remove('deactivating'), 1000);

        // Notification
        const notification = document.createElement('div');
        notification.className = 'tech-activation-notification warning';
        notification.innerHTML = `💤 ${tech.name} désactivée`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
}

const TECH_TREE = {
    military: {
        improvedWeapons: {
            name: "Armement Amélioré",
            description: "Augmente la puissance d'attaque des vaisseaux",
            tier: 1,
            cost: { credits: 300, minerals: 100 },
            effects: { attackBonus: 0.2 },
            requirements: []
        },
        reinforcedHulls: {
            name: "Coques Renforcées",
            description: "Augmente la résistance des vaisseaux",
            tier: 1,
            cost: { credits: 400, minerals: 300 },
            effects: { hpBonus: 0.25 },
            requirements: []
        },
        advancedShields: {
            name: "Boucliers Avancés",
            description: "Améliore la protection des boucliers planétaires",
            tier: 2,
            cost: { credits: 800, minerals: 400, energy: 200 },
            requirements: ["reinforcedHulls"],
            effects: { shieldBonus: 0.4 }
        },
        quantumTargeting: {
            name: "Visée Quantique",
            description: "Améliore la précision des vaisseaux en combat",
            tier: 2,
            cost: { credits: 800, minerals: 300, energy: 300 },
            requirements: ["improvedWeapons"],
            effects: { accuracyBonus: 0.3 }
        }
    },
    economy: {
        efficientMining: {
            name: "Extraction Efficace",
            description: "Améliore la production de minerais",
            tier: 1,
            cost: { credits: 400, energy: 100 },
            effects: { mineralProductionBonus: 0.25 },
            requirements: []
        },
        advancedReactors: {
            name: "Réacteurs Avancés",
            description: "Améliore la production d'énergie",
            tier: 1,
            cost: { credits: 400, minerals: 200 },
            effects: { energyProductionBonus: 0.3 },
            requirements: []
        },
        automatedMining: {
            name: "Extraction Automatisée",
            description: "Robots mineurs augmentant significativement la production",
            tier: 2,
            cost: { credits: 800, energy: 300 },
            requirements: ["efficientMining"],
            effects: { mineralProductionBonus: 0.4, workerEfficiency: 0.2 }
        },
        fusionPowerplants: {
            name: "Centrales à Fusion",
            description: "Centrales énergétiques hautement efficaces",
            tier: 2,
            cost: { credits: 900, minerals: 400 },
            requirements: ["advancedReactors"],
            effects: { energyProductionBonus: 0.5, energyStorageBonus: 0.3 }
        }
    },
    exploration: {
        improvedEngines: {
            name: "Moteurs Améliorés",
            description: "Augmente la vitesse des vaisseaux",
            tier: 1,
            cost: { credits: 300, energy: 150 },
            effects: { speedBonus: 0.3 },
            requirements: []
        },
        advancedSensors: {
            name: "Capteurs Avancés",
            description: "Améliore la portée de détection",
            tier: 1,
            cost: { credits: 400, energy: 200 },
            effects: { scanRange: 0.4 },
            requirements: []
        },
        warpDrive: {
            name: "Moteur Warp",
            description: "Permet des sauts interstellaires rapides",
            tier: 2,
            cost: { credits: 1000, energy: 500 },
            requirements: ["improvedEngines"],
            effects: { warpCapability: true, warpSpeedBonus: 0.5 }
        },
        stealthTechnology: {
            name: "Technologie Furtive",
            description: "Réduit la détection de vos flottes",
            tier: 2,
            cost: { credits: 800, minerals: 400, energy: 300 },
            requirements: ["advancedSensors"],
            effects: { stealthBonus: 0.4 }
        }
    }
};

const techPanel = document.getElementById('tech-panel');
const openTechTreeBtn = document.getElementById('open-tech-tree');

openTechTreeBtn.addEventListener('click', () => {
    const myPlanets = gameState.planets.filter(p => p.owner === myPlayerId);
    if (myPlanets.length >= 3) {
        techPanel.classList.toggle('visible');
        updateTechTree();
    } else {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = 'tech-access-notification';
        notification.textContent = `⚠️ Centre de Recherche bloqué ! Il vous faut contrôler au moins 3 planètes (actuellement : ${myPlanets.length})`;
        document.body.appendChild(notification);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
});

function canResearchTechnology(player, techId, category) {
    const tech = TECH_TREE[category][techId];
    if (!tech) return false;

    // Calculer les ressources totales (incluant les planètes)
    const totalResources = {...player.resources};
    gameState.planets.forEach(planet => {
        if (planet.owner === myPlayerId && planet.resources) {
            totalResources.minerals = (totalResources.minerals || 0) + (planet.resources.minerals.storage || 0);
            totalResources.energy = (totalResources.energy || 0) + (planet.resources.energy.storage || 0);
        }
    });

    // Vérifier si on a assez de ressources totales
    for (const [resource, amount] of Object.entries(tech.cost)) {
        if (totalResources[resource] < amount) {
            console.log(`Ressource insuffisante ${resource}: ${totalResources[resource]}/${amount}`);
            return false;
        }
    }

    // Vérifier les prérequis technologiques
    const hasPrerequisites = tech.requirements.every(req => player.technologies[category].includes(req));
    if (!hasPrerequisites) {
        console.log('Prérequis manquants:', tech.requirements.filter(req => !player.technologies[category].includes(req)));
    }

    return hasPrerequisites;
}

function getTechnologyEffects(player, category) {
    const effects = {
        attackBonus: 0,
        shieldBonus: 0,
        accuracyBonus: 0,
        shieldRegeneration: false,
        mineralProductionBonus: 0,
        energyProductionBonus: 0,
        energyStorageBonus: 0,
        workerEfficiency: 0,
        speedBonus: 0,
        scanRange: 0,
        warpCapability: false,
        stealthBonus: 0
    };

    // Pour chaque technologie recherchée
    player.technologies[category].forEach(techId => {
        const tech = TECH_TREE[category][techId];
        if (tech) {
            // Fusionner les effets
            Object.entries(tech.effects).forEach(([effect, value]) => {
                if (typeof value === 'boolean') {
                    effects[effect] = effects[effect] || value;
                } else {
                    effects[effect] = (effects[effect] || 0) + value;
                }
            });
        }
    });

    return effects;
}

function applyTechnologyEffects() {
    if (!myPlayerId || !gameState.players[myPlayerId]) return;
    const player = gameState.players[myPlayerId];
    
    // Récupérer tous les effets des technologies
    const militaryEffects = getTechnologyEffects(player, 'military');
    const economyEffects = getTechnologyEffects(player, 'economy');
    const explorationEffects = getTechnologyEffects(player, 'exploration');
    
    // Appliquer les effets aux planètes du joueur
    gameState.planets.forEach(planet => {
        if (planet.owner === myPlayerId) {
            // Effets économiques
            if (planet.resources) {
                planet.resources.minerals.production *= (1 + economyEffects.mineralProductionBonus);
                planet.resources.energy.production *= (1 + economyEffects.energyProductionBonus);
                planet.resources.energy.maxStorage *= (1 + economyEffects.energyStorageBonus);
            }
            
            // Effets militaires sur les boucliers
            if (planet.shieldHP > 0) {
                planet.shieldHP *= (1 + militaryEffects.shieldBonus);
                if (militaryEffects.shieldRegeneration) {
                    planet.shieldRegenRate = 1; // Points par seconde
                }
            }
        }
    });
    
    // Appliquer les effets aux flottes
    gameState.fleets.forEach(fleet => {
        if (fleet.owner === myPlayerId) {
            // Effets militaires
            fleet.attackPower *= (1 + militaryEffects.attackBonus);
            fleet.accuracy *= (1 + militaryEffects.accuracyBonus);
            
            // Effets d'exploration
            fleet.speed *= (1 + explorationEffects.speedBonus);
            fleet.stealthLevel *= (1 + explorationEffects.stealthBonus);
            
            // Capacités spéciales
            fleet.hasWarpDrive = explorationEffects.warpCapability;
        }
    });
}

function updateTechTree() {
    if (!gameState.players[myPlayerId]) {
        console.log("Impossible de mettre à jour l'arbre: joueur non trouvé");
        return;
    }
    
    const player = gameState.players[myPlayerId];
    const categories = ['military', 'economy', 'exploration'];
    
    categories.forEach(category => {
        const container = document.getElementById(`${category}-tech-tree`);
        if (!container) return;
        
        container.innerHTML = '';
        
        // Trier les technologies par niveau
        const techsByTier = {};
        Object.entries(TECH_TREE[category]).forEach(([techId, tech]) => {
            if (!techsByTier[tech.tier]) {
                techsByTier[tech.tier] = [];
            }
            techsByTier[tech.tier].push({id: techId, ...tech});
        });

        // Créer les technologies par niveau
        Object.keys(techsByTier).sort().forEach(tier => {
            const tierContainer = document.createElement('div');
            tierContainer.className = 'tech-tier';
            
            const tierHeader = document.createElement('div');
            tierHeader.className = 'tier-header';
            tierHeader.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span class="toggle-icon">▼</span>
                    <div class="tier-label">Niveau ${tier}</div>
                </div>
                <div class="tier-progress">${techsByTier[tier].filter(t => player.technologies[category].includes(t.id)).length}/${techsByTier[tier].length}</div>
            `;

            // Ajouter la fonctionnalité de toggle
            tierHeader.addEventListener('click', (e) => {
                const tierBlock = tierHeader.parentElement;
                const isCollapsed = tierBlock.classList.toggle('collapsed');
                
                // Animation du bloc
                if (isCollapsed) {
                    tierHeader.classList.add('collapsed');
                    // Jouer un son de fermeture
                    sfx.play('loss');
                } else {
                    tierHeader.classList.remove('collapsed');
                    // Jouer un son d'ouverture
                    sfx.play('capture');
                }
                
                // Effet de particules lors du clic
                const rect = tierHeader.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Créer l'effet d'ondulation
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                tierHeader.appendChild(ripple);
                
                // Supprimer l'effet après l'animation
                setTimeout(() => ripple.remove(), 1000);
            });

            tierContainer.appendChild(tierHeader);
            
            const techContainer = document.createElement('div');
            techContainer.className = 'tech-tier-items';
            
            techsByTier[tier].forEach(tech => {
                const isResearched = player.technologies[category].includes(tech.id);
                const isAvailable = !isResearched && canResearchTechnology(player, tech.id, category);
                
                const techElement = document.createElement('div');
                techElement.className = `tech-item ${isResearched ? 'researched' : isAvailable ? 'available' : 'locked'}`;
                techElement.dataset.techId = tech.id;
                
                // Icônes des ressources
                const resourceIcons = {
                    credits: '💰',
                    minerals: '⛰️',
                    energy: '⚡'
                };

                // Texte du coût
                const costText = Object.entries(tech.cost)
                    .map(([resource, amount]) => {
                        const icon = resourceIcons[resource] || '';
                        const playerHasEnough = player.resources[resource] >= amount;
                        return `<span class="resource-cost ${playerHasEnough ? 'available' : 'unavailable'}">${icon}${amount}</span>`;
                    })
                    .join(' ');

                // Affichage des effets
                const effectsText = Object.entries(tech.effects)
                    .map(([effect, value]) => {
                        if (typeof value === 'boolean') {
                            return effect === 'shieldRegeneration' ? '♻️ Régénération des boucliers' : `✨ ${effect}`;
                        }
                        
                        const percentage = value * 100;
                        switch(effect) {
                            case 'attackBonus': return `⚔️ +${percentage}% d'attaque`;
                            case 'shieldBonus': return `🛡️ +${percentage}% de bouclier`;
                            case 'accuracyBonus': return `🎯 +${percentage}% de précision`;
                            case 'mineralProductionBonus': return `⛰️ +${percentage}% minerais`;
                            case 'energyProductionBonus': return `⚡ +${percentage}% énergie`;
                            case 'energyStorageBonus': return `🔋 +${percentage}% stockage`;
                            case 'workerEfficiency': return `👥 +${percentage}% efficacité`;
                            case 'speedBonus': return `🚀 +${percentage}% vitesse`;
                            case 'scanRange': return `📡 +${percentage}% portée`;
                            case 'stealthBonus': return `🥷 +${percentage}% furtivité`;
                            default: return `${effect}: +${percentage}%`;
                        }
                    })
                    .join('<br>');

                const statusIcon = isResearched ? '✅' : (isAvailable ? '🟢' : '🔒');
                
                // Construction de l'élément technologie
                techElement.innerHTML = `
                    <div class="tech-header">
                        <span class="tech-status-icon">${statusIcon}</span>
                        <span class="tech-name">${tech.name}</span>
                        ${isResearched ? `
                            <div class="tech-activation">
                                <label class="switch">
                                    <input type="checkbox" 
                                        ${tech.isActive ? 'checked' : ''} 
                                        onchange="toggleTechnology('${category}', '${tech.id}')">
                                    <span class="slider"></span>
                                </label>
                                <div class="power-indicator ${tech.isActive ? 'active' : ''}">
                                    <div class="power-core"></div>
                                    <div class="power-rings"></div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="tech-description">${tech.description}</div>
                    <div class="tech-requirements">
                        ${tech.requirements.map(req => {
                            const reqTech = TECH_TREE[category][req];
                            const isReqMet = player.technologies[category].includes(req);
                            return `<span class="requirement ${isReqMet ? 'met' : ''}">${reqTech.name}</span>`;
                        }).join(' ')}
                    </div>
                    <div class="tech-cost">${costText}</div>
                    <div class="tech-effects">
                        <div class="tech-effects-content ${isResearched ? 'researched' : ''}">${effectsText}</div>
                        ${isResearched ? `
                            <div class="tech-power-usage">
                                <div class="power-bar">
                                    <div class="power-fill" style="width: ${tech.isActive ? '100%' : '0%'}"></div>
                                </div>
                                <span class="power-text">${tech.isActive ? 'Activé' : 'Désactivé'}</span>
                            </div>
                        ` : ''}
                    </div>
                `;

                if (isAvailable) {
                    techElement.addEventListener('click', () => {
                        socket.emit('researchTechnology', { 
                            category,
                            techName: tech.id
                        });
                        
                        // Effet visuel de clic
                        techElement.classList.add('researching');
                        setTimeout(() => techElement.classList.remove('researching'), 200);
                    });
                }

                techContainer.appendChild(techElement);
            });
            
            tierContainer.appendChild(techContainer);
            container.appendChild(tierContainer);
        });
    });
    
    // Appliquer les effets des technologies
    applyTechnologyEffects();
}

// Charger l'état des technologies depuis le localStorage
function loadTechnologyStates() {
    try {
        const savedStates = JSON.parse(localStorage.getItem('technologyStates') || '{}');
        for (const category in TECH_TREE) {
            for (const techId in TECH_TREE[category]) {
                const key = `${category}-${techId}`;
                if (key in savedStates) {
                    TECH_TREE[category][techId].isActive = savedStates[key];
                }
            }
        }
    } catch (e) {
        console.error('Erreur lors du chargement des états des technologies:', e);
    }
}

// Sauvegarder l'état des technologies dans le localStorage
function saveTechnologyStates() {
    try {
        const states = {};
        for (const category in TECH_TREE) {
            for (const techId in TECH_TREE[category]) {
                const key = `${category}-${techId}`;
                states[key] = TECH_TREE[category][techId].isActive;
            }
        }
        localStorage.setItem('technologyStates', JSON.stringify(states));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde des états des technologies:', e);
    }
}

// Fonction pour activer/désactiver une technologie
function toggleTechnology(category, techId) {
    if (!gameState.players[myPlayerId]) return;
    
    const player = gameState.players[myPlayerId];
    const tech = TECH_TREE[category][techId];
    
    if (!tech || !player.technologies[category].includes(techId)) return;
    
    // Inverser l'état d'activation
    tech.isActive = !tech.isActive;

    // Sauvegarder l'état dans le localStorage
    saveTechnologyStates();
    
    // Effet visuel lors de l'activation
    const powerIndicator = document.querySelector(`#${category}-tech-tree .tech-item[data-tech="${techId}"] .power-indicator`);
    if (powerIndicator) {
        if (tech.isActive) {
            powerIndicator.classList.add('active');
            
            // Animation d'activation
            const rings = document.createElement('div');
            rings.className = 'activation-rings';
            powerIndicator.appendChild(rings);
            setTimeout(() => rings.remove(), 2000);
        } else {
            powerIndicator.classList.remove('active');
        }
    }
    
    // Son d'activation/désactivation
    sfx.play(tech.isActive ? 'capture' : 'loss');
    
    // Mettre à jour les effets
    applyTechnologyEffects();
    
    // Notification
    const notification = document.createElement('div');
    notification.className = 'tech-notification';
    notification.innerHTML = `${tech.isActive ? '🔋' : '💤'} ${tech.name} ${tech.isActive ? 'activée' : 'désactivée'}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

socket.on('researchComplete', (data) => {
    console.log("Recherche terminée avec succès:", data);
    
    // Vérifier que la catégorie et la technologie existent
    const category = data.category;
    const techName = data.techName;
    
    console.log('Recherche de technologie:', {category, techName});
    console.log('Arbre disponible:', Object.keys(TECH_TREE));
    
    if (!TECH_TREE[category]) {
        console.error(`Catégorie invalide: ${category}`);
        return;
    }
    
    if (!TECH_TREE[category][techName]) {
        console.error(`Technologie invalide: ${techName} dans la catégorie ${category}`);
        console.log('Technologies disponibles:', Object.keys(TECH_TREE[category]));
        return;
    }
    
    const tech = TECH_TREE[category][techName];
    
    // Marquer la technologie comme recherchée mais désactivée par défaut
    tech.isActive = false;
    updateTechTree();
    
    // Créer une notification de succès avec option d'activation
    const notification = document.createElement('div');
    notification.className = 'research-notification success';
    notification.innerHTML = `
        <div class="tech-success">✅ ${tech.name} recherchée avec succès!</div>
        <button class="activate-tech-btn" onclick="toggleTechnology('${data.category}', '${data.techName}')">
            🔋 Activer maintenant
        </button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    sfx.play('capture');
});

socket.on('researchFailed', (data) => {
    console.log("Échec de la recherche:", data.message);
    
    // Créer une notification d'erreur
    const notification = document.createElement('div');
    notification.className = 'research-notification error';
    notification.innerHTML = `❌ ${data.message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
});

// --- Initialisation et Écouteurs d'Événements ---

// Création des éléments UI
const gameControls = document.createElement('div');
gameControls.className = 'game-controls';
document.body.appendChild(gameControls);

// Créer l'infobulle de planète
const planetTooltip = document.createElement('div');
planetTooltip.id = 'planet-tooltip';
document.body.appendChild(planetTooltip);

// Créer le leaderboard
const leaderboard = document.createElement('div');
leaderboard.id = 'leaderboard';
leaderboard.innerHTML = `
    <div class="leaderboard-header">
        🏆 Classement
    </div>
    <div class="leaderboard-content"></div>
`;
document.body.appendChild(leaderboard);

// Créer le bouton de localisation
const locateButton = document.createElement('button');
locateButton.id = 'locate-home';
locateButton.className = 'control-button';
locateButton.innerHTML = '🎯 Ma planète';
gameControls.appendChild(locateButton);

// Fonction de mise à jour du leaderboard
function updateLeaderboard() {
    const content = leaderboard.querySelector('.leaderboard-content');
    const playerStats = Object.entries(gameState.players)
        .map(([id, player]) => {
            const planetsCount = gameState.planets.filter(p => p.owner === id).length;
            const shipsCount = gameState.planets.reduce((total, planet) => {
                if (planet.owner === id) {
                    return total + Object.values(planet.ships).reduce((a, b) => a + b, 0);
                }
                return total;
            }, 0);
            return { id, player, planetsCount, shipsCount };
        })
        .sort((a, b) => b.planetsCount - a.planetsCount);

    content.innerHTML = playerStats.map(({ player, planetsCount, shipsCount }) => `
        <div class="leaderboard-player">
            <div class="player-color" style="background-color: ${player.color}"></div>
            <div class="player-name">Joueur ${player.teamId}</div>
            <div class="player-stats">
                <div class="player-stat">
                    <span class="player-stat-icon">🌍</span>
                    ${planetsCount}
                </div>
                <div class="player-stat">
                    <span class="player-stat-icon">🚀</span>
                    ${shipsCount}
                </div>
            </div>
        </div>
    `).join('');
}

// Fonction de mise à jour de l'infobulle de planète
function updatePlanetTooltip(planet) {
    if (!planet) {
        planetTooltip.classList.remove('visible');
        return;
    }

    const owner = planet.owner ? gameState.players[planet.owner] : null;
    const totalShips = Object.values(planet.ships).reduce((a, b) => a + b, 0);

    planetTooltip.innerHTML = `
        <div class="tooltip-header">
            <div class="tooltip-planet-type">${planet.type.charAt(0).toUpperCase() + planet.type.slice(1)}</div>
            ${owner ? `<div class="tooltip-owner" style="color: ${owner.color}">Joueur ${owner.teamId}</div>` : ''}
        </div>
        <div class="tooltip-stats">
            <div class="tooltip-stat">
                <span class="tooltip-stat-icon">⚔️</span>
                <span class="tooltip-stat-value">${totalShips} vaisseaux</span>
            </div>
            <div class="tooltip-stat">
                <span class="tooltip-stat-icon">🛡️</span>
                <span class="tooltip-stat-value">${planet.shieldHP} bouclier</span>
            </div>
            <div class="tooltip-stat">
                <span class="tooltip-stat-icon">⛰️</span>
                <span class="tooltip-stat-value">${Math.floor(planet.resources.minerals.storage)} minerais</span>
            </div>
            <div class="tooltip-stat">
                <span class="tooltip-stat-icon">⚡</span>
                <span class="tooltip-stat-value">${Math.floor(planet.resources.energy.storage)} énergie</span>
            </div>
        </div>
    `;
    planetTooltip.classList.add('visible');
}

// Fonction pour créer l'indicateur de planète
function createPlanetIndicator(planet) {
    const existingIndicator = document.querySelector('.planet-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    const indicator = document.createElement('div');
    indicator.className = 'planet-indicator';
    indicator.style.left = `${planet.x}px`;
    indicator.style.top = `${planet.y - planet.radius - 60}px`;
    
    const arrow = document.createElement('div');
    arrow.className = 'planet-arrow';
    
    const highlight = document.createElement('div');
    highlight.className = 'planet-highlight';
    highlight.style.left = `${-planet.radius - 10}px`;
    highlight.style.top = `${-planet.radius - 10}px`;
    highlight.style.width = `${planet.radius * 2 + 20}px`;
    highlight.style.height = `${planet.radius * 2 + 20}px`;
    
    indicator.appendChild(arrow);
    indicator.appendChild(highlight);
    document.body.appendChild(indicator);
    
    // Supprimer l'indicateur après 5 secondes
    setTimeout(() => {
        indicator.remove();
    }, 5000);
}

// Fonction pour trouver et centrer la vue sur la planète du joueur
function focusOnPlayerPlanet() {
    if (!myPlayerId) return;
    
    // Trouver la première planète du joueur
    const playerPlanet = gameState.planets.find(p => p.owner === myPlayerId);
    if (!playerPlanet) {
        console.log("Vous ne possédez aucune planète");
        return;
    }
    
    // Créer l'indicateur de planète
    createPlanetIndicator(playerPlanet);
    
    // Calculer la position centrée
    const viewWidth = canvas.width / currentZoom;
    const viewHeight = canvas.height / currentZoom;
    
    // Animer le déplacement de la caméra
    const targetX = playerPlanet.x - viewWidth / 2;
    const targetY = playerPlanet.y - viewHeight / 2;
    
    // Animation douce vers la planète
    animateCameraTo(targetX, targetY);
}

// Fonction d'animation douce de la caméra
function animateCameraTo(targetX, targetY) {
    const startX = camera.x;
    const startY = camera.y;
    const duration = 1000; // 1 seconde
    const startTime = Date.now();
    
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing pour un mouvement plus naturel
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        camera.x = startX + (targetX - startX) * easeProgress;
        camera.y = startY + (targetY - startY) * easeProgress;
        
        constrainCamera();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Ajouter les événements
locateButton.addEventListener('click', focusOnPlayerPlanet);
document.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') {
        focusOnPlayerPlanet();
    }
});

// Fonction pour mettre à jour l'état du bouton
function updateLocateButton() {
    if (!myPlayerId || !gameState.planets) return;
    
    const myPlanets = gameState.planets.filter(p => p.owner === myPlayerId);
    
    if (myPlanets.length > 0) {
        locateButton.classList.add('available');
        locateButton.classList.remove('locked');
        locateButton.innerHTML = '🎯 Ma planète';
    } else {
        locateButton.classList.add('locked');
        locateButton.classList.remove('available');
        locateButton.innerHTML = '🔒 Aucune planète';
    }
}

// Initialisation des éléments audio et du jeu
sfx.init();
sfx.load('ambient', 'audio/ambient.mp3', true, 0.3);
sfx.load('send_fleet', 'audio/send_fleet.mp3', false, 0.5);
sfx.load('explosion', 'audio/explosion.mp3', false, 0.6);
sfx.load('capture', 'audio/capture.mp3', false, 0.7);
sfx.load('loss', 'audio/loss.mp3', false, 0.7);
initStars();
resizeCanvas();

// Gestionnaire de zoom
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Position du curseur dans l'espace du jeu avant le zoom
    const worldX = mouseX / currentZoom + camera.x;
    const worldY = mouseY / currentZoom + camera.y;
    
    // Ajuster le zoom
    const zoomFactor = -Math.sign(event.deltaY) * ZOOM_SPEED;
    let newZoom = currentZoom * (1 + zoomFactor);
    
    // Limiter le zoom
    newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    
    if (newZoom !== currentZoom) {
        currentZoom = newZoom;
        
        // Zoomer vers la position de la souris
        camera.x = worldX - (mouseX / currentZoom);
        camera.y = worldY - (mouseY / currentZoom);
        
        // Contraindre la caméra aux limites
        constrainCamera();
    }
}, { passive: false });

window.addEventListener('resize', resizeCanvas);
document.body.addEventListener('click', () => { sfx.unlock(); }, { once: true });
canvas.addEventListener('mousemove', (event) => {
    const logicalPos = getLogicalMousePos(event);
    mousePos.x = logicalPos.x;
    mousePos.y = logicalPos.y;
    
    if (isDragging) {
        hasDragged = true;
        
        // Calculer le déplacement en pixels et l'appliquer en tenant compte du zoom
        const deltaX = (event.clientX - dragStart.x) / currentZoom;
        const deltaY = (event.clientY - dragStart.y) / currentZoom;
        
        // Mettre à jour la position de la caméra
        camera.x -= deltaX;
        camera.y -= deltaY;

        // Mettre à jour la position du point de départ pour le prochain déplacement
        dragStart.x = event.clientX;
        dragStart.y = event.clientY;
        
        // Contraindre la caméra aux limites de la carte
        constrainCamera();
    }
});
canvas.addEventListener('mousedown', (event) => { if (event.button === 0) { isDragging = true; hasDragged = false; dragStart.x = event.clientX; dragStart.y = event.clientY; canvas.style.cursor = 'grabbing'; } });
canvas.addEventListener('mouseup', (event) => {
    if (event.button !== 0) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
    if (hasDragged) { hasDragged = false; return; }
    const logicalMousePos = getLogicalMousePos(event);
    const clickedPlanet = getClickedPlanet(logicalMousePos);
    if (!clickedPlanet) { selectedPlanetId = null; return; }
    const planetData = gameState.planets.find(p => p.id === clickedPlanet.id);
    if (planetData.owner === myPlayerId) { selectedPlanetId = clickedPlanet.id; } 
    else if (selectedPlanetId !== null) { const originPlanet = gameState.planets.find(p => p.id === selectedPlanetId); if (originPlanet) { const shipsToSend = calculateFleetToSend(originPlanet.ships); socket.emit('sendFleet', { originId: selectedPlanetId, destinationId: clickedPlanet.id, ships: shipsToSend }); sfx.play('send_fleet'); selectedPlanetId = null; } }
});
canvas.addEventListener('mouseleave', () => { isDragging = false; canvas.style.cursor = 'grab'; });
document.querySelectorAll('.build-btn').forEach(button => button.addEventListener('click', () => { if (selectedPlanetId !== null) socket.emit('buildShip', { planetId: selectedPlanetId, shipType: button.dataset.type }); }));
document.querySelectorAll('.upgrade-btn').forEach(button => button.addEventListener('click', () => { 
    if (selectedPlanetId !== null) socket.emit('upgradePlanet', { planetId: selectedPlanetId, upgradeType: button.dataset.type }); 
}));

const tradeDestinationSelect = document.getElementById('trade-destination');
const tradeResourceSelect = document.getElementById('trade-resource');
const tradeAmountInput = document.getElementById('trade-amount');
const establishTradeButton = document.getElementById('establish-trade-route');
const tradeRoutesContainer = document.getElementById('trade-routes');

// Mettre à jour la liste des planètes de destination disponibles
function updateTradeDestinations() {
    if (!selectedPlanetId || !myPlayerId) return;
    
    const options = ['<option value="">-- Sélectionner une planète --</option>'];
    gameState.planets.forEach(planet => {
        if (planet.id !== selectedPlanetId && planet.owner === myPlayerId) {
            options.push(`<option value="${planet.id}">Planète ${planet.type} #${planet.id}</option>`);
        }
    });
    
    tradeDestinationSelect.innerHTML = options.join('');
    establishTradeButton.disabled = !tradeDestinationSelect.value;
}

tradeDestinationSelect.addEventListener('change', () => {
    establishTradeButton.disabled = !tradeDestinationSelect.value;
});

establishTradeButton.addEventListener('click', () => {
    const destinationId = parseInt(tradeDestinationSelect.value);
    if (selectedPlanetId !== null && destinationId) {
        socket.emit('establishTradeRoute', {
            originId: selectedPlanetId,
            destinationId: destinationId,
            resource: tradeResourceSelect.value,
            amount: parseInt(tradeAmountInput.value)
        });
    }
});

function updateTradeRoutes(planet) {
    if (!planet || !tradeRoutesContainer) return;
    
    tradeRoutesContainer.innerHTML = planet.tradeRoutes.map(route => {
        const destinationPlanet = gameState.planets.find(p => p.id === route.destinationId);
        if (!destinationPlanet) return '';
        return `
            <div class="trade-route">
                <span>${route.resource}: ${route.amount}/s → Planète ${destinationPlanet.type} #${route.destinationId}</span>
                <button onclick="cancelTradeRoute(${planet.id}, ${route.destinationId}, '${route.resource}')">❌</button>
            </div>
        `;
    }).join('') || '<div class="no-routes">Aucune route commerciale</div>';
    
    // Mettre à jour les destinations disponibles
    updateTradeDestinations();
}

function cancelTradeRoute(planetId, destinationId, resource) {
    socket.emit('cancelTradeRoute', {
        planetId,
        destinationId,
        resource
    });
};
socket.on('connect', () => { 
    myPlayerId = socket.id;
    // Réinitialiser l'état de l'arbre technologique
    document.querySelectorAll('.tech-tree').forEach(tree => {
        tree.innerHTML = '';
    });
    
    // Centrer la caméra sur la carte à la connexion
    const viewWidth = canvas.width / currentZoom;
    const viewHeight = canvas.height / currentZoom;
    camera.x = (LOGICAL_WIDTH - viewWidth) / 2;
    camera.y = (LOGICAL_HEIGHT - viewHeight) / 2;
});
socket.on('gameState', (state) => { 
    if (state.planets && Object.keys(previousPlanetsState).length > 0 && myPlayerId) { 
        state.planets.forEach(newPlanet => { 
            const oldOwner = previousPlanetsState[newPlanet.id]; 
            const newOwner = newPlanet.owner; 
            if (oldOwner !== newOwner) { 
                if (newOwner === myPlayerId) { 
                    sfx.play('capture'); 
                    const pData = gameState.players[myPlayerId]; 
                    if (pData) animations.push(new CaptureRing(newPlanet.x, newPlanet.y, newPlanet.radius, pData.color)); 
                } else if (oldOwner === myPlayerId) { 
                    sfx.play('loss'); 
                } 
            } 
        }); 
    } 
    if (state.planets) { 
        state.planets.forEach(p => { 
            previousPlanetsState[p.id] = p.owner;
        }); 
    } 
    gameState = state;
    updateTechTreeButton(); // Mise à jour du bouton des technologies
    updateLocateButton();   // Mise à jour du bouton "Ma planète"
});
socket.on('combatResult', (data) => { 
    sfx.play('explosion'); 
    const planet = gameState.planets.find(p => p.x === data.x && p.y === data.y); 
    const owner = gameState.players[planet?.owner]; 
    const color = owner ? owner.color : NEUTRAL_COLOR; 
    animations.push(new Explosion(data.x, data.y, color)); 
});

socket.on('combatDetails', (data) => {
    // Création d'un élément de notification flottant
    const notification = document.createElement('div');
    notification.className = 'combat-notification';
    
    const attackerPlayer = gameState.players[data.attacker.owner];
    const defenderPlayer = gameState.players[data.defender.owner];
    
    const attackerColor = attackerPlayer ? attackerPlayer.color : NEUTRAL_COLOR;
    const defenderColor = defenderPlayer ? defenderPlayer.color : NEUTRAL_COLOR;
    
    notification.innerHTML = `
        <div style="color: ${attackerColor}">Attaquant: ${Math.floor(data.attacker.finalHP)}/${Math.floor(data.attacker.initialPower.hp)} HP</div>
        <div style="color: ${defenderColor}">Défenseur: ${Math.floor(data.defender.finalHP)}/${Math.floor(data.defender.initialPower.hp)} HP</div>
        ${data.shieldDamage > 0 ? `<div style="color: #00DDFF">Bouclier: -${Math.floor(data.shieldDamage)} dmg</div>` : ''}
    `;
    
    notification.style.left = `${data.location.x}px`;
    notification.style.top = `${data.location.y - 50}px`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 1000);
    }, 2000);
});
// Configuration des contrôles de formation et de point de ralliement
const formationSelect = document.getElementById('formation-select');
const setRallyPointBtn = document.getElementById('set-rally-point');
const pathControls = document.getElementById('path-controls');
const confirmPathBtn = document.getElementById('confirm-path');
const cancelPathBtn = document.getElementById('cancel-path');
const rallyPointInfo = document.querySelector('.rally-point-info');

setRallyPointBtn.addEventListener('click', () => {
    isSettingRallyPoint = !isSettingRallyPoint;
    setRallyPointBtn.textContent = isSettingRallyPoint ? 'Annuler Point de Ralliement' : 'Définir Point de Ralliement';
    if (isSettingRallyPoint) {
        canvas.style.cursor = 'crosshair';
    } else {
        canvas.style.cursor = 'grab';
    }
});

function startPathDrawing() {
    isDrawingPath = true;
    currentPath = [];
    pathControls.classList.remove('hidden');
}

confirmPathBtn.addEventListener('click', () => {
    if (selectedPlanetId === null || currentPath.length === 0) return;
    
    const formation = formationSelect.value;
    socket.emit('sendFleet', {
        originId: selectedPlanetId,
        destination: null, // Pas de destination finale pour les chemins personnalisés
        formation: formation,
        path: currentPath,
        ships: gameState.planets.find(p => p.id === selectedPlanetId).ships
    });
    
    finishPathDrawing();
});

cancelPathBtn.addEventListener('click', finishPathDrawing);

function finishPathDrawing() {
    isDrawingPath = false;
    currentPath = [];
    pathControls.classList.add('hidden');
    canvas.style.cursor = 'grab';
}

canvas.addEventListener('mousemove', (event) => {
    const logicalPos = getLogicalMousePos(event);
    mousePos.x = logicalPos.x;
    mousePos.y = logicalPos.y;
    
    if (isDrawingPath && !isDragging) {
        if (currentPath.length === 0 || 
            Math.hypot(currentPath[currentPath.length-1].x - mousePos.x, 
                      currentPath[currentPath.length-1].y - mousePos.y) > 50) {
            currentPath.push({x: mousePos.x, y: mousePos.y});
        }
    }
});

// Redéfinition de l'événement mouseup pour inclure les points de ralliement
canvas.addEventListener('mouseup', (event) => {
    if (event.button !== 0) return;
    isDragging = false;
    canvas.style.cursor = isSettingRallyPoint ? 'crosshair' : 'grab';
    
    if (hasDragged) {
        hasDragged = false;
        return;
    }
    
    const logicalMousePos = getLogicalMousePos(event);
    const clickedPlanet = getClickedPlanet(logicalMousePos);
    
    // Debug pour voir si on détecte bien le clic et la planète
    console.log("Clic détecté à:", logicalMousePos);
    console.log("Planète cliquée:", clickedPlanet);
    
    if (isSettingRallyPoint && selectedPlanetId !== null) {
        if (clickedPlanet) {
            socket.emit('setRallyPoint', {
                planetId: selectedPlanetId,
                targetPlanetId: clickedPlanet.id,
                x: clickedPlanet.x,
                y: clickedPlanet.y
            });
            isSettingRallyPoint = false;
            setRallyPointBtn.textContent = 'Définir Point de Ralliement';
            canvas.style.cursor = 'grab';
        }
        return;
    }
    
    if (!clickedPlanet) {
        console.log("Aucune planète cliquée");
        selectedPlanetId = null;
        return;
    }
    
    const planetData = gameState.planets.find(p => p.id === clickedPlanet.id);
    console.log("Données de la planète:", planetData);
    console.log("Mon ID:", myPlayerId);
    console.log("Propriétaire de la planète:", planetData.owner);
    
    if (planetData && planetData.owner === myPlayerId) {
        console.log("Sélection de la planète:", clickedPlanet.id);
        selectedPlanetId = clickedPlanet.id;
        if (event.ctrlKey || event.metaKey) {
            startPathDrawing();
        }
    } else if (selectedPlanetId !== null) {
        const originPlanet = gameState.planets.find(p => p.id === selectedPlanetId);
        if (originPlanet) {
            const shipsToSend = calculateFleetToSend(originPlanet.ships);
            socket.emit('sendFleet', {
                originId: selectedPlanetId,
                destinationId: clickedPlanet.id,
                ships: shipsToSend,
                formation: formationSelect.value
            });
            sfx.play('send_fleet');
            selectedPlanetId = null;
        }
    }
});

socket.on('forceReload', (data) => { 
    const winnerMessage = document.getElementById('winner-message'); 
    if (data.winner) { 
        winnerMessage.textContent = `Victoire de ${data.winner.name}`; 
        winnerMessage.style.color = data.winner.color; 
        const myPlayer = gameState.players[myPlayerId]; 
        if (myPlayer && data.winner.name.includes(myPlayer.teamId)) { 
            winnerMessage.textContent = "🏆 Victoire ! 🏆"; 
        } 
    } else { 
        winnerMessage.textContent = "Fin de la partie"; 
    } 
    gameOverScreen.classList.remove('hidden'); 
    setTimeout(() => { window.location.reload(); }, 5000); 
});

// Fonction pour mettre à jour le bouton de l'arbre technologique
function updateTechTreeButton() {
    if (!myPlayerId || !gameState.planets) return;
    
    const myPlanets = gameState.planets.filter(p => p.owner === myPlayerId);
    const techTreeBtn = document.getElementById('open-tech-tree');
    
    if (myPlanets.length >= 3) {
        techTreeBtn.innerHTML = '🔬 Arbre Technologique';
        techTreeBtn.classList.add('available');
        techTreeBtn.classList.remove('locked');
    } else {
        techTreeBtn.innerHTML = `🔒 Centre de Recherche (${myPlanets.length}/3 planètes)`;
        techTreeBtn.classList.add('locked');
        techTreeBtn.classList.remove('available');
    }
}

// --- Démarrage du Jeu ---
loadTextures().then(() => {
    lastTime = performance.now();
    
    // Centrer la caméra sur la carte au démarrage
    const viewWidth = canvas.width / currentZoom;
    const viewHeight = canvas.height / currentZoom;
    camera.x = (LOGICAL_WIDTH - viewWidth) / 2;
    camera.y = (LOGICAL_HEIGHT - viewHeight) / 2;
    
    requestAnimationFrame(gameLoop);
}).catch(err => {
    console.error("Impossible de charger les textures.", err);
    document.body.innerHTML = `<div style="color: red; text-align: center; margin-top: 50px; font-size: 24px;">Erreur: Impossible de charger les textures du jeu. Vérifiez la console (F12). Assurez-vous que le dossier /public/textures contient bien toutes les images.</div>`;
});

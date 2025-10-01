// public/client.js
const socket = io();

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.style.cursor = 'grab';

const LOGICAL_WIDTH = 1600;
const LOGICAL_HEIGHT = 900;
const NEUTRAL_COLOR = '#999999';

// --- Références UI ---
const creditsDisplaySpan = document.querySelector('#credits-display span');
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

// --- Variables Globales ---
let gameState = { planets: [], fleets: [], players: {}, leaderboard: [] };
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

// --- Gestionnaire de Textures ---
const textures = {};
function loadTextures() { const textureNames = ['moon', 'sun', 'saturn', 'earth', 'mars', 'mercury', 'jupiter', 'neptune', 'uranus', 'saturn_ring']; const promises = textureNames.map(name => new Promise((resolve, reject) => { const img = new Image(); img.src = `textures/${name}.jpg`; img.onload = () => { textures[name] = img; console.log(`Texture ${name} chargée.`); resolve(); }; img.onerror = () => reject(new Error(`Le fichier textures/${name}.jpg est manquant ou inaccessible.`)); })); return Promise.all(promises); }

// --- Classes pour les Animations ---
class Particle { constructor(x, y, color) { this.x = x; this.y = y; this.color = color; this.size = Math.random() * 3 + 1; this.life = 1; const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 3 + 1; this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed; } update(dt) { this.x += this.vx; this.y += this.vy; this.life -= dt; this.vx *= 0.98; this.vy *= 0.98; } draw() { ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${Math.max(0, this.life)})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } }
class Explosion { constructor(x, y, color) { this.particles = []; for (let i = 0; i < 30; i++) { this.particles.push(new Particle(x, y, color)); } this.isDone = false; } update(dt) { this.particles.forEach(p => p.update(dt)); this.particles = this.particles.filter(p => p.life > 0); if (this.particles.length === 0) { this.isDone = true; } } draw() { this.particles.forEach(p => p.draw()); } }
class CaptureRing { constructor(x, y, radius, color) { this.x = x; this.y = y; this.radius = radius; this.color = color; this.life = 1; this.isDone = false; } update(dt) { this.radius += dt * 80; this.life -= dt; if (this.life <= 0) { this.isDone = true; } } draw() { ctx.strokeStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${Math.max(0, this.life)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.stroke(); } }

// --- Fonctions Utilitaires ---
const sfx = { audioContext: null, sounds: {}, init() { this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); }, unlock() { if (this.audioContext && this.audioContext.state === 'suspended') { this.audioContext.resume(); } }, load(name, path, loop = false, volume = 1.0) { if (!this.audioContext) this.init(); fetch(path).then(response => { if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return response.arrayBuffer(); }).then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer)).then(audioBuffer => { this.sounds[name] = { buffer: audioBuffer, loop, volume }; if (name === 'ambient') { this.play('ambient'); } }).catch(e => console.error(`Erreur lors du chargement du son ${name}:`, e)); }, play(name) { if (!this.sounds[name] || !this.audioContext) return; this.unlock(); const source = this.audioContext.createBufferSource(); source.buffer = this.sounds[name].buffer; const gainNode = this.audioContext.createGain(); gainNode.gain.setValueAtTime(this.sounds[name].volume, this.audioContext.currentTime); source.connect(gainNode).connect(this.audioContext.destination); source.loop = this.sounds[name].loop; source.start(0); } };
function updateAndDrawAnimations(dt) { animations.forEach(anim => anim.update(dt)); animations = animations.filter(anim => !anim.isDone); animations.forEach(anim => anim.draw()); }
function initStars() { for (let i = 0; i < 200; i++) { stars.push({ x: Math.random() * LOGICAL_WIDTH, y: Math.random() * LOGICAL_HEIGHT, radius: Math.random() * 1.5, alpha: Math.random(), speed: Math.random() * 0.2 + 0.1 }); } }
function drawStars() { stars.forEach(star => { star.y -= star.speed; if (star.y < 0) { star.y = LOGICAL_HEIGHT; } ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`; ctx.fill(); }); }
function resizeCanvas() { const aspectRatio = LOGICAL_WIDTH / LOGICAL_HEIGHT; const windowRatio = window.innerWidth / window.innerHeight; if (windowRatio > aspectRatio) { canvas.height = window.innerHeight; canvas.width = canvas.height * aspectRatio; } else { canvas.width = window.innerWidth; canvas.height = canvas.width / aspectRatio; } }
function getLogicalMousePos(event) { const rect = canvas.getBoundingClientRect(); const scaleX = LOGICAL_WIDTH / rect.width; const scaleY = LOGICAL_HEIGHT / rect.height; return { x: (event.clientX - rect.left) * scaleX + camera.x, y: (event.clientY - rect.top) * scaleY + camera.y }; }
function getClickedPlanet(logicalMousePos) { for (const planet of gameState.planets) { const distance = Math.sqrt(Math.pow(planet.x - logicalMousePos.x, 2) + Math.pow(planet.y - logicalMousePos.y, 2)); if (distance < planet.radius) return planet; } return null; }

// --- Fonctions de Dessin ---
function drawPlanet(planet) { const texture = textures[planet.type]; const clientData = clientPlanets[planet.id]; ctx.save(); ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2); ctx.clip(); if (texture && clientData) { ctx.translate(planet.x, planet.y); ctx.rotate(clientData.rotation); ctx.drawImage(texture, -planet.radius, -planet.radius, planet.radius * 2, planet.radius * 2); ctx.rotate(-clientData.rotation); ctx.translate(-planet.x, -planet.y); } else { ctx.fillStyle = NEUTRAL_COLOR; ctx.fill(); } ctx.restore(); const player = gameState.players[planet.owner]; if (player) { const color = player.color; const atmosphereGradient = ctx.createRadialGradient(planet.x, planet.y, planet.radius, planet.x, planet.y, planet.radius + 7); atmosphereGradient.addColorStop(0, 'transparent'); atmosphereGradient.addColorStop(0.8, `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.4)`); atmosphereGradient.addColorStop(1, 'transparent'); ctx.fillStyle = atmosphereGradient; ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius + 7, 0, Math.PI * 2); ctx.fill(); } if (planet.shieldHP > 0) { const pulse = Math.sin(Date.now() * 0.003) * 3; const opacity = 0.5 + Math.sin(Date.now() * 0.003) * 0.2; ctx.strokeStyle = `rgba(0, 220, 255, ${opacity})`; ctx.lineWidth = 2 + pulse/2; ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius + 10 + pulse, 0, Math.PI * 2); ctx.stroke(); } if (planet.id === selectedPlanetId) { const pulse = Math.sin(Date.now() * 0.006) * 2; const opacity = 0.7 + Math.sin(Date.now() * 0.006) * 0.3; ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`; ctx.lineWidth = 3 + pulse; ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius + 5 + pulse/2, 0, Math.PI * 2); ctx.stroke(); } const totalShips = Object.values(planet.ships).reduce((a, b) => a + b, 0); ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 18px "Roboto Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = '#000'; ctx.shadowBlur = 8; ctx.fillText(totalShips, planet.x, planet.y); ctx.shadowBlur = 0; }
function drawSaturnRing(planet, clientData) { const ringSize = planet.radius * 2.8; ctx.save(); ctx.translate(planet.x, planet.y); ctx.rotate(clientData.rotation); ctx.drawImage(textures.saturn_ring, -ringSize / 2, -ringSize / 2, ringSize, ringSize); ctx.restore(); }
function drawSunGlow(planet) { const pulse = Math.sin(Date.now() * 0.002) * 10; const glowGradient = ctx.createRadialGradient(planet.x, planet.y, planet.radius, planet.x, planet.y, planet.radius + 20 + pulse); glowGradient.addColorStop(0, 'rgba(255, 220, 100, 0.6)'); glowGradient.addColorStop(0.8, 'rgba(255, 200, 0, 0.2)'); glowGradient.addColorStop(1, 'transparent'); ctx.fillStyle = glowGradient; ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius + 20 + pulse, 0, Math.PI * 2); ctx.fill(); }

// --- Boucle de Jeu Principale ---
function gameLoop(currentTime) {
    const dt = (currentTime - lastTime) / 1000; lastTime = currentTime;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(canvas.width / LOGICAL_WIDTH, canvas.height / LOGICAL_HEIGHT);
    ctx.translate(-camera.x, -camera.y);

    const viewportLeft = camera.x;
    const viewportTop = camera.y;
    const viewportWidth = canvas.width * (LOGICAL_WIDTH / canvas.width);
    const viewportHeight = canvas.height * (LOGICAL_HEIGHT / canvas.height);

    ctx.fillStyle = 'rgba(12, 12, 30, 0.4)'; ctx.fillRect(viewportLeft, viewportTop, viewportWidth, viewportHeight);
    drawStars();

    const myPlayer = gameState.players[myPlayerId];
    if (myPlayer) creditsDisplaySpan.textContent = Math.floor(myPlayer.credits);

    gameState.planets.forEach(planet => { if (clientPlanets[planet.id]) clientPlanets[planet.id].rotation += dt * 0.1; drawPlanet(planet); });
    gameState.fleets.forEach(fleet => { const player = gameState.players[fleet.owner]; ctx.fillStyle = player ? player.color : NEUTRAL_COLOR; ctx.beginPath(); ctx.arc(fleet.x, fleet.y, 5, 0, Math.PI * 2); ctx.fill(); if (fleet.isBoosted) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0; } });
    gameState.planets.forEach(planet => { const clientData = clientPlanets[planet.id]; if (planet.type === 'saturn' && textures.saturn_ring && clientData) drawSaturnRing(planet, clientData); if (planet.type === 'sun') drawSunGlow(planet); });
    updateAndDrawAnimations(dt);
    
    if (selectedPlanetId !== null) { const originPlanet = gameState.planets.find(p => p.id === selectedPlanetId); if (originPlanet) { ctx.beginPath(); ctx.moveTo(originPlanet.x, originPlanet.y); ctx.lineTo(mousePos.x, mousePos.y); ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; ctx.lineWidth = 2; ctx.setLineDash([5, 10]); ctx.stroke(); ctx.setLineDash([]); } }

    const selectedPlanet = gameState.planets.find(p => p.id === selectedPlanetId);
    if (selectedPlanet && selectedPlanet.owner === myPlayerId && myPlayer) {
        selectionPanel.classList.remove('hidden');
        planetName.textContent = `Planète ${selectedPlanet.type} #${selectedPlanet.id}`;
        planetStats.innerHTML = `<span>Fonderie Lvl: ${selectedPlanet.forgeLevel}</span> | <span>Bouclier: ${selectedPlanet.shieldHP} HP</span>`;
        garrisonList.innerHTML = `<span>Ch: ${selectedPlanet.ships.fighter}</span><span>Cr: ${selectedPlanet.ships.cruiser}</span><span>Cu: ${selectedPlanet.ships.battleship}</span>`;
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

// --- Initialisation et Écouteurs d'Événements ---
sfx.init(); sfx.load('ambient', 'audio/ambient.mp3', true, 0.3); sfx.load('send_fleet', 'audio/send_fleet.wav', false, 0.5); sfx.load('explosion', 'audio/explosion.wav', false, 0.6); sfx.load('capture', 'audio/capture.wav', false, 0.7); sfx.load('loss', 'audio/loss.wav', false, 0.7);
initStars(); resizeCanvas();
window.addEventListener('resize', resizeCanvas);
document.body.addEventListener('click', () => { sfx.unlock(); }, { once: true });
canvas.addEventListener('mousemove', (event) => {
    const logicalPos = getLogicalMousePos(event);
    mousePos.x = logicalPos.x; mousePos.y = logicalPos.y;
    if (isDragging) {
        hasDragged = true;
        const rect = canvas.getBoundingClientRect();
        const scaleX = LOGICAL_WIDTH / rect.width; const scaleY = LOGICAL_HEIGHT / rect.height;
        const deltaX = (event.clientX - dragStart.x) * scaleX; const deltaY = (event.clientY - dragStart.y) * scaleY;
        camera.x -= deltaX; camera.y -= deltaY;
        const viewportWidth = rect.width * scaleX; const viewportHeight = rect.height * scaleY;
        camera.x = Math.max(0, Math.min(camera.x, LOGICAL_WIDTH - viewportWidth));
        camera.y = Math.max(0, Math.min(camera.y, LOGICAL_HEIGHT - viewportHeight));
        dragStart.x = event.clientX; dragStart.y = event.clientY;
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
    else if (selectedPlanetId !== null) { const originPlanet = gameState.planets.find(p => p.id === selectedPlanetId); if (originPlanet) { socket.emit('sendFleet', { originId: selectedPlanetId, destinationId: clickedPlanet.id, ships: originPlanet.ships }); sfx.play('send_fleet'); selectedPlanetId = null; } }
});
canvas.addEventListener('mouseleave', () => { isDragging = false; canvas.style.cursor = 'grab'; });
document.querySelectorAll('.build-btn').forEach(button => button.addEventListener('click', () => { if (selectedPlanetId !== null) socket.emit('buildShip', { planetId: selectedPlanetId, shipType: button.dataset.type }); }));
document.querySelectorAll('.upgrade-btn').forEach(button => button.addEventListener('click', () => { if (selectedPlanetId !== null) socket.emit('upgradePlanet', { planetId: selectedPlanetId, upgradeType: button.dataset.type }); }));
socket.on('connect', () => { myPlayerId = socket.id; });
socket.on('gameState', (state) => { if (state.planets && Object.keys(previousPlanetsState).length > 0 && myPlayerId) { state.planets.forEach(newPlanet => { const oldOwner = previousPlanetsState[newPlanet.id]; const newOwner = newPlanet.owner; if (oldOwner !== newOwner) { if (newOwner === myPlayerId) { sfx.play('capture'); const pData = gameState.players[myPlayerId]; if (pData) animations.push(new CaptureRing(newPlanet.x, newPlanet.y, newPlanet.radius, pData.color)); } else if (oldOwner === myPlayerId) { sfx.play('loss'); } } }); } if (state.planets) { state.planets.forEach(p => { previousPlanetsState[p.id] = p.owner; if (!clientPlanets[p.id]) clientPlanets[p.id] = { rotation: Math.random() * Math.PI * 2 }; }); } gameState = state; });
socket.on('combatResult', (data) => { sfx.play('explosion'); const planet = gameState.planets.find(p => p.x === data.x && p.y === data.y); const owner = gameState.players[planet?.owner]; const color = owner ? owner.color : NEUTRAL_COLOR; animations.push(new Explosion(data.x, data.y, color)); });
socket.on('forceReload', (data) => { const winnerMessage = document.getElementById('winner-message'); if (data.winner) { winnerMessage.textContent = `Victoire de ${data.winner.name}`; winnerMessage.style.color = data.winner.color; const myPlayer = gameState.players[myPlayerId]; if (myPlayer && data.winner.name.includes(myPlayer.teamId)) { winnerMessage.textContent = "🏆 Victoire ! 🏆"; } } else { winnerMessage.textContent = "Fin de la partie"; } gameOverScreen.classList.remove('hidden'); setTimeout(() => { window.location.reload(); }, 5000); });

// --- Démarrage du Jeu ---
loadTextures().then(() => {
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}).catch(err => {
    console.error("Impossible de charger les textures.", err);
    document.body.innerHTML = `<div style="color: red; text-align: center; margin-top: 50px; font-size: 24px;">Erreur: Impossible de charger les textures du jeu. Vérifiez la console (F12). Assurez-vous que le dossier /public/textures contient bien toutes les images.</div>`;
});
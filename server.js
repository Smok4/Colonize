// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// --- CONSTANTES DE JEU ---
const MAP_WIDTH = 1600;
const MAP_HEIGHT = 900;
const PLANET_COUNT = 25;
const MIN_PLANET_RADIUS = 20;
const MAX_PLANET_RADIUS = 50;
const GAME_TICK_RATE = 1000 / 30;

const TEAM_COLORS = { 1: ['#4d94ff', '#3366ff'], 2: ['#ff4d4d', '#ff3333'] };
const MAX_PLAYERS_PER_TEAM = 2;
const PLANET_TYPES = ['moon', 'sun', 'saturn', 'earth', 'mars', 'mercury', 'jupiter', 'neptune', 'uranus'];

const STARTING_CREDITS = 500;
const BASE_PLANET_INCOME = 5;

const SHIP_TYPES = {
    fighter: { cost: 40, hp: 10, attack: 1 },
    cruiser: { cost: 150, hp: 50, attack: 5 },
    battleship: { cost: 600, hp: 250, attack: 25 }
};

const UPGRADES = {
    forge: { baseCost: 250, incomeBonus: 5 },
    shield: { cost: 400, hp: 500 }
};

// --- État du jeu ---
let players = {};
let planets = [];
let fleets = [];
let gameInterval = null;
let gameInProgress = false;

function initializeGame() {
    if (gameInProgress) return;

    console.log("🚀 Initialisation d'une nouvelle partie...");
    gameInProgress = true;
    planets = [];
    fleets = [];

    for (let i = 0; i < PLANET_COUNT; i++) {
        planets.push({
            id: i, x: Math.random() * (MAP_WIDTH - 100) + 50, y: Math.random() * (MAP_HEIGHT - 100) + 50,
            radius: Math.floor(Math.random() * (MAX_PLANET_RADIUS - MIN_PLANET_RADIUS) + MIN_PLANET_RADIUS),
            type: PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)],
            owner: null, income: BASE_PLANET_INCOME + Math.floor(Math.random() * 5),
            ships: { fighter: 0, cruiser: 0, battleship: 0 },
            forgeLevel: 0, shieldHP: 0
        });
    }
    
    Object.values(players).forEach(player => assignPlayerToPlanet(player.id));

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, GAME_TICK_RATE);
    console.log("Partie démarrée !");
}

function gameLoop() {
    if (!gameInProgress) return;

    Object.values(players).forEach(player => {
        let totalIncome = 0;
        planets.forEach(planet => { if (planet.owner === player.id) { totalIncome += planet.income + (planet.forgeLevel * UPGRADES.forge.incomeBonus); } });
        player.credits += totalIncome / (1000 / GAME_TICK_RATE);
    });

    fleets.forEach((fleet, index) => {
        const destPlanet = planets[fleet.destination];
        if (!destPlanet) { fleets.splice(index, 1); return; }
        const dx = destPlanet.x - fleet.x; const dy = destPlanet.y - fleet.y;
        const dist = Math.sqrt(dx * dx + dy * dy); const speed = 80;
        if (dist <= destPlanet.radius) { resolveCombat(fleet, destPlanet); fleets.splice(index, 1); }
        else { fleet.x += (dx / dist) * (speed / (1000 / GAME_TICK_RATE)); fleet.y += (dy / dist) * (speed / (1000 / GAME_TICK_RATE)); }
    });

    checkEndGame();
    io.emit('gameState', { planets, fleets, players });
}

function resolveCombat(fleet, destinationPlanet) {
    io.emit('combatResult', { x: destinationPlanet.x, y: destinationPlanet.y });
    const attacker = players[fleet.owner]; const defender = players[destinationPlanet.owner];
    if (attacker && defender && attacker.teamId === defender.teamId) { for(const type in fleet.ships) destinationPlanet.ships[type] += fleet.ships[type]; return; }
    let attackerPower = { hp: 0, attack: 0 }; for (const type in fleet.ships) { attackerPower.hp += fleet.ships[type] * SHIP_TYPES[type].hp; attackerPower.attack += fleet.ships[type] * SHIP_TYPES[type].attack; }
    let defenderShipsHP = 0; let defenderPower = { attack: 0 }; for (const type in destinationPlanet.ships) { defenderShipsHP += destinationPlanet.ships[type] * SHIP_TYPES[type].hp; defenderPower.attack += destinationPlanet.ships[type] * SHIP_TYPES[type].attack; }
    const damageToShield = Math.min(destinationPlanet.shieldHP, attackerPower.attack);
    destinationPlanet.shieldHP -= damageToShield;
    const remainingAttack = attackerPower.attack - damageToShield;
    const defenderHPLost = remainingAttack; const attackerHPLost = defenderPower.attack;
    const finalAttackerHP = attackerPower.hp - attackerHPLost; const finalDefenderHP = defenderShipsHP - defenderHPLost;
    if (finalAttackerHP > finalDefenderHP) { destinationPlanet.owner = fleet.owner; const healthRatio = attackerPower.hp > 0 ? Math.max(0, finalAttackerHP / attackerPower.hp) : 0; for(const type in fleet.ships) destinationPlanet.ships[type] = Math.floor(fleet.ships[type] * healthRatio); }
    else { const healthRatio = defenderShipsHP > 0 ? Math.max(0, finalDefenderHP / defenderShipsHP) : 0; for(const type in destinationPlanet.ships) destinationPlanet.ships[type] = Math.floor(destinationPlanet.ships[type] * healthRatio); }
}

function checkEndGame() {
    if (!gameInProgress || Object.keys(players).length < 2) return;
    const activeTeams = new Set();
    planets.forEach(p => { if (p.owner && players[p.owner]) activeTeams.add(players[p.owner].teamId); });
    if (activeTeams.size === 1) { const winningTeamId = activeTeams.values().next().value; endGame(winningTeamId); }
}

function endGame(winningTeamId) {
    if (!gameInProgress) return;

    clearInterval(gameInterval);
    gameInterval = null;
    gameInProgress = false;
    console.log("Partie terminée.");
    
    const winnerInfo = winningTeamId ? { name: `Équipe ${winningTeamId}`, color: TEAM_COLORS[winningTeamId][0] } : { name: `Égalité`, color: '#FFFFFF' };
    io.emit('forceReload', { winner: winnerInfo });
    
    players = {};
    console.log(`Serveur réinitialisé et en attente de joueurs...`);
}

function assignPlayerToPlanet(socketId) {
    const availablePlanets = planets.filter(p => p.owner === null);
    if (availablePlanets.length > 0) {
        const planetIndex = Math.floor(Math.random() * availablePlanets.length);
        const planet = availablePlanets[planetIndex];
        planet.owner = socketId;
        planet.ships = { fighter: 5, cruiser: 0, battleship: 0 };
    }
}

io.on('connection', (socket) => {
    if (Object.keys(players).length >= MAX_PLAYERS_PER_TEAM * 2) {
        socket.emit('gameFull', { message: 'Le serveur est plein.' });
        socket.disconnect();
        return;
    }

    const team1Size = Object.values(players).filter(p => p.teamId === 1).length;
    const team2Size = Object.values(players).filter(p => p.teamId === 2).length;
    let assignedTeamId = (team1Size <= team2Size) ? 1 : 2;
    
    const teamColors = TEAM_COLORS[assignedTeamId];
    const playerColor = teamColors[assignedTeamId === 1 ? team1Size : team2Size];
    
    players[socket.id] = { id: socket.id, color: playerColor, teamId: assignedTeamId, credits: STARTING_CREDITS };
    console.log(`Player ${socket.id} (${playerColor}) a rejoint.`);

    if (!gameInProgress && Object.keys(players).length >= 1) {
        initializeGame();
    } else if (gameInProgress) {
        assignPlayerToPlanet(socket.id);
    }

    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} a quitté.`);
        const player = players[socket.id];
        if (player) {
            planets.forEach(p => { if (p.owner === socket.id) { p.owner = null; p.forgeLevel = 0; p.shieldHP = 0; }});
            delete players[socket.id];
            if (gameInProgress) checkEndGame();
        }
    });

    socket.on('upgradePlanet', (data) => { if (!gameInProgress || !players[socket.id]) return; const player = players[socket.id]; const planet = planets[data.planetId]; if (!planet || planet.owner !== socket.id) return; if (data.upgradeType === 'forge') { const cost = UPGRADES.forge.baseCost * (planet.forgeLevel + 1); if (player.credits >= cost) { player.credits -= cost; planet.forgeLevel++; } } if (data.upgradeType === 'shield' && planet.shieldHP === 0) { if (player.credits >= UPGRADES.shield.cost) { player.credits -= UPGRADES.shield.cost; planet.shieldHP = UPGRADES.shield.hp; } } });
    socket.on('buildShip', (data) => { if (!gameInProgress || !players[socket.id]) return; const player = players[socket.id]; const planet = planets[data.planetId]; const ship = SHIP_TYPES[data.shipType]; if (planet && ship && planet.owner === socket.id && player.credits >= ship.cost) { player.credits -= ship.cost; planet.ships[data.shipType]++; } });
    socket.on('sendFleet', (data) => { if (!gameInProgress || !players[socket.id]) return; const player = players[socket.id]; const originPlanet = planets[data.originId]; if (originPlanet && originPlanet.owner === socket.id) { const shipsToSend = { fighter: 0, cruiser: 0, battleship: 0 }; let shipsAreAvailable = true; for (const type in data.ships) { if (originPlanet.ships[type] >= data.ships[type]) shipsToSend[type] = data.ships[type]; else { shipsAreAvailable = false; break; } } if (shipsAreAvailable) { for (const type in shipsToSend) originPlanet.ships[type] -= shipsToSend[type]; fleets.push({ owner: socket.id, ships: shipsToSend, origin: data.originId, destination: data.destinationId, x: originPlanet.x, y: originPlanet.y }); } } });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
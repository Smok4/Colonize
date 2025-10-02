// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuration détaillée de Socket.IO
const io = new socketIo.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 5000,
    allowEIO3: true
});

io.engine.on("initial_headers", (headers, req) => {
    serverLog("Headers initiaux reçus");
});

io.engine.on("headers", (headers, req) => {
    serverLog("Headers de mise à niveau reçus");
});

// Amélioration des logs du serveur
function serverLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
}

serverLog("Démarrage du serveur...");

// Configuration d'Express
app.use(express.static('public'));
app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
    serverLog("Page d'accueil demandée");
    res.sendFile(__dirname + '/public/index.html');
});

// Route pour tester que Socket.IO est disponible
app.get('/socket.io/socket.io.js', (req, res) => {
    serverLog("Fichier Socket.IO demandé");
    res.sendFile(require.resolve('socket.io/client-dist/socket.io.js'));
});

// Vérification de base de l'état du serveur
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        players: Object.keys(players).length,
        gameInProgress: gameInProgress
    });
});

// Gestion des erreurs Express
app.use((err, req, res, next) => {
    serverLog(`Erreur Express: ${err.message}`);
    res.status(500).send('Erreur serveur');
});

// --- CONSTANTES DE JEU ---
const MAP_WIDTH = 3200;
const MAP_HEIGHT = 1800;
const PLANET_COUNT = 250;
const MIN_PLANET_RADIUS = 20;
const MAX_PLANET_RADIUS = 50;
const GAME_TICK_RATE = 1000 / 30;

const TEAM_COLORS = { 1: ['#4d94ff', '#3366ff'], 2: ['#ff4d4d', '#ff3333'] };
const MAX_PLAYERS_PER_TEAM = 2;
const PLANET_TYPES = ['moon', 'sun', 'saturn', 'earth', 'mars', 'mercury', 'jupiter', 'neptune', 'uranus'];

const TECH_TREE = {
    military: {
        // Niveau 1
        improvedWeapons: {
            name: "Armes Améliorées",
            description: "Augmente les dégâts de base de tous vos vaisseaux",
            cost: { credits: 400, minerals: 200 },
            requirements: [],
            tier: 1,
            effects: { attackBonus: 0.2 }
        },
        reinforcedHulls: {
            name: "Coques Renforcées",
            description: "Augmente la résistance de vos vaisseaux",
            cost: { credits: 400, minerals: 300 },
            requirements: [],
            tier: 1,
            effects: { hpBonus: 0.25 }
        },
        // Niveau 2
        advancedShields: {
            name: "Boucliers Avancés",
            description: "Améliore la protection des boucliers planétaires",
            cost: { credits: 800, minerals: 400, energy: 200 },
            requirements: ["reinforcedHulls"],
            tier: 2,
            effects: { shieldBonus: 0.4 }
        },
        quantumTargeting: {
            name: "Visée Quantique",
            description: "Améliore la précision des vaisseaux en combat",
            cost: { credits: 800, minerals: 300, energy: 300 },
            requirements: ["improvedWeapons"],
            tier: 2,
            effects: { accuracyBonus: 0.3 }
        },
        // Niveau 3
        plasmaCannons: {
            name: "Canons à Plasma",
            description: "Armes dévastatrices à haute énergie",
            cost: { credits: 1200, minerals: 600, energy: 400 },
            requirements: ["quantumTargeting"],
            tier: 3,
            effects: { attackBonus: 0.4, energyCost: 0.2 }
        },
        adaptiveShielding: {
            name: "Boucliers Adaptatifs",
            description: "Boucliers qui se régénèrent en combat",
            cost: { credits: 1500, minerals: 500, energy: 500 },
            requirements: ["advancedShields"],
            tier: 3,
            effects: { shieldRegeneration: true, shieldBonus: 0.3 }
        }
    },
    economy: {
        // Niveau 1
        efficientMining: {
            name: "Extraction Efficace",
            description: "Améliore la production de minerais",
            cost: { credits: 400, energy: 100 },
            requirements: [],
            tier: 1,
            effects: { mineralProductionBonus: 0.25 }
        },
        advancedReactors: {
            name: "Réacteurs Avancés",
            description: "Améliore la production d'énergie",
            cost: { credits: 400, minerals: 200 },
            requirements: [],
            tier: 1,
            effects: { energyProductionBonus: 0.3 }
        },
        // Niveau 2
        automatedMining: {
            name: "Extraction Automatisée",
            description: "Robots mineurs augmentant significativement la production",
            cost: { credits: 800, energy: 300 },
            requirements: ["efficientMining"],
            tier: 2,
            effects: { mineralProductionBonus: 0.4, workerEfficiency: 0.2 }
        },
        fusionPowerplants: {
            name: "Centrales à Fusion",
            description: "Centrales énergétiques hautement efficaces",
            cost: { credits: 900, minerals: 400 },
            requirements: ["advancedReactors"],
            tier: 2,
            effects: { energyProductionBonus: 0.5, energyStorageBonus: 0.3 }
        },
        // Niveau 3
        quantumExtraction: {
            name: "Extraction Quantique",
            description: "Technologie révolutionnaire d'extraction de ressources",
            cost: { credits: 1500, energy: 600 },
            requirements: ["automatedMining"],
            tier: 3,
            effects: { mineralProductionBonus: 0.6, specialResourceChance: 0.1 }
        },
        antimatterReactors: {
            name: "Réacteurs à Antimatière",
            description: "Production d'énergie quasi illimitée",
            cost: { credits: 2000, minerals: 800, energy: 1000 },
            requirements: ["fusionPowerplants"],
            tier: 3,
            effects: { energyProductionBonus: 1.0, energyStorageBonus: 0.5 }
        }
    },
    exploration: {
        // Niveau 1
        improvedEngines: {
            name: "Moteurs Améliorés",
            description: "Augmente la vitesse de vos flottes",
            cost: { credits: 300, energy: 150 },
            requirements: [],
            tier: 1,
            effects: { speedBonus: 0.3 }
        },
        advancedSensors: {
            name: "Capteurs Avancés",
            description: "Améliore la portée de détection",
            cost: { credits: 400, energy: 200 },
            requirements: [],
            tier: 1,
            effects: { scanRange: 0.4 }
        },
        // Niveau 2
        warpDrive: {
            name: "Moteur Warp",
            description: "Permet des sauts interstellaires rapides",
            cost: { credits: 1000, energy: 500 },
            requirements: ["improvedEngines"],
            tier: 2,
            effects: { warpCapability: true, warpSpeedBonus: 0.5 }
        },
        stealthTechnology: {
            name: "Technologie Furtive",
            description: "Réduit la détection de vos flottes",
            cost: { credits: 800, minerals: 400, energy: 300 },
            requirements: ["advancedSensors"],
            tier: 2,
            effects: { stealthBonus: 0.4 }
        },
        // Niveau 3
        quantumPropulsion: {
            name: "Propulsion Quantique",
            description: "Déplacements quasi instantanés",
            cost: { credits: 2000, minerals: 1000, energy: 1000 },
            requirements: ["warpDrive"],
            tier: 3,
            effects: { instantTravel: true, warpSpeedBonus: 1.0 }
        },
        dimensionalScanning: {
            name: "Scan Dimensionnel",
            description: "Détection à travers l'espace-temps",
            cost: { credits: 1500, minerals: 500, energy: 800 },
            requirements: ["stealthTechnology"],
            tier: 3,
            effects: { omniscientScan: true, scanRange: 1.0 }
        }
    }
};

const RESOURCES = {
    credits: { name: 'Crédits', startAmount: 450 },
    minerals: { name: 'Minerais', startAmount: 100 },
    energy: { name: 'Énergie', startAmount: 50 }
};

const PRODUCTION_RATES = {
    minerals: { min: 2, max: 8 },
    energy: { min: 1, max: 5 }
};

const BASE_PLANET_INCOME = 5;

const FORMATIONS = {
    standard: { name: 'Standard', speedMod: 1, attackMod: 1, defenseMod: 1 },
    offensive: { name: 'Offensive', speedMod: 0.8, attackMod: 1.3, defenseMod: 0.7 },
    defensive: { name: 'Défensive', speedMod: 0.7, attackMod: 0.8, defenseMod: 1.5 },
    scout: { name: 'Éclaireur', speedMod: 1.5, attackMod: 0.5, defenseMod: 0.5 }
};

const SHIP_TYPES = {
    fighter: { 
        cost: 40, 
        hp: 10, 
        attack: 1,
        speed: 100,
        bonusVs: ['cruiser'],
        weakVs: ['battleship'],
        description: 'Rapide et efficace contre les croiseurs'
    },
    cruiser: { 
        cost: 150, 
        hp: 50, 
        attack: 5,
        bonusVs: ['battleship'],
        weakVs: ['fighter'],
        description: 'Polyvalent, bonus contre les vaisseaux de guerre'
    },
    battleship: { 
        cost: 600, 
        hp: 250, 
        attack: 25,
        bonusVs: ['fighter'],
        weakVs: ['cruiser'],
        description: 'Puissant mais vulnérable aux croiseurs'
    }
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
let previousPlanetsState = {};

// Fonction de nettoyage de l'état du jeu
function resetGameState() {
    players = {};
    planets = [];
    fleets = [];
    previousPlanetsState = {};
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    gameInProgress = false;
}

function initializeGame() {
    serverLog("🎮 Tentative d'initialisation du jeu...");
    if (gameInProgress) {
        serverLog("⚠️ Une partie est déjà en cours");
        return;
    }

    serverLog("🚀 Initialisation d'une nouvelle partie...");
    serverLog("Création des planètes et réinitialisation de l'état du jeu");
    gameInProgress = true;
    planets = [];
    fleets = [];
    previousPlanetsState = {};

    // Fonction pour vérifier si une nouvelle planète chevauche les existantes
    function checkPlanetOverlap(newX, newY, newRadius) {
        for (const planet of planets) {
            const dx = newX - planet.x;
            const dy = newY - planet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = newRadius + planet.radius + 30; // 30 pixels de marge supplémentaire
            if (distance < minDistance) {
                return true; // Il y a chevauchement
            }
        }
        return false;
    }

    for (let i = 0; i < PLANET_COUNT; i++) {
        let x, y, radius;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            // Calculer d'abord le rayon
            radius = Math.floor(Math.random() * (MAX_PLANET_RADIUS - MIN_PLANET_RADIUS) + MIN_PLANET_RADIUS);
            
            // Générer les coordonnées en tenant compte du rayon pour éviter les sorties de carte
            x = Math.random() * (MAP_WIDTH - (radius * 2 + 60)) + (radius + 30);
            y = Math.random() * (MAP_HEIGHT - (radius * 2 + 60)) + (radius + 30);
            attempts++;
            if (attempts >= maxAttempts) {
                console.log("Impossible de placer plus de planètes sans chevauchement");
                break;
            }
        } while (checkPlanetOverlap(x, y, radius));

        planets.push({
            id: i, x, y, radius,
            type: PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)],
            owner: null, 
            income: BASE_PLANET_INCOME + Math.floor(Math.random() * 5),
            ships: { fighter: 0, cruiser: 0, battleship: 0 },
            forgeLevel: 0, 
            shieldHP: 0,
            rallyPoint: null,
            resources: {
                minerals: {
                    production: Math.floor(Math.random() * 
                        (PRODUCTION_RATES.minerals.max - PRODUCTION_RATES.minerals.min) + 
                        PRODUCTION_RATES.minerals.min),
                    storage: 500 // Ressources initiales de la planète
                },
                energy: {
                    production: Math.floor(Math.random() * 
                        (PRODUCTION_RATES.energy.max - PRODUCTION_RATES.energy.min) + 
                        PRODUCTION_RATES.energy.min),
                    storage: 500 // Ressources initiales de la planète
                }
            },
            tradeRoutes: []
        });
    }
    
    Object.values(players).forEach(player => assignPlayerToPlanet(player.id));

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, GAME_TICK_RATE);
    console.log("Partie démarrée !");
}

function checkTechnologyRequirements(player, techName, category) {
    const tech = TECH_TREE[category][techName];
    if (!tech) return false;

    // Vérifier si toutes les technologies requises sont débloquées
    return tech.requirements.every(req => player.technologies[category].includes(req));
}

function applyTechnologyEffects(player, techName, category) {
    const tech = TECH_TREE[category][techName];
    if (!tech) return;

    // Appliquer les effets de la technologie
    for (const [effect, value] of Object.entries(tech.effects)) {
        switch (effect) {
            // Bonus militaires
            case 'attackBonus':
                player.bonuses.attack *= (1 + value);
                break;
            case 'hpBonus':
                player.bonuses.hp *= (1 + value);
                break;
            case 'shieldBonus':
                player.bonuses.shield *= (1 + value);
                break;
            case 'accuracyBonus':
                player.bonuses.accuracy *= (1 + value);
                break;
            case 'shieldRegeneration':
                player.bonuses.shieldRegeneration = value;
                break;
            case 'energyCost':
                player.bonuses.energyCost = value;
                break;

            // Bonus économiques
            case 'mineralProductionBonus':
                player.bonuses.mineralProduction *= (1 + value);
                break;
            case 'energyProductionBonus':
                player.bonuses.energyProduction *= (1 + value);
                break;
            case 'workerEfficiency':
                player.bonuses.workerEfficiency *= (1 + value);
                break;
            case 'energyStorageBonus':
                player.bonuses.energyStorage *= (1 + value);
                break;
            case 'specialResourceChance':
                player.bonuses.specialResourceChance = value;
                break;

            // Bonus d'exploration
            case 'speedBonus':
                player.bonuses.speed *= (1 + value);
                break;
            case 'warpCapability':
                player.bonuses.warpCapability = value;
                break;
            case 'warpSpeedBonus':
                player.bonuses.warpSpeed *= (1 + value);
                break;
            case 'scanRange':
                player.bonuses.scanRange *= (1 + value);
                break;
            case 'stealthBonus':
                player.bonuses.stealth *= (1 + value);
                break;
            case 'instantTravel':
                player.bonuses.instantTravel = value;
                break;
            case 'omniscientScan':
                player.bonuses.omniscientScan = value;
                break;
        }
    }
}

function gameLoop() {
    if (!gameInProgress) return;

    // Gestion des ressources et du commerce
    Object.values(players).forEach(player => {
        // Revenus de base
        let totalIncome = 0;
        planets.forEach(planet => { 
            if (planet.owner === player.id) {
                // Crédits de base
                totalIncome += planet.income + (planet.forgeLevel * UPGRADES.forge.incomeBonus);

                // Régénération des boucliers si la technologie est disponible
                if (player.bonuses.shieldRegeneration && planet.shieldHP < UPGRADES.shield.hp) {
                    planet.shieldHP = Math.min(
                        UPGRADES.shield.hp,
                        planet.shieldHP + (UPGRADES.shield.hp * 0.01 * player.bonuses.shield) / (1000 / GAME_TICK_RATE)
                    );
                }
                
                // Production de ressources avec bonus technologiques
                for (const resource of ['minerals', 'energy']) {
                    let productionRate = planet.resources[resource].production;

                    // Appliquer les bonus de production selon le type de ressource
                    if (resource === 'minerals') {
                        productionRate *= player.bonuses.mineralProduction;
                        if (player.bonuses.workerEfficiency) {
                            productionRate *= (1 + player.bonuses.workerEfficiency);
                        }
                    } else if (resource === 'energy') {
                        productionRate *= player.bonuses.energyProduction;
                    }

                    // Calculer la capacité de stockage maximale
                    let maxStorage = 1000; // Capacité de base
                    if (resource === 'energy' && player.bonuses.energyStorage) {
                        maxStorage *= (1 + player.bonuses.energyStorage);
                    }

                    // Ajouter la production en respectant la limite de stockage
                    planet.resources[resource].storage = Math.min(
                        maxStorage,
                        planet.resources[resource].storage + productionRate / (1000 / GAME_TICK_RATE)
                    );
                }

                // Traitement des routes commerciales
                planet.tradeRoutes.forEach(route => {
                    const destinationPlanet = planets[route.destinationId];
                    if (destinationPlanet && destinationPlanet.owner === planet.owner) {
                        const resourceAmount = route.amount / (1000 / GAME_TICK_RATE);
                        if (planet.resources[route.resource].storage >= resourceAmount) {
                            planet.resources[route.resource].storage -= resourceAmount;
                            destinationPlanet.resources[route.resource].storage += resourceAmount;
                        }
                    }
                });
            }
        });
        player.resources.credits += totalIncome / (1000 / GAME_TICK_RATE);
    });

    fleets.forEach((fleet, index) => {
        // Gestion du mouvement de la flotte
        let targetX, targetY;
        if (fleet.path && fleet.path.length > 0) {
            // Si la flotte suit un chemin prédéfini
            const nextPoint = fleet.path[0];
            targetX = nextPoint.x;
            targetY = nextPoint.y;
            
            const dx = targetX - fleet.x;
            const dy = targetY - fleet.y;
            const distToPoint = Math.sqrt(dx * dx + dy * dy);
            
            if (distToPoint < 5) { // Si on est assez proche du point
                fleet.path.shift(); // Passer au point suivant
                if (fleet.path.length === 0 && !fleet.destination) {
                    fleets.splice(index, 1);
                    return;
                }
            }
        } else {
            // Mouvement direct vers la planète de destination
            const destPlanet = planets[fleet.destination];
            if (!destPlanet) { fleets.splice(index, 1); return; }
            targetX = destPlanet.x;
            targetY = destPlanet.y;
            
            const dx = targetX - fleet.x;
            const dy = targetY - fleet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist <= destPlanet.radius) {
                resolveCombat(fleet, destPlanet);
                fleets.splice(index, 1);
                return;
            }
        }
        
        // Calcul du mouvement avec bonus de vitesse
        const dx = targetX - fleet.x;
        const dy = targetY - fleet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const baseSpeed = 80;
        const player = players[fleet.owner];
        let speed = baseSpeed * (fleet.speedMod || 1);

        // Appliquer les bonus de vitesse du joueur
        if (player && player.bonuses) {
            speed *= player.bonuses.speed;
            
            // Bonus warp si disponible et applicable
            if (player.bonuses.warpCapability && dist > 300) {
                speed *= (1 + player.bonuses.warpSpeed);
            }
            
            // Voyage instantané si la technologie est débloquée
            if (player.bonuses.instantTravel) {
                speed *= 3; // Triple vitesse pour simuler un quasi-voyage instantané
            }
        }
        
        fleet.x += (dx / dist) * (speed / (1000 / GAME_TICK_RATE));
        fleet.y += (dy / dist) * (speed / (1000 / GAME_TICK_RATE));
    });

    checkEndGame();
    io.emit('gameState', { planets, fleets, players });
}

function resolveCombat(fleet, destinationPlanet) {
    io.emit('combatResult', { x: destinationPlanet.x, y: destinationPlanet.y });
    const attacker = players[fleet.owner];
    const defender = players[destinationPlanet.owner];
    
    // Application des modificateurs de formation
    const attackMod = fleet.attackMod || 1;
    const defenseMod = fleet.defenseMod || 1;

    // Si même équipe, fusion des flottes
    if (attacker && defender && attacker.teamId === defender.teamId) {
        for(const type in fleet.ships) {
            destinationPlanet.ships[type] += fleet.ships[type];
        }
        return;
    }

    // Calcul des forces avec bonus/malus
    function calculateFleetPower(ships, isAttacker) {
        let power = { hp: 0, attack: 0 };
        
        // Récupérer le joueur concerné et ses bonus
        const player = isAttacker ? attacker : defender;
        const bonuses = player ? player.bonuses : { attack: 1, hp: 1, accuracy: 1 };
        
        for (const attackerType in ships) {
            const shipCount = ships[attackerType];
            const shipStats = SHIP_TYPES[attackerType];
            let totalAttack = shipStats.attack * bonuses.attack; // Appliquer le bonus d'attaque
            let totalHP = shipStats.hp * bonuses.hp; // Appliquer le bonus de HP

            // Vérifie les bonus contre chaque type de vaisseau ennemi
            const enemyShips = isAttacker ? destinationPlanet.ships : fleet.ships;
            for (const defenderType in enemyShips) {
                if (enemyShips[defenderType] > 0) {
                    if (shipStats.bonusVs.includes(defenderType)) {
                        totalAttack *= 1.5; // 50% de bonus
                    }
                    if (shipStats.weakVs.includes(defenderType)) {
                        totalAttack *= 0.7; // 30% de malus
                    }
                }
            }

            // Appliquer les bonus de précision
            if (bonuses.accuracy && bonuses.accuracy > 1) {
                totalAttack *= bonuses.accuracy;
            }

            power.hp += shipCount * totalHP;
            power.attack += shipCount * totalAttack;
        }
        return power;
    }

    const attackerPower = calculateFleetPower(fleet.ships, true);
    let defenderPower = calculateFleetPower(destinationPlanet.ships, false);

    // Gestion des boucliers
    const damageToShield = Math.min(destinationPlanet.shieldHP, attackerPower.attack);
    destinationPlanet.shieldHP -= damageToShield;
    const remainingAttack = attackerPower.attack - damageToShield;

    // Combat
    const defenderHPLost = remainingAttack;
    const attackerHPLost = defenderPower.attack;
    const finalAttackerHP = attackerPower.hp - attackerHPLost;
    const finalDefenderHP = defenderPower.hp - defenderHPLost;

    // Résolution du combat
    if (finalAttackerHP > finalDefenderHP) {
        destinationPlanet.owner = fleet.owner;
        const healthRatio = attackerPower.hp > 0 ? Math.max(0, finalAttackerHP / attackerPower.hp) : 0;
        
        // Les vaisseaux survivants sont proportionnels aux dégâts subis
        for(const type in fleet.ships) {
            destinationPlanet.ships[type] = Math.floor(fleet.ships[type] * healthRatio);
        }

        // Bonus de capture : récupération partielle des vaisseaux défenseurs détruits
        const salvageRatio = 0.2; // 20% de récupération
        for(const type in destinationPlanet.ships) {
            if (type in fleet.ships) {
                const salvaged = Math.floor(destinationPlanet.ships[type] * salvageRatio);
                destinationPlanet.ships[type] = salvaged;
            }
        }
    } else {
        const healthRatio = defenderPower.hp > 0 ? Math.max(0, finalDefenderHP / defenderPower.hp) : 0;
        for(const type in destinationPlanet.ships) {
            destinationPlanet.ships[type] = Math.floor(destinationPlanet.ships[type] * healthRatio);
        }
    }

    // Notification du résultat du combat
    io.emit('combatDetails', {
        location: { x: destinationPlanet.x, y: destinationPlanet.y },
        attacker: { owner: fleet.owner, initialPower: attackerPower, finalHP: finalAttackerHP },
        defender: { owner: destinationPlanet.owner, initialPower: defenderPower, finalHP: finalDefenderHP },
        shieldDamage: damageToShield
    });
}

function checkEndGame() {
    if (!gameInProgress || Object.keys(players).length < 2) return;
    const activeTeams = new Set();
    planets.forEach(p => { if (p.owner && players[p.owner]) activeTeams.add(players[p.owner].teamId); });
    if (activeTeams.size === 1) { const winningTeamId = activeTeams.values().next().value; endGame(winningTeamId); }
}

function endGame(winningTeamId) {
    serverLog("🏁 Tentative de fin de partie...");
    if (!gameInProgress) {
        serverLog("⚠️ Aucune partie en cours à terminer");
        return;
    }

    clearInterval(gameInterval);
    gameInterval = null;
    gameInProgress = false;
    serverLog("🎯 Partie terminée!");
    
    const winnerInfo = winningTeamId ? { name: `Équipe ${winningTeamId}`, color: TEAM_COLORS[winningTeamId][0] } : { name: `Égalité`, color: '#FFFFFF' };
    io.emit('forceReload', { winner: winnerInfo });
    
    // Réinitialisation complète
    players = {};
    planets = [];
    fleets = [];
    previousPlanetsState = {};
    
    console.log(`Serveur réinitialisé et en attente de joueurs...`);
    
    // Démarrer automatiquement une nouvelle partie
    setTimeout(() => {
        if (Object.keys(players).length > 0) {
            console.log("Démarrage automatique d'une nouvelle partie...");
            initializeGame();
        }
    }, 1000);
}

function assignPlayerToPlanet(socketId) {
    console.log(`Tentative d'attribution de planète pour le joueur ${socketId}`);
    if (!planets || planets.length === 0) {
        console.log("Erreur: Aucune planète n'existe encore!");
        return;
    }

    // Vérifier si le joueur a déjà une planète
    const hasStartingPlanet = planets.some(p => p.owner === socketId);
    if (hasStartingPlanet) {
        console.log(`Le joueur ${socketId} a déjà une planète de départ`);
        return;
    }

    const availablePlanets = planets.filter(p => p.owner === null);
    console.log(`Planètes disponibles: ${availablePlanets.length}`);

    if (availablePlanets.length > 0) {
        const planetIndex = Math.floor(Math.random() * availablePlanets.length);
        const planet = availablePlanets[planetIndex];
        planet.owner = socketId;
        
        // Ressources et vaisseaux de départ améliorés
        planet.ships = { 
            fighter: 10,  // Plus de chasseurs
            cruiser: 2,   // Quelques croiseurs
            battleship: 0
        };
        
        // Augmenter les ressources de départ de la planète
        planet.resources = {
            minerals: {
                production: planet.resources.minerals.production,
                storage: 800  // Plus de minerais stockés
            },
            energy: {
                production: planet.resources.energy.production,
                storage: 600  // Plus d'énergie stockée
            }
        };

        // Augmenter le revenu de base
        planet.income = BASE_PLANET_INCOME * 2;

        console.log(`Planète ${planet.id} attribuée au joueur ${socketId}`);
    } else {
        console.log(`Aucune planète disponible pour le joueur ${socketId}`);
    }
}

// S'assurer que le jeu est dans un état propre au démarrage
resetGameState();

// Configuration des événements Socket.IO
io.engine.on("connection_error", (err) => {
    serverLog(`Erreur de connexion Socket.IO: ${err.message}`);
});

io.on('connection', (socket) => {
    serverLog(`➡️ Nouvelle connexion - Socket ID: ${socket.id}`);
    serverLog(`Nombre total de joueurs: ${Object.keys(players).length + 1}`);

    // Envoyer immédiatement un accusé de réception au client
    socket.emit('connected', { 
        id: socket.id,
        message: 'Connexion établie avec succès'
    });

    if (Object.keys(players).length >= MAX_PLAYERS_PER_TEAM * 2) {
        serverLog("❌ Serveur plein - Connexion refusée");
        socket.emit('gameFull', { message: 'Le serveur est plein.' });
        socket.disconnect();
        return;
    }

    const team1Size = Object.values(players).filter(p => p.teamId === 1).length;
    const team2Size = Object.values(players).filter(p => p.teamId === 2).length;
    let assignedTeamId = (team1Size <= team2Size) ? 1 : 2;
    
    console.log(`Joueur assigné à l'équipe ${assignedTeamId}`);
    
    const teamColors = TEAM_COLORS[assignedTeamId];
    const playerColor = teamColors[assignedTeamId === 1 ? team1Size : team2Size];
    
    players[socket.id] = { 
        id: socket.id, 
        color: playerColor, 
        teamId: assignedTeamId, 
        resources: {
            credits: RESOURCES.credits.startAmount,
            minerals: RESOURCES.minerals.startAmount,
            energy: RESOURCES.energy.startAmount
        },
        technologies: {
            military: [],
            economy: [],
            exploration: []
        },
        planetsControlled: 0, // Ajout d'un compteur de planètes
        bonuses: {
            // Bonus militaires
            attack: 1,
            hp: 1,
            shield: 1,
            accuracy: 1,
            shieldRegeneration: false,
            energyCost: 0,

            // Bonus économiques
            mineralProduction: 1,
            energyProduction: 1,
            workerEfficiency: 1,
            energyStorage: 1,
            specialResourceChance: 0,

            // Bonus d'exploration
            speed: 1,
            warpCapability: false,
            warpSpeed: 1,
            scanRange: 1,
            stealth: 1,
            instantTravel: false,
            omniscientScan: false
        }
    };
        console.log(`Player ${socket.id} (${playerColor}) a rejoint.`);

    // Toujours initialiser une nouvelle partie si aucune n'est en cours
    if (!gameInProgress) {
        console.log("Démarrage d'une nouvelle partie...");
        initializeGame();
    }

    // Assigner une planète au nouveau joueur
    console.log(`Attribution d'une planète au joueur ${socket.id}`);
    assignPlayerToPlanet(socket.id);

    // Envoyer l'état actuel du jeu à tous les joueurs
    io.emit('gameState', { planets, fleets, players });

    console.log("Nombre de joueurs connectés:", Object.keys(players).length);
    
    // Démarrer la partie dès qu'un joueur se connecte
    if (!gameInProgress) {
        console.log("Démarrage d'une nouvelle partie...");
        initializeGame();
    }
    
    // Assigner une planète au joueur qui vient de se connecter
    if (gameInProgress) {
        assignPlayerToPlanet(socket.id);
    }

    socket.on('disconnect', () => {
        serverLog(`⬅️ Joueur ${socket.id} a quitté la partie`);
        const player = players[socket.id];
        if (player) {
            serverLog(`Nettoyage des ressources du joueur ${socket.id}`);
            // Réinitialiser les planètes du joueur
            planets.forEach(p => { 
                if (p.owner === socket.id) { 
                    serverLog(`Réinitialisation de la planète ${p.id}`);
                    p.owner = null; 
                    p.forgeLevel = 0; 
                    p.shieldHP = 0;
                    p.ships = { fighter: 0, cruiser: 0, battleship: 0 };
                }
            });
            
            // Supprimer les flottes du joueur
            fleets = fleets.filter(f => f.owner !== socket.id);
            
            // Supprimer le joueur
            delete players[socket.id];
            
            // Envoyer la mise à jour à tous les clients
            io.emit('gameState', { planets, fleets, players });
            
            // Vérifier la fin de partie
            if (gameInProgress) checkEndGame();
            
            // Si plus aucun joueur, réinitialiser le jeu
            if (Object.keys(players).length === 0) {
                console.log("Plus aucun joueur - Réinitialisation du jeu");
                resetGameState();
            }
        }
    });

    socket.on('upgradePlanet', (data) => {
        if (!gameInProgress || !players[socket.id]) return;
        
        const player = players[socket.id];
        const planet = planets[data.planetId];
        
        if (!planet || planet.owner !== socket.id) return;
        
        if (data.upgradeType === 'forge') {
            const cost = UPGRADES.forge.baseCost * (planet.forgeLevel + 1);
            if (player.resources.credits >= cost) {
                player.resources.credits -= cost;
                planet.forgeLevel++;
            }
        }
        
        if (data.upgradeType === 'shield' && planet.shieldHP === 0) {
            if (player.resources.credits >= UPGRADES.shield.cost) {
                player.resources.credits -= UPGRADES.shield.cost;
                planet.shieldHP = UPGRADES.shield.hp;
            }
        }
    });
    socket.on('buildShip', (data) => { 
        if (!gameInProgress || !players[socket.id]) return;
        const player = players[socket.id];
        const planet = planets[data.planetId];
        const ship = SHIP_TYPES[data.shipType];
        
        // Vérifie les ressources nécessaires
        const resourceCost = {
            credits: ship.cost,
            minerals: Math.floor(ship.cost * 0.5),  // 50% du coût en minéraux
            energy: Math.floor(ship.cost * 0.2)     // 20% du coût en énergie
        };

        if (planet && ship && planet.owner === socket.id &&
            player.resources.credits >= resourceCost.credits &&
            planet.resources.minerals.storage >= resourceCost.minerals &&
            planet.resources.energy.storage >= resourceCost.energy) {
            
            // Déduit les ressources
            player.resources.credits -= resourceCost.credits;
            planet.resources.minerals.storage -= resourceCost.minerals;
            planet.resources.energy.storage -= resourceCost.energy;
            
            // Construit le vaisseau
            planet.ships[data.shipType]++;
        }
    });
    socket.on('establishTradeRoute', (data) => {
        if (!gameInProgress || !players[socket.id]) return;
        const originPlanet = planets[data.originId];
        const destinationPlanet = planets[data.destinationId];
        
        if (originPlanet && destinationPlanet && 
            originPlanet.owner === socket.id &&
            destinationPlanet.owner === socket.id) {
            
            // Ajoute ou met à jour la route commerciale
            const existingRouteIndex = originPlanet.tradeRoutes.findIndex(
                route => route.destinationId === data.destinationId && route.resource === data.resource
            );
            
            if (existingRouteIndex !== -1) {
                originPlanet.tradeRoutes[existingRouteIndex].amount = data.amount;
            } else {
                originPlanet.tradeRoutes.push({
                    destinationId: data.destinationId,
                    resource: data.resource,
                    amount: data.amount
                });
            }
        }
    });

    socket.on('cancelTradeRoute', (data) => {
        if (!gameInProgress || !players[socket.id]) return;
        const planet = planets[data.planetId];
        
        if (planet && planet.owner === socket.id) {
            planet.tradeRoutes = planet.tradeRoutes.filter(route => 
                !(route.destinationId === data.destinationId && route.resource === data.resource)
            );
        }
    });

    socket.on('researchTechnology', (data) => {
        if (!gameInProgress || !players[socket.id]) return;
        const player = players[socket.id];
        const { techName, category } = data;

        // Vérifier si la technologie existe et n'est pas déjà recherchée
        if (!TECH_TREE[category] || !TECH_TREE[category][techName]) {
            console.log("Technologie invalide:", techName, category);
            socket.emit('researchFailed', { message: "Technologie invalide" });
            return;
        }

        if (player.technologies[category].includes(techName)) {
            console.log("Technologie déjà recherchée:", techName);
            socket.emit('researchFailed', { message: "Technologie déjà recherchée" });
            return;
        }

        const tech = TECH_TREE[category][techName];

        // Vérifier les prérequis
        if (tech.requirements.length > 0 && !tech.requirements.every(req => player.technologies[category].includes(req))) {
            console.log("Prérequis non remplis pour:", techName);
            console.log("Technologies actuelles:", player.technologies[category]);
            console.log("Prérequis nécessaires:", tech.requirements);
            socket.emit('researchFailed', { message: "Prérequis technologiques non remplis" });
            return;
        }

        // Calculer les ressources totales (incluant les planètes)
        const totalResources = {...player.resources};
        planets.forEach(planet => {
            if (planet.owner === socket.id && planet.resources) {
                totalResources.minerals = (totalResources.minerals || 0) + (planet.resources.minerals.storage || 0);
                totalResources.energy = (totalResources.energy || 0) + (planet.resources.energy.storage || 0);
            }
        });

        // Vérifier les ressources
        for (const [resource, amount] of Object.entries(tech.cost)) {
            if (totalResources[resource] < amount) {
                console.log(`Ressources insuffisantes: ${resource} - Requis: ${amount}, Disponible: ${totalResources[resource]}`);
                socket.emit('researchFailed', { 
                    message: `Ressources insuffisantes: ${resource} (${Math.floor(totalResources[resource])}/${amount})` 
                });
                return;
            }
        }

        // Déduire les ressources
        for (const [resource, amount] of Object.entries(tech.cost)) {
            if (resource === 'credits') {
                player.resources[resource] -= amount;
            } else {
                let remainingCost = amount;
                // Déduire des planètes d'abord
                planets.forEach(planet => {
                    if (planet.owner === socket.id && remainingCost > 0 && planet.resources[resource]) {
                        const deduction = Math.min(remainingCost, planet.resources[resource].storage);
                        planet.resources[resource].storage -= deduction;
                        remainingCost -= deduction;
                    }
                });
                // Si il reste des coûts, les déduire des ressources du joueur
                if (remainingCost > 0) {
                    player.resources[resource] -= remainingCost;
                }
            }
        }

        // Ajouter la technologie et appliquer ses effets
        player.technologies[category].push(techName);
        applyTechnologyEffects(player, techName, category);

        socket.emit('researchComplete', {
            techName,
            category,
            effects: tech.effects
        });

        // Mettre à jour les états pour tous les joueurs
        io.emit('gameState', { planets, fleets, players });
    });

    socket.on('setRallyPoint', (data) => {
        if (!gameInProgress || !players[socket.id]) return;
        const planet = planets[data.planetId];
        if (planet && planet.owner === socket.id) {
            planet.rallyPoint = {
                x: data.x,
                y: data.y,
                planetId: data.targetPlanetId
            };
        }
    });

    socket.on('sendFleet', (data) => { 
        if (!gameInProgress || !players[socket.id]) return;
        const player = players[socket.id];
        const originPlanet = planets[data.originId];
        
        if (originPlanet && originPlanet.owner === socket.id) {
            const shipsToSend = { fighter: 0, cruiser: 0, battleship: 0 };
            let shipsAreAvailable = true;
            
            for (const type in data.ships) {
                if (originPlanet.ships[type] >= data.ships[type]) {
                    shipsToSend[type] = data.ships[type];
                } else {
                    shipsAreAvailable = false;
                    break;
                }
            }
            
            if (shipsAreAvailable) {
                for (const type in shipsToSend) {
                    originPlanet.ships[type] -= shipsToSend[type];
                }
                
                const formationStats = FORMATIONS[data.formation || 'standard'];
                
                const fleet = {
                    owner: socket.id,
                    ships: shipsToSend,
                    origin: data.originId,
                    destination: data.destinationId,
                    x: originPlanet.x,
                    y: originPlanet.y,
                    formation: data.formation || 'standard',
                    speedMod: formationStats.speedMod,
                    attackMod: formationStats.attackMod,
                    defenseMod: formationStats.defenseMod,
                    path: data.path || []
                };

                fleets.push(fleet);

                // Si c'est un point de ralliement, créer une nouvelle flotte automatiquement
                if (data.isRallyPoint && data.autoRebuild) {
                    setTimeout(() => {
                        if (originPlanet.owner === socket.id) {
                            let canRebuild = true;
                            for (const type in shipsToSend) {
                                if (originPlanet.ships[type] < shipsToSend[type]) {
                                    canRebuild = false;
                                    break;
                                }
                            }
                            if (canRebuild) {
                                socket.emit('sendFleet', data);
                            }
                        }
                    }, 10000); // Attendre 10 secondes avant de reconstruire
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    serverLog(`Serveur démarré et en écoute sur le port ${PORT}`);
    serverLog('En attente de connexions...');
});
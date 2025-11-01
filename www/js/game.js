// ============================================
// AGAR.IO: ROLES EDITION - GAME ENGINE
// ============================================

// Configuración global del juego
const GAME_CONFIG = {
    // Roles disponibles con sus estadísticas
    ROLES: {
        predator: {
            name: "DEPREDADOR",
            color: "#FF4757",
            speed: 2.2,
            size: 20,
            splitCost: 30,
            special: "Velocidad mejorada",
            description: "Rápido y agresivo, efectivo contra Tanques"
        },
        tank: {
            name: "TANQUE", 
            color: "#3742FA",
            speed: 0.8,
            size: 35,
            splitCost: 50,
            special: "Resistencia alta",
            description: "Lento pero resistente, efectivo contra Sanadores"
        },
        stealth: {
            name: "SIGILO",
            color: "#5F27CD", 
            speed: 1.6,
            size: 15,
            splitCost: 25,
            special: "Invisibilidad temporal",
            description: "Sigiloso y rápido, efectivo contra Depredadores"
        },
        healer: {
            name: "SANADOR",
            color: "#00D2D3",
            speed: 1.2, 
            size: 25,
            splitCost: 35,
            special: "Regeneración continua",
            description: "Regenera salud, efectivo contra Sigilosos"
        }
    },
    
    // Modos de juego
    MODES: {
        classic: { 
            name: "CLÁSICO", 
            duration: null, 
            enemyCount: 8, 
            foodCount: 100,
            description: "Modo tradicional con dificultad normal"
        },
        survival: { 
            name: "SUPERVIVENCIA", 
            duration: null, 
            enemyCount: 15, 
            foodCount: 80,
            description: "Sobrevive el mayor tiempo posible"
        },
        timed: { 
            name: "TIEMPO", 
            duration: 180, 
            enemyCount: 10, 
            foodCount: 120,
            description: "3 minutos para conseguir la mayor puntuación"
        },
        swarm: { 
            name: "ENJAMBRE", 
            duration: null, 
            enemyCount: 25, 
            foodCount: 150,
            description: "Muchos enemigos pequeños y rápidos"
        }
    },
    
    // Configuración del canvas y juego
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    MAX_FOOD_SIZE: 10,
    PARTICLE_COUNT: 15,
    TRAIL_INTERVAL: 100,
    
    // Configuraciones de rendimiento
    TARGET_FPS: 60,
    MAX_PARTICLES: 200,
    MAX_TRAILS: 50
};

// Estado global del juego
let gameState = {
    // Entidades del juego
    player: null,
    foods: [],
    enemies: [],
    particles: [],
    trails: [],
    
    // Puntuación y estadísticas
    score: 0,
    foodEaten: 0,
    enemiesDefeated: 0,
    startTime: null,
    playTime: 0,
    
    // Selección del usuario
    selectedRole: null,
    selectedMode: null,
    
    // Estado del juego
    gameRunning: false,
    gameMode: null,
    timeLeft: null,
    isPaused: false,
    gameEnded: false,
    
    // Controles
    virtualJoystick: { active: false, x: 0, y: 0 },
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    hasTouch: 'ontouchstart' in window,
    
    // Cache de elementos DOM
    elements: {},
    
    // Estadísticas de rendimiento
    fps: 0,
    lastFrameTime: 0,
    frameCount: 0,
    performanceTimer: 0
};

// ============================================
// INICIALIZACIÓN DEL JUEGO
// ============================================

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    console.log('🎮 Inicializando Agar.io: Roles Edition v2.0');
    
    // Cache de elementos DOM
    cacheElements();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar controles específicos según dispositivo
    setupDeviceSpecificControls();
    
    // Inicializar elementos visuales
    initializeVisualElements();
    
    // Mostrar pantalla de carga
    showLoadingScreen();
    
    // Configurar para mobile si es necesario
    if (gameState.isMobile) {
        setupMobileOptimizations();
    }
    
    console.log('✅ Juego inicializado correctamente');
}

function cacheElements() {
    gameState.elements = {
        gameCanvas: document.getElementById('gameCanvas'),
        titleScreen: document.getElementById('titleScreen'),
        modeSelector: document.getElementById('modeSelector'),
        gameOverScreen: document.getElementById('gameOverScreen'),
        loadingScreen: document.getElementById('loadingScreen'),
        startBtn: document.getElementById('startBtn'),
        scoreValue: document.getElementById('scoreValue'),
        roleName: document.getElementById('roleName'),
        roleIcon: document.getElementById('roleIcon'),
        finalScore: document.getElementById('finalScore'),
        playTime: document.getElementById('playTime'),
        foodEaten: document.getElementById('foodEaten'),
        enemiesDefeated: document.getElementById('enemiesDefeated'),
        timeLeft: document.getElementById('timeLeft'),
        virtualJoystick: document.getElementById('virtualJoystick'),
        joystickHandle: document.getElementById('joystickHandle'),
        mobileControls: document.getElementById('mobileControls'),
        splitBtn: document.getElementById('splitBtn'),
        ejectBtn: document.getElementById('ejectBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        progressBar: document.getElementById('progressBar')
    };
}

function setupEventListeners() {
    // Event listeners para selección de roles
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => selectRole(card.dataset.role));
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectRole(card.dataset.role);
        });
    });
    
    // Event listeners para selección de modos
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', () => selectMode(card.dataset.mode));
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectMode(card.dataset.mode);
        });
    });
    
    // Botón de inicio
    gameState.elements.startBtn.addEventListener('click', handleStartButton);
    
    // Controles del canvas
    setupCanvasControls();
    
    // Controles del joystick virtual
    setupVirtualJoystick();
    
    // Controles móviles
    setupMobileControls();
    
    // Controles de teclado
    setupKeyboardControls();
    
    // Event listeners para redimensionamiento
    window.addEventListener('resize', handleResize);
    
    // Event listeners para visibilidad de página
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

function setupDeviceSpecificControls() {
    if (gameState.isMobile || gameState.hasTouch) {
        // Mostrar controles móviles
        gameState.elements.mobileControls.style.display = 'flex';
        gameState.elements.virtualJoystick.style.display = 'block';
        
        // Configurar controles táctiles optimizados
        setupTouchControls();
    }
}

function setupMobileOptimizations() {
    // Deshabilitar zoom
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    
    // Prevenir scroll
    document.body.style.overflow = 'hidden';
    
    // Optimizar para pantallas táctiles
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Configurar viewport meta tags dinámicamente
    updateViewportForMobile();
}

function updateViewportForMobile() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
}

// ============================================
// SELECCIÓN DE ROLES Y MODOS
// ============================================

function selectRole(roleKey) {
    // Remover selección anterior
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar nuevo rol
    const selectedCard = document.querySelector(`[data-role="${roleKey}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    gameState.selectedRole = roleKey;
    updateRoleDisplay();
    
    console.log(`👤 Rol seleccionado: ${GAME_CONFIG.ROLES[roleKey].name}`);
}

function selectMode(modeKey) {
    // Remover selección anterior
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar nuevo modo
    const selectedCard = document.querySelector(`[data-mode="${modeKey}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    gameState.selectedMode = modeKey;
    gameState.gameMode = GAME_CONFIG.MODES[modeKey];
    
    console.log(`🎮 Modo seleccionado: ${GAME_CONFIG.MODES[modeKey].name}`);
}

function updateRoleDisplay() {
    if (gameState.selectedRole) {
        const role = GAME_CONFIG.ROLES[gameState.selectedRole];
        gameState.elements.roleName.textContent = role.name;
        gameState.elements.roleIcon.textContent = role.name.charAt(0);
        gameState.elements.roleIcon.style.background = `linear-gradient(45deg, ${role.color}, #4ECDC4)`;
    }
}

function handleStartButton() {
    if (!gameState.selectedRole) {
        showNotification('¡Por favor selecciona un rol primero!');
        return;
    }
    
    // Si no hay modo seleccionado, mostrar selector de modos
    if (!gameState.selectedMode) {
        showModeSelector();
    } else {
        // Iniciar juego directamente
        startGame();
    }
}

function showModeSelector() {
    gameState.elements.titleScreen.style.display = 'none';
    gameState.elements.modeSelector.style.display = 'block';
}

// ============================================
// INICIO DEL JUEGO
// ============================================

function startGame() {
    console.log('🚀 Iniciando juego...');
    
    // Validaciones
    if (!gameState.selectedRole || !gameState.selectedMode) {
        showNotification('¡Por favor selecciona un rol y modo!');
        return;
    }
    
    // Ocultar pantallas
    gameState.elements.titleScreen.style.display = 'none';
    gameState.elements.modeSelector.style.display = 'none';
    
    // Resetear estado del juego
    resetGameState();
    
    // Configurar modo de juego
    setupGameMode();
    
    // Inicializar entidades
    initializeEntities();
    
    // Iniciar bucles del juego
    gameState.gameRunning = true;
    gameState.startTime = Date.now();
    
    // Actualizar UI
    updateGameUI();
    
    // Iniciar timer si es necesario
    if (gameState.gameMode.duration) {
        startGameTimer();
    }
    
    // Iniciar bucles principales
    startGameLoops();
    
    console.log('✅ Juego iniciado correctamente');
}

function resetGameState() {
    // Resetear arrays
    gameState.foods = [];
    gameState.enemies = [];
    gameState.particles = [];
    gameState.trails = [];
    
    // Resetear estadísticas
    gameState.score = 0;
    gameState.foodEaten = 0;
    gameState.enemiesDefeated = 0;
    gameState.playTime = 0;
    
    // Resetear tiempo
    gameState.timeLeft = gameState.gameMode ? gameState.gameMode.duration : null;
    
    // Resetear flags
    gameState.gameRunning = false;
    gameState.isPaused = false;
    gameState.gameEnded = false;
    
    // Limpiar canvas
    if (gameState.elements.gameCanvas) {
        gameState.elements.gameCanvas.innerHTML = '';
    }
}

function setupGameMode() {
    gameState.gameMode = GAME_CONFIG.MODES[gameState.selectedMode];
}

function initializeEntities() {
    // Inicializar jugador
    initializePlayer();
    
    // Generar entidades del juego
    generateFood(gameState.gameMode.foodCount);
    generateEnemies(gameState.gameMode.enemyCount);
    
    // Crear elementos visuales de fondo
    createBackgroundElements();
}

function initializePlayer() {
    const role = GAME_CONFIG.ROLES[gameState.selectedRole];
    gameState.player = {
        x: GAME_CONFIG.CANVAS_WIDTH / 2,
        y: GAME_CONFIG.CANVAS_HEIGHT / 2,
        targetX: GAME_CONFIG.CANVAS_WIDTH / 2,
        targetY: GAME_CONFIG.CANVAS_HEIGHT / 2,
        size: role.size,
        speed: role.speed,
        color: role.color,
        role: gameState.selectedRole,
        mass: role.size * role.size / 4,
        health: 100,
        lastTrailTime: 0,
        trailInterval: GAME_CONFIG.TRAIL_INTERVAL,
        specialCooldown: 0,
        specialActive: false,
        invisibilityTimer: 0,
        regenerationRate: role.healer ? 0.5 : 0
    };
}

function generateFood(count) {
    console.log(`🍎 Generando ${count} items de comida`);
    
    for (let i = 0; i < count; i++) {
        gameState.foods.push({
            x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 40) + 20,
            y: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 40) + 20,
            size: Math.random() * GAME_CONFIG.MAX_FOOD_SIZE + 3,
            color: getRandomColor(),
            pulseTime: Math.random() * 2,
            value: Math.floor(Math.random() * 10) + 5
        });
    }
}

function generateEnemies(count) {
    console.log(`👾 Generando ${count} enemigos`);
    
    const roles = Object.keys(GAME_CONFIG.ROLES);
    
    for (let i = 0; i < count; i++) {
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        const role = GAME_CONFIG.ROLES[randomRole];
        
        gameState.enemies.push({
            x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 100) + 50,
            y: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 100) + 50,
            size: role.size + Math.random() * 20 - 10,
            speed: role.speed * (0.8 + Math.random() * 0.4),
            color: role.color,
            role: randomRole,
            mass: (role.size + Math.random() * 20 - 10) ** 2 / 4,
            directionX: (Math.random() - 0.5) * 2,
            directionY: (Math.random() - 0.5) * 2,
            lastTrailTime: 0,
            behavior: getEnemyBehavior(),
            target: null,
            aggroTimer: Math.random() * 3000,
            wanderTimer: 0
        });
    }
}

function getEnemyBehavior() {
    const behaviors = ['random', 'aggressive', 'food_seeker', 'territorial'];
    return behaviors[Math.floor(Math.random() * behaviors.length)];
}

function createBackgroundElements() {
    createStarfield();
    createFloatingParticles();
}

function createStarfield() {
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.left = Math.random() * GAME_CONFIG.CANVAS_WIDTH + 'px';
        star.style.top = Math.random() * GAME_CONFIG.CANVAS_HEIGHT + 'px';
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.borderRadius = '50%';
        star.style.animation = `twinkle ${3 + Math.random() * 2}s ease-in-out infinite`;
        star.style.zIndex = '1';
        gameState.elements.gameCanvas.appendChild(star);
    }
}

function createFloatingParticles() {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * GAME_CONFIG.CANVAS_WIDTH + 'px';
        particle.style.top = Math.random() * GAME_CONFIG.CANVAS_HEIGHT + 'px';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        gameState.elements.gameCanvas.appendChild(particle);
    }
}

// ============================================
// BUCLES PRINCIPALES DEL JUEGO
// ============================================

function startGameLoops() {
    // Game loop principal
    function gameLoop(currentTime) {
        if (!gameState.gameRunning) return;
        
        // Calcular FPS
        calculateFPS(currentTime);
        
        // Actualizar juego
        update(currentTime);
        
        // Renderizar juego
        render();
        
        // Continuar bucle
        requestAnimationFrame(gameLoop);
    }
    
    // Iniciar bucle
    requestAnimationFrame(gameLoop);
}

function calculateFPS(currentTime) {
    gameState.frameCount++;
    gameState.performanceTimer += currentTime - gameState.lastFrameTime;
    
    if (gameState.performanceTimer >= 1000) {
        gameState.fps = Math.round((gameState.frameCount * 1000) / gameState.performanceTimer);
        gameState.frameCount = 0;
        gameState.performanceTimer = 0;
    }
    
    gameState.lastFrameTime = currentTime;
}

function update(currentTime) {
    if (!gameState.player || gameState.isPaused) return;
    
    const deltaTime = currentTime - (gameState.lastUpdateTime || currentTime);
    gameState.lastUpdateTime = currentTime;
    
    // Actualizar jugador
    updatePlayer(currentTime, deltaTime);
    
    // Actualizar enemigos
    updateEnemies(currentTime, deltaTime);
    
    // Actualizar partículas
    updateParticles(deltaTime);
    
    // Actualizar trails
    updateTrails(deltaTime);
    
    // Verificar colisiones
    checkCollisions();
    
    // Verificar condiciones de fin de juego
    checkGameEndConditions();
    
    // Actualizar tiempo de juego
    updateGameTime();
}

function updatePlayer(currentTime, deltaTime) {
    const player = gameState.player;
    
    // Movimiento suave hacia objetivo
    const dx = player.targetX - player.x;
    const dy = player.targetY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
        const moveSpeed = player.speed * (deltaTime / 16.67); // Normalizar por 60fps
        player.x += (dx / distance) * moveSpeed;
        player.y += (dy / distance) * moveSpeed;
    }
    
    // Crear trail
    if (currentTime - player.lastTrailTime > player.trailInterval) {
        createTrail(player.x, player.y, player.color, player.size, 0.6);
        player.lastTrailTime = currentTime;
    }
    
    // Habilidades especiales
    updatePlayerAbilities(currentTime, deltaTime);
    
    // Regeneración para healers
    if (player.role === 'healer' && player.mass > player.size * player.size / 4) {
        player.mass = Math.min(player.mass + player.regenerationRate, player.size * player.size * 4);
    }
    
    // Mantener dentro de límites
    player.x = Math.max(player.size / 2, Math.min(GAME_CONFIG.CANVAS_WIDTH - player.size / 2, player.x));
    player.y = Math.max(player.size / 2, Math.min(GAME_CONFIG.CANVAS_HEIGHT - player.size / 2, player.y));
    
    // Actualizar tamaño basado en masa
    player.size = Math.sqrt(player.mass) * 2;
}

function updatePlayerAbilities(currentTime, deltaTime) {
    const player = gameState.player;
    
    // Reducir cooldown de habilidades
    player.specialCooldown = Math.max(0, player.specialCooldown - deltaTime);
    
    // Activar invisibilidad para stealth
    if (player.role === 'stealth') {
        if (player.specialActive) {
            player.invisibilityTimer -= deltaTime;
            if (player.invisibilityTimer <= 0) {
                player.specialActive = false;
                // Restaurar visibilidad
                if (gameState.elements.gameCanvas.contains(player.element)) {
                    player.element.style.opacity = '1';
                }
            }
        }
        
        // Usar invisibilidad si está disponible
        if (player.specialCooldown <= 0 && !player.specialActive) {
            // 30% de probabilidad de activar por segundo
            if (Math.random() < 0.008) { // 0.008 = 0.8% por frame a 60fps
                player.specialActive = true;
                player.invisibilityTimer = 3000; // 3 segundos
                player.specialCooldown = 10000; // 10 segundos cooldown
                
                if (gameState.elements.gameCanvas.contains(player.element)) {
                    player.element.style.opacity = '0.3';
                }
            }
        }
    }
}

function updateEnemies(currentTime, deltaTime) {
    gameState.enemies.forEach((enemy, index) => {
        // Actualizar comportamiento del enemigo
        updateEnemyBehavior(enemy, currentTime, deltaTime);
        
        // Movimiento del enemigo
        enemy.x += enemy.directionX * enemy.speed * (deltaTime / 16.67);
        enemy.y += enemy.directionY * enemy.speed * (deltaTime / 16.67);
        
        // Crear trail
        if (currentTime - enemy.lastTrailTime > enemy.trailInterval) {
            createTrail(enemy.x, enemy.y, enemy.color, enemy.size, 0.3);
            enemy.lastTrailTime = currentTime;
        }
        
        // Límites del mapa con rebote suave
        if (enemy.x < 0) { 
            enemy.x = 0; 
            enemy.directionX = Math.abs(enemy.directionX); 
        }
        if (enemy.x > GAME_CONFIG.CANVAS_WIDTH) { 
            enemy.x = GAME_CONFIG.CANVAS_WIDTH; 
            enemy.directionX = -Math.abs(enemy.directionX); 
        }
        if (enemy.y < 0) { 
            enemy.y = 0; 
            enemy.directionY = Math.abs(enemy.directionY); 
        }
        if (enemy.y > GAME_CONFIG.CANVAS_HEIGHT) { 
            enemy.y = GAME_CONFIG.CANVAS_HEIGHT; 
            enemy.directionY = -Math.abs(enemy.directionY); 
        }
    });
}

function updateEnemyBehavior(enemy, currentTime, deltaTime) {
    enemy.aggroTimer -= deltaTime;
    enemy.wanderTimer -= deltaTime;
    
    switch (enemy.behavior) {
        case 'aggressive':
            if (gameState.player && enemy.aggroTimer <= 0) {
                // Perseguir al jugador
                const dx = gameState.player.x - enemy.x;
                const dy = gameState.player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 300) {
                    enemy.directionX = dx / distance;
                    enemy.directionY = dy / distance;
                    enemy.aggroTimer = 2000; // 2 segundos de aggro
                } else {
                    // Cambiar a modo wander
                    enemy.behavior = 'random';
                }
            }
            break;
            
        case 'food_seeker':
            // Buscar comida cercana
            const nearbyFood = findNearestFood(enemy.x, enemy.y);
            if (nearbyFood) {
                const dx = nearbyFood.x - enemy.x;
                const dy = nearbyFood.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    enemy.directionX = dx / distance;
                    enemy.directionY = dy / distance;
                }
            } else {
                enemy.behavior = 'random';
            }
            break;
            
        case 'random':
        default:
            if (enemy.wanderTimer <= 0) {
                // Cambiar dirección aleatoriamente
                enemy.directionX = (Math.random() - 0.5) * 2;
                enemy.directionY = (Math.random() - 0.5) * 2;
                enemy.wanderTimer = 2000 + Math.random() * 3000; // 2-5 segundos
            }
            break;
    }
}

function findNearestFood(x, y) {
    let nearestFood = null;
    let nearestDistance = Infinity;
    
    gameState.foods.forEach(food => {
        const dx = food.x - x;
        const dy = food.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestFood = food;
        }
    });
    
    return nearestFood;
}

function updateParticles(deltaTime) {
    gameState.particles.forEach((particle, index) => {
        particle.life -= deltaTime / 1000; // Convertir a segundos
        particle.x += particle.vx * (deltaTime / 16.67);
        particle.y += particle.vy * (deltaTime / 16.67);
        
        if (particle.life <= 0) {
            gameState.particles.splice(index, 1);
        }
    });
    
    // Limitar número de partículas
    if (gameState.particles.length > GAME_CONFIG.MAX_PARTICLES) {
        gameState.particles.splice(0, gameState.particles.length - GAME_CONFIG.MAX_PARTICLES);
    }
}

function updateTrails(deltaTime) {
    gameState.trails.forEach((trail, index) => {
        trail.life -= deltaTime / 500; // Decay más rápido para trails
        
        if (trail.life <= 0) {
            gameState.trails.splice(index, 1);
        }
    });
    
    // Limitar número de trails
    if (gameState.trails.length > GAME_CONFIG.MAX_TRAILS) {
        gameState.trails.splice(0, gameState.trails.length - GAME_CONFIG.MAX_TRAILS);
    }
}

function updateGameTime() {
    const currentTime = Date.now();
    gameState.playTime = Math.floor((currentTime - gameState.startTime) / 1000);
    
    if (gameState.gameMode.duration && gameState.timeLeft !== null) {
        gameState.timeLeft = Math.max(0, gameState.gameMode.duration - gameState.playTime);
    }
}

function checkGameEndConditions() {
    // Verificar si el tiempo se agotó (modo timed)
    if (gameState.gameMode.duration && gameState.timeLeft <= 0) {
        endGame('time');
        return;
    }
    
    // Verificar si el jugador fue derrotado
    if (gameState.player && gameState.player.health <= 0) {
        endGame('defeat');
        return;
    }
    
    // Verificar si el jugador es demasiado pequeño (condición de pérdida)
    if (gameState.player && gameState.player.size < 8) {
        endGame('too_small');
        return;
    }
}

// ============================================
// SISTEMA DE COLISIONES
// ============================================

function checkCollisions() {
    if (!gameState.player) return;
    
    checkFoodCollisions();
    checkEnemyCollisions();
}

function checkFoodCollisions() {
    const player = gameState.player;
    
    for (let i = gameState.foods.length - 1; i >= 0; i--) {
        const food = gameState.foods[i];
        const dx = food.x - player.x;
        const dy = food.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.size / 2 + food.size / 2) {
            // Comer comida
            player.mass += food.value;
            gameState.score += food.value * 2;
            gameState.foodEaten++;
            
            // Crear efectos visuales
            createFoodParticles(food.x, food.y, food.color);
            
            // Remover comida
            gameState.foods.splice(i, 1);
            
            // Regenerar nueva comida
            setTimeout(() => {
                generateSingleFood();
            }, 100);
        }
    }
    
    // Actualizar UI
    gameState.elements.scoreValue.textContent = gameState.score.toLocaleString();
}

function checkEnemyCollisions() {
    const player = gameState.player;
    
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.size / 2 + enemy.size / 2) {
            // Verificar quién puede comer a quién
            if (player.size > enemy.size * 1.3) {
                // Jugador come enemigo
                player.mass += enemy.mass * 0.8;
                gameState.score += Math.floor(enemy.size * 15);
                gameState.enemiesDefeated++;
                
                createEnemyParticles(enemy.x, enemy.y, enemy.color);
                gameState.enemies.splice(i, 1);
                
                // Regenerar enemigo después de delay
                setTimeout(() => {
                    generateSingleEnemy();
                }, 2000 + Math.random() * 3000);
                
            } else if (enemy.size > player.size * 1.3) {
                // Enemigo come jugador
                if (player.role !== 'stealth' || !player.specialActive) {
                    endGame('defeat');
                    return;
                }
            } else {
                // Tamaños similares, rebotar
                const angle = Math.atan2(dy, dx);
                player.x -= Math.cos(angle) * 10;
                player.y -= Math.sin(angle) * 10;
                enemy.x += Math.cos(angle) * 10;
                enemy.y += Math.sin(angle) * 10;
            }
        }
    }
}

// ============================================
// RENDERIZADO
// ============================================

function render() {
    // Limpiar canvas
    gameState.elements.gameCanvas.innerHTML = '';
    
    // Renderizar en orden de profundidad
    renderTrails();
    renderFoods();
    renderEnemies();
    renderPlayer();
    renderParticles();
}

function renderFoods() {
    gameState.foods.forEach(food => {
        // Efecto de pulsación
        food.pulseTime += 0.1;
        const pulse = Math.sin(food.pulseTime) * 0.2 + 0.8;
        const size = food.size * pulse;
        
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.position = 'absolute';
        foodElement.style.left = (food.x - size / 2) + 'px';
        foodElement.style.top = (food.y - size / 2) + 'px';
        foodElement.style.width = size + 'px';
        foodElement.style.height = size + 'px';
        foodElement.style.backgroundColor = food.color;
        foodElement.style.borderRadius = '50%';
        foodElement.style.boxShadow = `0 0 ${size/2}px ${food.color}`;
        foodElement.style.zIndex = '3';
        
        gameState.elements.gameCanvas.appendChild(foodElement);
    });
}

function renderEnemies() {
    gameState.enemies.forEach(enemy => {
        const enemyElement = document.createElement('div');
        enemyElement.className = 'cell';
        enemyElement.style.position = 'absolute';
        enemyElement.style.left = (enemy.x - enemy.size / 2) + 'px';
        enemyElement.style.top = (enemy.y - enemy.size / 2) + 'px';
        enemyElement.style.width = enemy.size + 'px';
        enemyElement.style.height = enemy.size + 'px';
        enemyElement.style.backgroundColor = enemy.color;
        enemyElement.style.boxShadow = `0 0 ${enemy.size/3}px ${enemy.color}`;
        enemyElement.style.zIndex = '4';
        enemyElement.textContent = enemy.role.charAt(0).toUpperCase();
        
        gameState.elements.gameCanvas.appendChild(enemyElement);
    });
}

function renderPlayer() {
    if (!gameState.player) return;
    
    const player = gameState.player;
    const playerElement = document.createElement('div');
    playerElement.className = 'cell';
    playerElement.style.position = 'absolute';
    playerElement.style.left = (player.x - player.size / 2) + 'px';
    playerElement.style.top = (player.y - player.size / 2) + 'px';
    playerElement.style.width = player.size + 'px';
    playerElement.style.height = player.size + 'px';
    playerElement.style.backgroundColor = player.color;
    playerElement.style.boxShadow = `0 0 ${player.size/2}px ${player.color}`;
    playerElement.style.zIndex = '5';
    playerElement.textContent = player.role.charAt(0).toUpperCase();
    
    // Efectos especiales
    if (player.role === 'stealth' && player.specialActive) {
        playerElement.style.opacity = '0.3';
        playerElement.style.filter = 'blur(1px)';
    }
    
    // Guardar referencia para efectos posteriores
    player.element = playerElement;
    
    gameState.elements.gameCanvas.appendChild(playerElement);
}

function renderTrails() {
    gameState.trails.forEach(trail => {
        const trailElement = document.createElement('div');
        trailElement.className = 'trail';
        trailElement.style.position = 'absolute';
        trailElement.style.left = (trail.x - trail.size / 2) + 'px';
        trailElement.style.top = (trail.y - trail.size / 2) + 'px';
        trailElement.style.width = trail.size + 'px';
        trailElement.style.height = trail.size + 'px';
        trailElement.style.backgroundColor = trail.color;
        trailElement.style.opacity = trail.life;
        trailElement.style.zIndex = '2';
        
        gameState.elements.gameCanvas.appendChild(trailElement);
    });
}

function renderParticles() {
    gameState.particles.forEach(particle => {
        const particleElement = document.createElement('div');
        particleElement.className = 'particle';
        particleElement.style.position = 'absolute';
        particleElement.style.left = particle.x + 'px';
        particleElement.style.top = particle.y + 'px';
        particleElement.style.width = particle.size + 'px';
        particleElement.style.height = particle.size + 'px';
        particleElement.style.backgroundColor = particle.color;
        particleElement.style.opacity = particle.life;
        particleElement.style.zIndex = '6';
        
        gameState.elements.gameCanvas.appendChild(particleElement);
    });
}

// ============================================
// CONTROLES Y INPUT
// ============================================

function setupCanvasControls() {
    // Controles de mouse
    gameState.elements.gameCanvas.addEventListener('mousemove', (e) => {
        if (!gameState.gameRunning || gameState.virtualJoystick.active) return;
        
        const rect = gameState.elements.gameCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        updatePlayerTarget(mouseX, mouseY);
    });
    
    // Click para dividir
    gameState.elements.gameCanvas.addEventListener('click', () => {
        if (!gameState.gameRunning) return;
        splitPlayer();
    });
    
    // Controles táctiles
    if (gameState.hasTouch) {
        gameState.elements.gameCanvas.addEventListener('touchstart', handleTouchStart);
        gameState.elements.gameCanvas.addEventListener('touchmove', handleTouchMove);
        gameState.elements.gameCanvas.addEventListener('touchend', handleTouchEnd);
    }
}

function setupTouchControls() {
    // Prevenir comportamientos por defecto
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.action-btn')) {
            e.preventDefault();
        }
    }, { passive: false });
}

function setupVirtualJoystick() {
    const joystick = gameState.elements.virtualJoystick;
    const handle = gameState.elements.joystickHandle;
    
    joystick.addEventListener('touchstart', joystickStart);
    joystick.addEventListener('touchmove', joystickMove);
    joystick.addEventListener('touchend', joystickEnd);
}

function setupMobileControls() {
    // Botón de dividir
    gameState.elements.splitBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState.gameRunning) splitPlayer();
    });
    
    // Botón de ejectar masa
    gameState.elements.ejectBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState.gameRunning) ejectMass();
    });
    
    // Botón de pausa
    gameState.elements.pauseBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState.gameRunning) togglePause();
    });
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (gameState.gameRunning) ejectMass();
                break;
            case 'Escape':
                e.preventDefault();
                if (gameState.gameRunning) togglePause();
                break;
            case 'KeyR':
                if (e.ctrlKey) {
                    e.preventDefault();
                    restartGame();
                }
                break;
        }
    });
}

// Funciones de manejo de entrada
function updatePlayerTarget(x, y) {
    if (gameState.player) {
        gameState.player.targetX = x;
        gameState.player.targetY = y;
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const rect = gameState.elements.gameCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    updatePlayerTarget(touchX, touchY);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!e.touches.length) return;
    
    const rect = gameState.elements.gameCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    updatePlayerTarget(touchX, touchY);
}

function handleTouchEnd(e) {
    e.preventDefault();
}

function joystickStart(e) {
    e.preventDefault();
    gameState.virtualJoystick.active = true;
}

function joystickMove(e) {
    e.preventDefault();
    if (!gameState.virtualJoystick.active) return;
    
    const rect = gameState.elements.virtualJoystick.getBoundingClientRect();
    const touch = e.touches[0];
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2 - 20; // Margen para el handle
    
    if (distance <= maxDistance) {
        // Dentro del círculo
        gameState.elements.joystickHandle.style.left = (rect.width / 2 + deltaX - 20) + 'px';
        gameState.elements.joystickHandle.style.top = (rect.height / 2 + deltaY - 20) + 'px';
        
        if (gameState.player) {
            const normalizedX = deltaX / maxDistance;
            const normalizedY = deltaY / maxDistance;
            const range = 100; // Rango de movimiento
            
            gameState.player.targetX = gameState.player.x + normalizedX * range;
            gameState.player.targetY = gameState.player.y + normalizedY * range;
        }
    }
}

function joystickEnd(e) {
    e.preventDefault();
    gameState.virtualJoystick.active = false;
    gameState.elements.joystickHandle.style.left = '50%';
    gameState.elements.joystickHandle.style.top = '50%';
    gameState.elements.joystickHandle.style.transform = 'translate(-50%, -50%)';
}

// ============================================
// ACCIONES DEL JUEGO
// ============================================

function splitPlayer() {
    const player = gameState.player;
    const role = GAME_CONFIG.ROLES[player.role];
    
    if (player.mass > role.splitCost * 4 && player.size < 80) {
        player.mass /= 2;
        createExplosion(player.x, player.y, player.color);
        
        // Efecto visual temporal
        gameState.player.targetX += (Math.random() - 0.5) * 50;
        gameState.player.targetY += (Math.random() - 0.5) * 50;
    }
}

function ejectMass() {
    const player = gameState.player;
    
    if (player.mass > 20) {
        player.mass -= 10;
        createExplosion(player.x, player.y, player.color);
        
        // Crear comida temporal
        createTempFood(player.x, player.y, player.color);
    }
}

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        showNotification('JUEGO PAUSADO');
    } else {
        hideNotification();
    }
}

function createTempFood(x, y, color) {
    gameState.foods.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        size: 8,
        color: color,
        pulseTime: 0,
        value: 8,
        temporary: true,
        lifetime: 5000 // 5 segundos
    });
}

// ============================================
// EFECTOS VISUALES
// ============================================

function createTrail(x, y, color, size, opacity = 0.6) {
    gameState.trails.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        size: size * 0.7,
        color: color,
        life: opacity
    });
}

function createParticles(x, y, color, count = GAME_CONFIG.PARTICLE_COUNT) {
    for (let i = 0; i < count; i++) {
        gameState.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            color: color,
            size: Math.random() * 4 + 2,
            life: 1
        });
    }
}

function createFoodParticles(x, y, color) {
    createParticles(x, y, color, 8);
}

function createEnemyParticles(x, y, color) {
    createParticles(x, y, color, 15);
}

function createExplosion(x, y, color) {
    createParticles(x, y, color, 20);
    
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.position = 'absolute';
    explosion.style.left = (x - 10) + 'px';
    explosion.style.top = (y - 10) + 'px';
    explosion.style.width = '20px';
    explosion.style.height = '20px';
    explosion.style.backgroundColor = color;
    explosion.style.zIndex = '7';
    
    gameState.elements.gameCanvas.appendChild(explosion);
    
    setTimeout(() => {
        if (explosion.parentNode) {
            explosion.parentNode.removeChild(explosion);
        }
    }, 800);
}

// ============================================
// GENERACIÓN DE ENTIDADES
// ============================================

function generateSingleFood() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    
    gameState.foods.push({
        x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 40) + 20,
        y: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 40) + 20,
        size: Math.random() * GAME_CONFIG.MAX_FOOD_SIZE + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseTime: Math.random() * 2,
        value: Math.floor(Math.random() * 10) + 5
    });
}

function generateSingleEnemy() {
    const roles = Object.keys(GAME_CONFIG.ROLES);
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const role = GAME_CONFIG.ROLES[randomRole];
    
    gameState.enemies.push({
        x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 100) + 50,
        y: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 100) + 50,
        size: role.size + Math.random() * 20 - 10,
        speed: role.speed * (0.8 + Math.random() * 0.4),
        color: role.color,
        role: randomRole,
        mass: (role.size + Math.random() * 20 - 10) ** 2 / 4,
        directionX: (Math.random() - 0.5) * 2,
        directionY: (Math.random() - 0.5) * 2,
        lastTrailTime: 0,
        behavior: getEnemyBehavior(),
        target: null,
        aggroTimer: Math.random() * 3000,
        wanderTimer: 0
    });
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ============================================
// UI Y NOTIFICACIONES
// ============================================

function updateGameUI() {
    gameState.elements.scoreValue.textContent = gameState.score.toLocaleString();
    
    if (gameState.gameMode.duration) {
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    if (gameState.timeLeft !== null) {
        const minutes = Math.floor(gameState.timeLeft / 60);
        const seconds = gameState.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        gameState.elements.timeLeft.textContent = timeString;
    }
}

function startGameTimer() {
    const timer = setInterval(() => {
        if (!gameState.gameRunning || gameState.isPaused) {
            clearInterval(timer);
            return;
        }
        
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(timer);
            endGame('time');
        }
    }, 1000);
}

function showLoadingScreen() {
    const loadingScreen = gameState.elements.loadingScreen;
    const progressBar = gameState.elements.progressBar;
    
    loadingScreen.style.display = 'flex';
    
    // Simular carga
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        progressBar.style.width = progress + '%';
    }, 200);
}

function showNotification(message, duration = 2000) {
    // Crear elemento de notificación si no existe
    let notification = document.getElementById('game-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'game-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 2px solid #4ECDC4;
            box-shadow: 0 0 30px rgba(78, 205, 196, 0.5);
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        hideNotification();
    }, duration);
}

function hideNotification() {
    const notification = document.getElementById('game-notification');
    if (notification) {
        notification.style.display = 'none';
    }
}

// ============================================
// FIN DEL JUEGO
// ============================================

function endGame(reason) {
    console.log('🎮 Fin del juego:', reason);
    
    gameState.gameRunning = false;
    gameState.gameEnded = true;
    
    // Calcular estadísticas finales
    const finalStats = calculateFinalStats();
    
    // Mostrar pantalla de fin de juego
    showGameOverScreen(reason, finalStats);
}

function calculateFinalStats() {
    const currentTime = Date.now();
    const playTimeSeconds = Math.floor((currentTime - gameState.startTime) / 1000);
    const playTimeMinutes = Math.floor(playTimeSeconds / 60);
    const remainingSeconds = playTimeSeconds % 60;
    
    return {
        score: gameState.score,
        playTime: `${playTimeMinutes}:${remainingSeconds.toString().padStart(2, '0')}`,
        foodEaten: gameState.foodEaten,
        enemiesDefeated: gameState.enemiesDefeated,
        fps: gameState.fps
    };
}

function showGameOverScreen(reason, stats) {
    const screen = gameState.elements.gameOverScreen;
    const title = document.getElementById('gameOverTitle');
    
    // Configurar título según el motivo
    const titles = {
        'time': '¡TIEMPO AGOTADO!',
        'defeat': '¡DERROTADO!',
        'too_small': '¡DEMASIADO PEQUEÑO!',
        'paused': 'JUEGO PAUSADO'
    };
    
    title.textContent = titles[reason] || 'JUEGO TERMINADO';
    
    // Actualizar estadísticas
    gameState.elements.finalScore.textContent = stats.score.toLocaleString();
    gameState.elements.playTime.textContent = stats.playTime;
    gameState.elements.foodEaten.textContent = stats.foodEaten;
    gameState.elements.enemiesDefeated.textContent = stats.enemiesDefeated;
    
    // Mostrar pantalla
    screen.style.display = 'flex';
}

function restartGame() {
    console.log('🔄 Reiniciando juego...');
    
    // Ocultar pantalla de fin de juego
    gameState.elements.gameOverScreen.style.display = 'none';
    
    // Resetear selecciones pero mantener último rol/modo
    const lastRole = gameState.selectedRole;
    const lastMode = gameState.selectedMode;
    
    // Reiniciar completamente
    resetGameState();
    gameState.selectedRole = lastRole;
    gameState.selectedMode = lastMode;
    
    // Iniciar nuevo juego
    startGame();
}

function goToMenu() {
    console.log('🏠 Volviendo al menú principal...');
    
    // Ocultar todas las pantallas
    gameState.elements.gameOverScreen.style.display = 'none';
    gameState.elements.modeSelector.style.display = 'none';
    gameState.elements.titleScreen.style.display = 'flex';
    
    // Limpiar canvas
    gameState.elements.gameCanvas.innerHTML = '';
    
    // Resetear estado
    resetGameState();
    
    // Remover selecciones
    gameState.selectedRole = null;
    gameState.selectedMode = null;
    
    // Actualizar UI
    updateRoleDisplay();
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleResize() {
    // Actualizar dimensiones del canvas
    GAME_CONFIG.CANVAS_WIDTH = window.innerWidth;
    GAME_CONFIG.CANVAS_HEIGHT = window.innerHeight;
    
    console.log('📱 Ventana redimensionada:', GAME_CONFIG.CANVAS_WIDTH, 'x', GAME_CONFIG.CANVAS_HEIGHT);
}

function handleVisibilityChange() {
    if (document.hidden && gameState.gameRunning) {
        // Pausar cuando la página no está visible
        gameState.isPaused = true;
        console.log('⏸️ Juego pausado (página oculta)');
    } else if (!document.hidden && gameState.gameRunning) {
        // Reanudar cuando la página vuelve a estar visible
        gameState.isPaused = false;
        console.log('▶️ Juego reanudado (página visible)');
    }
}

function initializeVisualElements() {
    // Crear estilos CSS dinámicos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        @keyframes glow {
            from { filter: drop-shadow(0 0 5px rgba(78, 205, 196, 0.3)); }
            to { filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.8)); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// UTILIDADES GLOBALES
// ============================================

// Función global para reiniciar desde la pantalla de fin de juego
window.restartGame = restartGame;
window.goToMenu = goToMenu;

// Debug helpers (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.gameState = gameState;
    window.GAME_CONFIG = GAME_CONFIG;
    
    console.log('🛠️ Modo desarrollo activado. Variables globales disponibles: gameState, GAME_CONFIG');
}

console.log('✅ Game.js cargado correctamente');
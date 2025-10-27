const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

// Set display size (CSS pixels)
canvas.style.width = '1024px';
canvas.style.height = '576px';

canvas.width = 1024 * dpr;
canvas.height = 576 * dpr;

c.scale(dpr, dpr);
const skyLayerData = {
  l_Sky: l_Sky,
};

const mountLayerData = {
  l_Mountains: l_Mountains,
};

const layersData = {
  l_Decorations: l_Decorations,
  l_underground_tiles: l_underground_tiles,
  l_Soil: l_Soil,
  l_dec: l_dec,
  l_front_tiles: l_front_tiles,
  l_rewards: l_rewards.map((row) =>
    row.map((tile) =>
      // Remove carrot tiles (2, 5, 10-18) from the static rendering
      tile === 2 || tile === 5 || (tile >= 10 && tile <= 18) ? 0 : tile,
    ),
  ),
  l_Collisions: l_Collisions,
  l_coins: l_coins.map((row) => row.map((tile) => (tile >= 10 && tile <= 18 ? 0 : tile))),
};

const tilesets = {
  l_Sky: { imageUrl: './images/33b1ce4e-3777-479a-66b6-2d2d84adc800.png', tileSize: 16 },
  l_Mountains: { imageUrl: './images/22a9dc18-ed50-4d1d-9d19-10da8baf9700.png', tileSize: 16 },
  l_Decorations: { imageUrl: './images/a5a7e419-b7be-4b41-8bee-6b3b399bde00.png', tileSize: 16 },
  l_underground_tiles: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_Soil: { imageUrl: './images/1c8bb550-1433-4458-2fa9-6e9805914700.png', tileSize: 16 },
  l_dec: { imageUrl: './images/8f38b75e-3915-4146-2c06-52b28210e400.png', tileSize: 16 },
  l_front_tiles: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_rewards: { imageUrl: './images/7e2e3c22-9b0f-41e7-d384-57264cf2c700.png', tileSize: 16 },
  l_Collisions: { imageUrl: './images/7e2e3c22-9b0f-41e7-d384-57264cf2c700.png', tileSize: 16 },
  l_coins: { imageUrl: './images/7e2e3c22-9b0f-41e7-d384-57264cf2c700.png', tileSize: 16 },
};

// Carrot Class
class Carrot {
  constructor({ x, y, size = 16 }) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.collected = false;
    this.isImageLoaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.isImageLoaded = true;
    };
    this.image.src = './images/7e2e3c22-9b0f-41e7-d384-57264cf2c700.png';
  }

  draw(c) {
    if (!this.collected && this.isImageLoaded) {
      // Draw carrot (tile 2 from rewards tileset)
      c.drawImage(
        this.image,
        16,
        0, // source x, y - position of carrot in tileset
        15,
        32, // source width, height
        this.x,
        this.y, // destination x, y
        this.width,
        this.height, // destination width, height
      );
    }
  }

  checkCollision(player) {
    if (this.collected) return false;

    return (
      player.hitbox.x < this.x + this.width &&
      player.hitbox.x + player.hitbox.width > this.x &&
      player.hitbox.y < this.y + this.height &&
      player.hitbox.y + player.hitbox.height > this.y
    );
  }

  collect() {
    this.collected = true;
  }
}

// Coin Class
class Coin {
  constructor({ x, y, size = 16 }) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.collected = false;
    this.isImageLoaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.isImageLoaded = true;
    };
    this.image.src = './images/coin.png';
  }

  draw(c) {
    if (!this.collected && this.isImageLoaded) {
      // Draw coin - using the entire coin image
      c.drawImage(
        this.image,
        0,
        0, // source x, y
        this.image.width,
        this.image.height, // use actual image dimensions
        this.x,
        this.y, // destination x, y
        this.width,
        this.height, // destination width, height
      );
    }
  }

  checkCollision(player) {
    if (this.collected) return false;
    return (
      player.hitbox.x < this.x + this.width &&
      player.hitbox.x + player.hitbox.width > this.x &&
      player.hitbox.y < this.y + this.height &&
      player.hitbox.y + player.hitbox.height > this.y
    );
  }
  collect() {
    this.collected = true;
  }
}

// Tile setup
const collisionBlocks = [];
const platforms = [];
const carrots = []; // Add carrots array
const coins = []; // Add coins array
const blockSize = 16; // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        }),
      );
    } else if (symbol === 2) {
      platforms.push(
        new Platform({
          x: x * blockSize,
          y: y * blockSize + blockSize,
          width: 16,
          height: 4,
        }),
      );
    }
  });
});

// Create carrots from the ORIGINAL l_rewards layer (not the filtered one)
l_rewards.forEach((row, y) => {
  row.forEach((symbol, x) => {
    // Carrots are represented by tile numbers 2, 5, and 10-18 in your map
    if (symbol === 5 || (symbol >= 10 && symbol <= 18)) {
      carrots.push(
        new Carrot({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        }),
      );
    }
  });
});

// Create coins from the ORIGINAL l_coins layer (not the filtered one)
const coinPositions = new Set(); // Track unique coin positions
l_coins.forEach((row, y) => {
  row.forEach((symbol, x) => {
    // Coins are represented by tile numbers 10-18 in your map
    // But these are animation frames, not separate coins
    if (symbol === 14) {
      const positionKey = `${x},${y}`;
      // Only create one coin per position, not one per animation frame
      if (!coinPositions.has(positionKey)) {
        coinPositions.add(positionKey);
        coins.push(
          new Coin({
            x: x * blockSize,
            y: y * blockSize,
            size: blockSize * 2,
          }),
        );
      }
    }
  });
});

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  // Calculate the number of tiles per row in the tileset
  // We use Math.ceil to ensure we get a whole number of tiles
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize);

  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        // Adjust index to be 0-based for calculations
        const tileIndex = symbol - 1;

        // Calculate source coordinates
        if (tileIndex >= 0) {
          const srcX = (tileIndex % tilesPerRow) * tileSize;
          const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize;
          if (srcX < tilesetImage.width && srcY < tilesetImage.height) {
            context.drawImage(
              tilesetImage, // source image
              srcX,
              srcY, // source x, y
              tileSize,
              tileSize, // source width, height
              x * 16,
              y * 16, // destination x, y
              16,
              16, // destination width, height
            );
          }
        }
      }
    });
  });
};

const renderStaticLayers = async (layersData) => {
  // Calculate game world size from level data
  const firstLayerKey = Object.keys(layersData)[0];
  const levelWidth = layersData[firstLayerKey][0].length * 16;
  const levelHeight = layersData[firstLayerKey].length * 16;

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = levelWidth;
  offscreenCanvas.height = levelHeight;
  const offscreenContext = offscreenCanvas.getContext('2d');

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName];
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl);
        renderLayer(tilesData, tilesetImage, tilesetInfo.tileSize, offscreenContext);
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error);
      }
    }
  }

  return offscreenCanvas;
};

// Change xy coordinates to move player's default position
const player = new Player({
  x: 100,
  y: 100,
  size: 32,
  velocity: { x: 0, y: 0 },
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
  x: { pressed: false },
};

let lastTime = performance.now();
const camera = {
  x: 0,
  y: 0,
};

const SCROLL_RIGHT = 500;
const SCROLL_TOP = 100;
const SCROLL_BOTTOM = 200;
let skyBackgroundCanvas = null;
let mountBackgroundCanvas = null;

// ========== GAME TIMER VARIABLES ==========
const GAME_DURATION = 120; // 2 minutes in seconds
let timeRemaining = GAME_DURATION;
let gameActive = true;
let timerInterval = null;

// ========== SCORE DISPLAY WITH IMAGES AND TIMER ==========
let carrotScore = 0;
let coinScore = 0;

// Create score container
const scoreContainer = document.createElement('div');
scoreContainer.id = 'score-container';

// Create timer item
const timerItem = document.createElement('div');
timerItem.className = 'score-item';
const timerIcon = document.createElement('div');
timerIcon.style.width = '24px';
timerIcon.style.height = '24px';
timerIcon.style.background = '#ff4444';
timerIcon.style.borderRadius = '50%';
timerIcon.style.display = 'flex';
timerIcon.style.alignItems = 'center';
timerIcon.style.justifyContent = 'center';
timerIcon.style.color = 'white';
timerIcon.style.fontSize = '12px';
timerIcon.style.fontWeight = 'bold';
const timerElement = document.createElement('span');
timerElement.id = 'timer';
timerElement.style.color = 'white';
timerElement.style.fontSize = '20px';
timerElement.style.fontWeight = 'bold';
timerElement.style.textShadow = '2px 2px 2px rgba(0,0,0,0.5)';
timerElement.style.minWidth = '60px';
timerElement.style.textAlign = 'center';
timerElement.textContent = '02:00';
timerItem.appendChild(timerIcon);
timerItem.appendChild(timerElement);

// Create carrot score item
const carrotItem = document.createElement('div');
carrotItem.className = 'score-item';
const carrotIcon = new Image();
carrotIcon.src = './images/carrot.png';
carrotIcon.style.width = '32px';
carrotIcon.style.height = '32px';
carrotIcon.style.imageRendering = 'pixelated';
carrotIcon.style.filter = 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))';
const carrotCountElement = document.createElement('span');
carrotCountElement.id = 'carrot-count';
carrotCountElement.style.color = 'white';
carrotCountElement.style.fontSize = '20px';
carrotCountElement.style.fontWeight = 'bold';
carrotCountElement.style.textShadow = '2px 2px 2px rgba(0,0,0,0.5)';
carrotCountElement.style.minWidth = '20px';
carrotCountElement.style.textAlign = 'center';
carrotCountElement.textContent = '0';
carrotItem.appendChild(carrotIcon);
carrotItem.appendChild(carrotCountElement);

// Create coin score item
const coinItem = document.createElement('div');
coinItem.className = 'score-item';
const coinIcon = new Image();
coinIcon.src = './images/coin.png';
coinIcon.style.width = '32px';
coinIcon.style.height = '32px';
coinIcon.style.imageRendering = 'pixelated';
coinIcon.style.filter = 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))';
const coinCountElement = document.createElement('span');
coinCountElement.id = 'coin-count';
coinCountElement.style.color = 'white';
coinCountElement.style.fontSize = '20px';
coinCountElement.style.fontWeight = 'bold';
coinCountElement.style.textShadow = '2px 2px 2px rgba(0,0,0,0.5)';
coinCountElement.style.minWidth = '20px';
coinCountElement.style.textAlign = 'center';
coinCountElement.textContent = '0';
coinItem.appendChild(coinIcon);
coinItem.appendChild(coinCountElement);

// Add items to container
scoreContainer.appendChild(timerItem);
scoreContainer.appendChild(carrotItem);
scoreContainer.appendChild(coinItem);
document.body.appendChild(scoreContainer);

// Mobile detection and score container adjustment
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent,
);
if (isMobile) {
  scoreContainer.style.top = '5px';
  scoreContainer.style.left = '5px';
  scoreContainer.style.gap = '10px';

  const scoreItems = scoreContainer.querySelectorAll('.score-item');
  scoreItems.forEach((item) => {
    item.style.padding = '6px 10px';
    item.style.borderRadius = '15px';
  });

  const scoreNumbers = scoreContainer.querySelectorAll('#carrot-count, #coin-count, #timer');
  scoreNumbers.forEach((el) => {
    el.style.fontSize = '16px';
  });

  const scoreIcons = scoreContainer.querySelectorAll('.score-item img');
  scoreIcons.forEach((img) => {
    img.style.width = '20px';
    img.style.height = '20px';
  });
}

// ========== TIMER FUNCTIONS ==========
function startTimer() {
  timerInterval = setInterval(() => {
    if (gameActive && timeRemaining > 0) {
      timeRemaining--;
      updateTimerDisplay();
      // Change timer color when 30 seconds remain
      if (timeRemaining <= 30) {
        timerItem.style.border = '2px solid #ff0000';
        timerElement.style.color = '#ff0000';
      }
      // Flash when 10 seconds remain
      if (timeRemaining <= 10) {
        timerItem.style.animation = timeRemaining % 2 === 0 ? 'pulse 0.5s' : 'none';
      }
    } else if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);

  // Send results to parent window (React app)
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: 'GAME_END',
        carrotCount: carrotScore,
        coinCount: coinScore,
      },
      '*',
    );
  }

  // Create game over overlay
  const gameOverlay = document.createElement('div');
  gameOverlay.style.position = 'absolute';
  gameOverlay.style.top = '0';
  gameOverlay.style.left = '0';
  gameOverlay.style.width = '100%';
  gameOverlay.style.height = '100%';
  gameOverlay.style.background = 'rgba(0, 0, 0, 0.8)';
  gameOverlay.style.display = 'flex';
  gameOverlay.style.flexDirection = 'column';
  gameOverlay.style.justifyContent = 'center';
  gameOverlay.style.alignItems = 'center';
  gameOverlay.style.zIndex = '2000';
  gameOverlay.style.color = 'white';
  gameOverlay.style.fontFamily = 'Arial, sans-serif';

  const gameOverText = document.createElement('h1');
  gameOverText.textContent = "TIME'S UP!";
  gameOverText.style.fontSize = '48px';
  gameOverText.style.marginBottom = '20px';
  gameOverText.style.color = '#ff4444';
  gameOverText.style.textShadow = '3px 3px 5px rgba(0,0,0,0.5)';

  const finalScoreText = document.createElement('h2');
  finalScoreText.textContent = `Final Score: ${coinScore} points`;
  finalScoreText.style.fontSize = '36px';
  finalScoreText.style.marginBottom = '30px';

  const detailsText = document.createElement('div');
  detailsText.style.fontSize = '24px';
  detailsText.style.textAlign = 'center';
  detailsText.style.marginBottom = '30px';
  detailsText.innerHTML = `
    Carrots: ${carrotScore}<br>
    Coins: ${coinScore}`;

  const restartButton = document.createElement('button');
  restartButton.textContent = 'BACK TO HOME';
  restartButton.style.padding = '15px 30px';
  restartButton.style.fontSize = '20px';
  restartButton.style.background = '#4CAF50';
  restartButton.style.color = 'white';
  restartButton.style.border = 'none';
  restartButton.style.borderRadius = '10px';
  restartButton.style.cursor = 'pointer';
  restartButton.style.fontWeight = 'bold';
  restartButton.addEventListener('click', () => {
    // Try to navigate parent window, fallback to current window
    if (window.parent && window.parent !== window) {
      window.parent.location.href = '/';
    } else {
      window.location.href = '/';
    }
  });

  gameOverlay.appendChild(gameOverText);
  gameOverlay.appendChild(finalScoreText);
  gameOverlay.appendChild(detailsText);
  gameOverlay.appendChild(restartButton);
  document.body.appendChild(gameOverlay);

  // Disable player controls
  keys.w.pressed = false;
  keys.a.pressed = false;
  keys.d.pressed = false;
  keys.x.pressed = false;
}

// Update score display function
function updateScoreDisplay() {
  carrotCountElement.textContent = carrotScore;
  coinCountElement.textContent = coinScore;
}

const preloadImages = async () => {
  const imagePromises = [];

  for (const [layerName, tilesetInfo] of Object.entries(tilesets)) {
    imagePromises.push(loadImage(tilesetInfo.imageUrl));
  }

  // Preload player image too
  const playerImage = new Image();
  playerImage.src = './images/player.png';
  imagePromises.push(
    new Promise((resolve, reject) => {
      playerImage.onload = resolve;
      playerImage.onerror = reject;
    }),
  );

  await Promise.all(imagePromises);
  console.log('All images preloaded successfully');
};

function animate(backgroundCanvas) {
  if (!gameActive) return; // Stop animation if game is over

  // Calculate delta time
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Update player position
  player.handleInput(keys);
  player.update(deltaTime, collisionBlocks);

  // Check for carrot collection
  carrots.forEach((carrot) => {
    if (!carrot.collected && carrot.checkCollision(player)) {
      carrot.collect();
      carrotScore += 1; // Each carrot is worth 1 point
      updateScoreDisplay();
    }
  });

  // Check for coin collection
  coins.forEach((coin) => {
    if (!coin.collected && coin.checkCollision(player)) {
      coin.collect();
      coinScore += 1; // Each coin is worth 1 point
      updateScoreDisplay();
    }
  });

  // Track scroll distance
  if (player.x > SCROLL_RIGHT) {
    const scrollDistance = player.x - SCROLL_RIGHT;
    camera.x = scrollDistance;
  }

  if (player.y < SCROLL_TOP && camera.y > 0) {
    const scrollDistance = SCROLL_TOP - player.y;
    camera.y = scrollDistance;
  }

  if (player.y > SCROLL_BOTTOM) {
    const scrollDistance = player.y - SCROLL_BOTTOM;
    camera.y = -scrollDistance;
  }

  // Render scene
  c.save();
  c.scale(dpr, dpr);
  c.translate(-camera.x, camera.y);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(skyBackgroundCanvas, camera.x * 0.32, 0);
  c.drawImage(mountBackgroundCanvas, camera.x * 0.18, 0);
  c.drawImage(backgroundCanvas, 0, 0);

  // Draw only non-collected carrots (collected carrots won't be drawn)
  carrots.forEach((carrot) => carrot.draw(c));
  coins.forEach((coin) => coin.draw(c));
  player.draw(c);
  c.restore();

  requestAnimationFrame(() => animate(backgroundCanvas));
}

function convertCarrotsToCoin() {
  // Check if player is in the specified range
  const playerTileX = Math.floor(player.x / 16);
  const playerTileY = Math.floor(player.y / 16);

  if (playerTileX >= 0 && playerTileX <= 15 && playerTileY >= 0 && playerTileY <= 13) {
    // Check if player has at least 10 carrots
    if (carrotScore >= 10) {
      // Convert 10 carrots to 1 coin
      const conversions = Math.floor(carrotScore / 10);
      const carrotsUsed = conversions * 10;
      const coinsGained = conversions;
      carrotScore -= carrotsUsed;
      coinScore += coinsGained;
      // Update the score display
      updateScoreDisplay();
    }
  }
}

const startRendering = async () => {
  try {
    skyBackgroundCanvas = await renderStaticLayers(skyLayerData);
    mountBackgroundCanvas = await renderStaticLayers(mountLayerData);
    const backgroundCanvas = await renderStaticLayers(layersData);
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas');
      return;
    }

    // Start the timer when the game starts
    startTimer();

    animate(backgroundCanvas);
  } catch (error) {
    console.error('Error during rendering:', error);
  }
};

// touchControls.js
class TouchControls {
  constructor(keys) {
    this.keys = keys;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

    if (this.isMobile) {
      this.initTouchControls();
    }
  }

  initTouchControls() {
    // Movement buttons
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    // const jumpBtn = document.getElementById('jump-btn');
    // const actionBtn = document.getElementById('action-btn');

    // Left button
    this.setupButton(
      leftBtn,
      () => {
        this.keys.a.pressed = true;
      },
      () => {
        this.keys.a.pressed = false;
      },
    );

    // Right button
    this.setupButton(
      rightBtn,
      () => {
        this.keys.d.pressed = true;
      },
      () => {
        this.keys.d.pressed = false;
      },
    );

    // Up button (alternative jump)
    this.setupButton(
      upBtn,
      () => {
        if (!this.keys.w.pressed) {
          player.jump();
        }
        this.keys.w.pressed = true;
      },
      () => {
        this.keys.w.pressed = false;
      },
    );

    // Action button (X) - convert carrots to coins
    this.setupButton(
      downBtn,
      () => {
        this.keys.x.pressed = true;
        convertCarrotsToCoin();
      },
      () => {
        this.keys.x.pressed = false;
      },
    );

    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
      if (this.isMobile) e.preventDefault();
    });

    console.log('Touch controls initialized');
  }

  setupButton(button, onStart, onEnd) {
    if (!button) return;

    // Touch events
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      onStart();
    });

    button.addEventListener('touchend', (e) => {
      e.preventDefault();
      onEnd();
    });

    button.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      onEnd();
    });

    // Mouse events for testing on desktop
    button.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onStart();
    });

    button.addEventListener('mouseup', (e) => {
      e.preventDefault();
      onEnd();
    });

    button.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      onEnd();
    });
  }
}

// Initialize touch controls globally
let touchControls;

startRendering();

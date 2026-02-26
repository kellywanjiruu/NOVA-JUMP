class NovaJump {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Game state
    this.score = 0;
    this.level = 1;
    this.maxHealth = 100;
    this.currentHealth = 100;
    this.gameRunning = true;
    this.gameOver = false;
    this.victory = false;

    // Camera
    this.cameraX = 0;

    // Physics constants
    this.gravity = 0.5;
    this.friction = 0.8;
    this.jumpForce = -12;

    // Player
    this.player = {
      x: 100,
      y: 300,
      width: 30,
      height: 30,
      velX: 0,
      velY: 0,
      grounded: false,
      color: "#05d9e8",
      trail: [],
    };

    // Platforms
    this.platforms = [];
    this.coins = [];
    this.enemies = [];
    this.particles = [];

    // Input handling
    this.keys = {};

    // Level dimensions
    this.levelWidth = 2000;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadLevel();
    this.gameLoop();
  }

  setupEventListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;

      // Restart with R key
      if (e.key.toLowerCase() === "r") {
        this.restart();
      }

      // Prevent page scrolling with arrow keys
      if (
        [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    document.getElementById("restartBtn").addEventListener("click", () => {
      this.restart();
    });
  }

  loadLevel() {
    // Clear existing objects
    this.platforms = [];
    this.coins = [];
    this.enemies = [];

    // Ground platform
    this.platforms.push({
      x: 0,
      y: 450,
      width: this.levelWidth,
      height: 50,
      color: "#ff2a6d",
    });

    // Level 1 platforms
    if (this.level === 1) {
      this.createLevel1();
    }
    // Level 2 platforms
    else if (this.level === 2) {
      this.createLevel2();
    }
    // Level 3 platforms (final)
    else if (this.level === 3) {
      this.createLevel3();
    }
  }

  createLevel1() {
    // Platforms
    const platformPositions = [
      { x: 200, y: 350, width: 100 },
      { x: 400, y: 300, width: 80 },
      { x: 600, y: 250, width: 120 },
      { x: 850, y: 200, width: 100 },
      { x: 1100, y: 300, width: 150 },
      { x: 1400, y: 250, width: 80 },
      { x: 1650, y: 350, width: 100 },
    ];

    platformPositions.forEach((pos) => {
      this.platforms.push({
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: 20,
        color: "#7700ff",
      });
    });

    // Coins
    const coinPositions = [
      { x: 250, y: 320 },
      { x: 450, y: 270 },
      { x: 650, y: 220 },
      { x: 900, y: 170 },
      { x: 1150, y: 270 },
      { x: 1450, y: 220 },
      { x: 1700, y: 320 },
    ];

    coinPositions.forEach((pos) => {
      this.coins.push({
        x: pos.x,
        y: pos.y,
        width: 20,
        height: 20,
        collected: false,
        animation: 0,
      });
    });

    // Enemies
    this.enemies.push({
      x: 500,
      y: 280,
      width: 25,
      height: 25,
      velX: 1,
      range: 100,
      startX: 500,
      color: "#ff2a6d",
    });

    this.enemies.push({
      x: 1200,
      y: 280,
      width: 25,
      height: 25,
      velX: 1.5,
      range: 150,
      startX: 1200,
      color: "#ff2a6d",
    });
  }

  createLevel2() {
    // More challenging platforms
    const platformPositions = [
      { x: 150, y: 400, width: 80 },
      { x: 300, y: 300, width: 60 },
      { x: 450, y: 200, width: 60 },
      { x: 600, y: 300, width: 80 },
      { x: 750, y: 200, width: 60 },
      { x: 900, y: 300, width: 80 },
      { x: 1050, y: 200, width: 60 },
      { x: 1200, y: 300, width: 80 },
      { x: 1400, y: 350, width: 100 },
    ];

    platformPositions.forEach((pos) => {
      this.platforms.push({
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: 20,
        color: "#ff2a6d",
      });
    });

    // More coins
    for (let i = 0; i < 15; i++) {
      this.coins.push({
        x: 200 + i * 100,
        y: 150 + Math.sin(i) * 50,
        width: 20,
        height: 20,
        collected: false,
        animation: 0,
      });
    }

    // More enemies
    for (let i = 0; i < 3; i++) {
      this.enemies.push({
        x: 400 + i * 300,
        y: 280,
        width: 25,
        height: 25,
        velX: 1 + i * 0.5,
        range: 150,
        startX: 400 + i * 300,
        color: "#7700ff",
      });
    }
  }

  createLevel3() {
    // Final level - more complex
    const platformPositions = [
      { x: 100, y: 400, width: 60 },
      { x: 200, y: 300, width: 60 },
      { x: 300, y: 200, width: 60 },
      { x: 400, y: 300, width: 60 },
      { x: 500, y: 200, width: 60 },
      { x: 600, y: 300, width: 60 },
      { x: 700, y: 200, width: 60 },
      { x: 800, y: 300, width: 60 },
      { x: 900, y: 200, width: 60 },
      { x: 1000, y: 300, width: 60 },
      { x: 1100, y: 200, width: 60 },
      { x: 1200, y: 300, width: 60 },
      { x: 1350, y: 350, width: 100 },
    ];

    platformPositions.forEach((pos) => {
      this.platforms.push({
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: 20,
        color: "#05d9e8",
      });
    });

    // Victory coin at the end
    this.coins.push({
      x: 1450,
      y: 320,
      width: 30,
      height: 30,
      collected: false,
      isVictory: true,
      animation: 0,
    });

    // More enemies
    for (let i = 0; i < 5; i++) {
      this.enemies.push({
        x: 200 + i * 250,
        y: 180,
        width: 25,
        height: 25,
        velX: 2,
        range: 200,
        startX: 200 + i * 250,
        color: "#ff2a6d",
      });
    }
  }

  update() {
    if (!this.gameRunning || this.gameOver || this.victory) return;

    // Handle input
    if (this.keys["ArrowLeft"] || this.keys["a"]) {
      this.player.velX = -5;
    } else if (this.keys["ArrowRight"] || this.keys["d"]) {
      this.player.velX = 5;
    } else {
      this.player.velX *= this.friction;
    }

    // Jump
    if (
      (this.keys[" "] || this.keys["ArrowUp"] || this.keys["w"]) &&
      this.player.grounded
    ) {
      this.player.velY = this.jumpForce;
      this.player.grounded = false;
      this.createParticles(
        this.player.x,
        this.player.y + this.player.height,
        10,
      );
    }

    // Apply gravity
    this.player.velY += this.gravity;

    // Update position
    this.player.x += this.player.velX;
    this.player.y += this.player.velY;

    // Keep player in bounds
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.width > this.levelWidth) {
      this.player.x = this.levelWidth - this.player.width;
    }

    // Platform collision
    this.player.grounded = false;
    for (let platform of this.platforms) {
      if (this.collides(this.player, platform)) {
        // Top collision
        if (
          this.player.velY > 0 &&
          this.player.y + this.player.height - this.player.velY <= platform.y
        ) {
          this.player.y = platform.y - this.player.height;
          this.player.velY = 0;
          this.player.grounded = true;
        }
        // Bottom collision
        else if (
          this.player.velY < 0 &&
          this.player.y - this.player.velY >= platform.y + platform.height
        ) {
          this.player.y = platform.y + platform.height;
          this.player.velY = 0;
        }
        // Side collision
        else {
          if (this.player.velX > 0) {
            this.player.x = platform.x - this.player.width;
          } else if (this.player.velX < 0) {
            this.player.x = platform.x + platform.width;
          }
          this.player.velX = 0;
        }
      }
    }

    // Enemy collision
    for (let enemy of this.enemies) {
      // Move enemy
      enemy.x += enemy.velX;
      if (
        enemy.x > enemy.startX + enemy.range ||
        enemy.x < enemy.startX - enemy.range
      ) {
        enemy.velX *= -1;
      }

      // Check collision with player
      if (this.collides(this.player, enemy)) {
        this.currentHealth -= 20;
        this.createParticles(this.player.x, this.player.y, 20);

        // Knockback
        if (this.player.x < enemy.x) {
          this.player.x -= 50;
        } else {
          this.player.x += 50;
        }

        if (this.currentHealth <= 0) {
          this.gameOver = true;
          this.gameRunning = false;
          this.showGameOver("GAME OVER", `Final Score: ${this.score}`);
        }
      }
    }

    // Coin collection
    for (let coin of this.coins) {
      if (!coin.collected && this.collides(this.player, coin)) {
        coin.collected = true;
        this.score += 100;
        this.createParticles(coin.x, coin.y, 15, "#ffd93d");

        if (coin.isVictory) {
          this.victory = true;
          this.gameRunning = false;
          this.showGameOver("VICTORY!", `Final Score: ${this.score}`);
        }

        // Level progression
        if (
          this.coins.filter((c) => !c.collected && !c.isVictory).length === 0 &&
          this.level < 3
        ) {
          this.level++;
          this.player.x = 100;
          this.player.y = 300;
          this.loadLevel();
        }
      }
    }

    // Update camera
    this.cameraX =
      this.player.x - this.canvas.width / 2 + this.player.width / 2;
    this.cameraX = Math.max(
      0,
      Math.min(this.cameraX, this.levelWidth - this.canvas.width),
    );

    // Update UI
    document.getElementById("scoreDisplay").textContent = this.score;
    document.getElementById("levelDisplay").textContent = this.level;
    document.getElementById("healthFill").style.width =
      `${(this.currentHealth / this.maxHealth) * 100}%`;

    // Update particles
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.02;
      return p.life > 0;
    });

    // Player trail
    this.player.trail.push({ x: this.player.x, y: this.player.y });
    if (this.player.trail.length > 10) {
      this.player.trail.shift();
    }
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = "#0a0a1f";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid (parallax background)
    this.ctx.save();
    this.ctx.translate(-this.cameraX * 0.3, 0);
    this.ctx.strokeStyle = "rgba(5, 217, 232, 0.1)";
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.levelWidth; i += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
    }
    this.ctx.restore();

    // Save context with camera transform
    this.ctx.save();
    this.ctx.translate(-this.cameraX, 0);

    // Draw platforms
    this.platforms.forEach((platform) => {
      this.ctx.fillStyle = platform.color;
      this.ctx.shadowColor = platform.color;
      this.ctx.shadowBlur = 20;
      this.ctx.fillRect(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
      );

      // Neon edge
      this.ctx.shadowBlur = 30;
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
      );
    });

    // Draw coins
    this.coins.forEach((coin) => {
      if (!coin.collected) {
        coin.animation += 0.1;
        const yOffset = Math.sin(coin.animation) * 5;

        this.ctx.shadowColor = "#ffd93d";
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = coin.isVictory ? "#ff2a6d" : "#ffd93d";
        this.ctx.beginPath();
        this.ctx.arc(
          coin.x + coin.width / 2,
          coin.y + coin.height / 2 + yOffset,
          coin.width / 2,
          0,
          Math.PI * 2,
        );
        this.ctx.fill();

        // Inner glow
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(
          coin.x + coin.width / 2,
          coin.y + coin.height / 2 + yOffset,
          coin.width / 4,
          0,
          Math.PI * 2,
        );
        this.ctx.fill();
      }
    });

    // Draw enemies
    this.enemies.forEach((enemy) => {
      this.ctx.shadowColor = enemy.color;
      this.ctx.shadowBlur = 20;
      this.ctx.fillStyle = enemy.color;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Eyes
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
      this.ctx.fillRect(enemy.x + 15, enemy.y + 5, 5, 5);
    });

    // Draw player trail
    this.player.trail.forEach((pos, i) => {
      const alpha = (i / this.player.trail.length) * 0.5;
      this.ctx.shadowColor = this.player.color;
      this.ctx.shadowBlur = 20;
      this.ctx.fillStyle = `rgba(5, 217, 232, ${alpha})`;
      this.ctx.fillRect(pos.x, pos.y, this.player.width, this.player.height);
    });

    // Draw player
    this.ctx.shadowColor = this.player.color;
    this.ctx.shadowBlur = 30;
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height,
    );

    // Player eyes
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.player.x + 5, this.player.y + 5, 5, 5);
    this.ctx.fillRect(this.player.x + 20, this.player.y + 5, 5, 5);

    // Draw particles
    this.particles.forEach((p) => {
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, 3, 3);
    });

    this.ctx.restore();
    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
  }

  collides(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  createParticles(x, y, count, color = "#05d9e8") {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        color: color,
        life: 1,
      });
    }
  }

  showGameOver(title, message) {
    const overlay = document.getElementById("gameOverlay");
    const titleEl = document.getElementById("overlayTitle");
    const messageEl = document.getElementById("overlayMessage");
    const finalScore = document.getElementById("finalScore");

    titleEl.textContent = title;
    messageEl.textContent = message;
    finalScore.textContent = this.score;
    overlay.classList.add("active");
  }

  restart() {
    // Reset game state
    this.score = 0;
    this.level = 1;
    this.currentHealth = this.maxHealth;
    this.gameRunning = true;
    this.gameOver = false;
    this.victory = false;

    // Reset player
    this.player.x = 100;
    this.player.y = 300;
    this.player.velX = 0;
    this.player.velY = 0;
    this.player.trail = [];

    // Clear particles
    this.particles = [];

    // Hide overlay
    document.getElementById("gameOverlay").classList.remove("active");

    // Load level
    this.loadLevel();
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start the game
window.addEventListener("load", () => {
  new NovaJump();
});

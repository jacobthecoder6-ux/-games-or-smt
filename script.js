const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;

// Player paddle state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;

// AI paddle state
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
const AI_SPEED = 4;

// Ball state
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Mouse paddle control
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle position
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#ff0';
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Update AI paddle (follows ballY with basic prediction)
function updateAI() {
    const targetY = ballY + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
    if (aiY + PADDLE_HEIGHT / 2 < targetY - 10)
        aiY += AI_SPEED;
    else if (aiY + PADDLE_HEIGHT / 2 > targetY + 10)
        aiY -= AI_SPEED;
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Collision detection helper
function rectsCollide(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw &&
           ax + aw > bx &&
           ay < by + bh &&
           ay + ah > by;
}

// Update ball movement and collisions
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY *= -1;
        ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
    }

    // Left paddle collision
    if (rectsCollide(
        ballX, ballY, BALL_SIZE, BALL_SIZE,
        PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT
    )) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add a bit of "spin"
        ballSpeedY += ((ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2)) * 0.1;
    }

    // Right paddle collision
    if (rectsCollide(
        ballX, ballY, BALL_SIZE, BALL_SIZE,
        AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT
    )) {
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY += ((ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2)) * 0.1;
    }

    // Left/right wall (reset ball)
    if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2 - BALL_SIZE / 2;
        ballY = canvas.height / 2 - BALL_SIZE / 2;
        ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
    }
}

// Main loop
function loop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(loop);
}

loop();
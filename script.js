const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PADDLE_MARGIN = 24;
const PLAYER_COLOR = '#4DD0E1';
const AI_COLOR = '#FF8A65';
const BALL_COLOR = '#fff';
const NET_COLOR = '#555';
const FPS = 60;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 6 * (Math.random() * 2 - 1);
let aiSpeed = 5;

// Handle mouse movement for player paddle
canvas.addEventListener('mousemove', (evt) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle to canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw the net
function drawNet() {
    ctx.strokeStyle = NET_COLOR;
    ctx.lineWidth = 3;
    for (let y = 0; y < canvas.height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 14);
        ctx.stroke();
    }
}

// Draw paddles and ball
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    drawNet();

    // Player paddle (left)
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle (right)
    ctx.fillStyle = AI_COLOR;
    ctx.fillRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = BALL_COLOR;
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Update game logic
function update() {
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    } else if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Ball collision with player paddle
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH; // prevent sticking
        ballSpeedX *= -1;
        // Add "english" based on where it hit the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 6;
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE; // prevent sticking
        ballSpeedX *= -1;
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 6;
    }

    // Ball out of bounds (left or right)
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // AI paddle movement (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 12) {
        aiY += aiSpeed;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 12) {
        aiY -= aiSpeed;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Reset ball to center with random direction
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 6 * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
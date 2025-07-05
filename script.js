const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 20;
const BALL_RADIUS = 10;
const PLAYER_COLOR = '#0f0';
const AI_COLOR = '#f00';
const BALL_COLOR = '#fff';
const NET_COLOR = '#09f';

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;
let playerScore = 0;
let aiScore = 0;

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function (evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Game loop
function gameLoop() {
    moveBall();
    moveAI();
    draw();
    requestAnimationFrame(gameLoop);
}

// Move the ball and handle collisions
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = ballY - BALL_RADIUS < 0 ? BALL_RADIUS : canvas.height - BALL_RADIUS;
    }

    // Left paddle collision
    if (
        ballX - BALL_RADIUS < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some spin based on where the ball hits the paddle
        let deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
        ballX = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS;
    }

    // Right paddle (AI) collision
    if (
        ballX + BALL_RADIUS > canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS;
    }

    // Scoring
    if (ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Simple AI to track the ball
function moveAI() {
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 20) {
        aiY += 4;
    } else if (aiCenter > ballY + 20) {
        aiY -= 4;
    }
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillStyle = NET_COLOR;
        ctx.fillRect(canvas.width / 2 - 2, i, 4, 20);
    }

    // Draw paddles
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.fillStyle = AI_COLOR;
    ctx.fillRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2, false);
    ctx.fillStyle = BALL_COLOR;
    ctx.fill();

    // Draw scores
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(playerScore, canvas.width / 2 - 80, 50);
    ctx.fillText(aiScore, canvas.width / 2 + 60, 50);
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    // Reverse direction to the last scorer
    ballSpeedX = -ballSpeedX;
    // Give a slight random Y velocity
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3);
}

// Start the game
gameLoop();

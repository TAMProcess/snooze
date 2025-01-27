// Updated game.js file with speed progression and advanced character design
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const retryButton = document.getElementById('retryButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const finalScoreDisplay = document.getElementById('finalScore');
const instructions = document.getElementById('instructions');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.querySelector('header').offsetHeight;

const character = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    dy: 0,
    jumping: false,
    image: new Image(),
};
character.image.src = 'ape_with_axe.png';

const obstacles = [];
const coins = [];
const clouds = [];
const gravity = 1;
let obstacleSpeed = 5;
const obstacleWidth = 50;
const obstacleHeight = 50;
const obstacleY = canvas.height - 150;

let gameRunning = true;
let score = 0;
let gameStartTime = Date.now();

retryButton.addEventListener('click', resetGame);

function gameOver() {
    gameRunning = false;
    finalScoreDisplay.textContent = `Your final score: ${score}`;
    retryButton.style.display = 'block';
}

function resetGame() {
    obstacles.length = 0;
    coins.length = 0;
    clouds.length = 0;
    character.y = canvas.height - 150;
    character.dy = 0;
    character.jumping = false;
    gameRunning = true;
    score = 0;
    obstacleSpeed = 5;
    gameStartTime = Date.now();
    scoreDisplay.textContent = `Score: ${score}`;
    finalScoreDisplay.textContent = '';
    instructions.style.display = 'block';
    retryButton.style.display = 'none';
    gameLoop();
}

function updateGameSpeed() {
    const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
    if (elapsedTime % 30 === 0) {
        obstacleSpeed *= 1.1;
    }
}

function gameLoop() {
    if (!gameRunning) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 30);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateGameSpeed();
    updateCharacter();
    updateClouds();
    updateObstacles();
    updateCoins();
    detectCollision();

    drawClouds(ctx, clouds);
    drawCharacter(ctx, character);
    drawObstacles(ctx, obstacles);
    drawCoins(ctx, coins);
    drawFloor(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();

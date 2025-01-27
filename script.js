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
    jumping: false
};

const obstacles = [];
const coins = [];
const clouds = [];
const gravity = 1;
const obstacleWidth = 50;
const obstacleHeight = 50;
const obstacleSpeed = 6; // Adjusted speed
const obstacleY = canvas.height - 150; 

let gameRunning = true;
let nextObstacleDelay = 2000;
let score = 0;

function drawCharacter() {
    // Draw gorilla body
    ctx.fillStyle = "black";
    ctx.fillRect(character.x, character.y, character.width, character.height);

    // Draw gorilla head
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 20, 25, 0, Math.PI * 2);
    ctx.fill();

    // Draw gorilla arms
    ctx.fillRect(character.x - 10, character.y + 10, 10, 30);
    ctx.fillRect(character.x + character.width, character.y + 10, 10, 30);

    // Draw gorilla legs
    ctx.fillRect(character.x, character.y + character.height, 15, 20);
    ctx.fillRect(character.x + character.width - 15, character.y + character.height, 15, 20);

    // Draw face details (eyes and mouth)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(character.x + 15, character.y - 25, 5, 0, Math.PI * 2); // Left eye
    ctx.arc(character.x + 35, character.y - 25, 5, 0, Math.PI * 2); // Right eye
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(character.x + 25, character.y - 15, 7, 0, Math.PI, false); // Mouth
    ctx.stroke();
}

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        color: "brown",
        scored: false
    };
    obstacles.push(obstacle);

    // Randomize the time for the next obstacle
    nextObstacleDelay = Math.random() * 1000 + 1500;
    setTimeout(createObstacle, nextObstacleDelay);
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        if (!obstacles[i].scored && obstacles[i].x + obstacles[i].width < character.x) {
            score++;
            obstacles[i].scored = true;
            scoreDisplay.textContent = `Score: ${score}`;
        }
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function updateCharacter() {
    character.y += character.dy;
    if (character.y + character.height >= canvas.height - 100) {
        character.jumping = false;
        character.y = canvas.height - 150;
        character.dy = 0;
    } else {
        character.dy += gravity;
    }
}

function detectCollision() {
    for (const obstacle of obstacles) {
        if (
            character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y < obstacle.y + obstacle.height &&
            character.y + character.height > obstacle.y
        ) {
            gameOver();
        }
    }
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function drawFloor() {
    ctx.fillStyle = "#654321"; // Brown floor
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
}

function gameOver() {
    gameRunning = false;
    finalScoreDisplay.textContent = `Your final score: ${score}`;
    finalScoreDisplay.style.position = 'absolute';
    finalScoreDisplay.style.top = '45%';
    finalScoreDisplay.style.left = '50%';
    finalScoreDisplay.style.transform = 'translate(-50%, -50%)';
    retryButton.style.display = 'block';
}

function resetGame() {
    obstacles.length = 0;
    character.y = canvas.height - 150;
    character.dy = 0;
    character.jumping = false;
    gameRunning = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    finalScoreDisplay.textContent = '';
    instructions.style.display = 'block';
    retryButton.style.display = 'none';
    gameLoop();
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

    updateCharacter();
    updateObstacles();
    detectCollision();

    drawFloor();
    drawCharacter();
    drawObstacles();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!character.jumping) {
            character.jumping = true;
            character.dy = -16;
        }
        instructions.style.display = 'none';
    }
});

retryButton.addEventListener('click', resetGame);

setTimeout(createObstacle, nextObstacleDelay);
gameLoop();

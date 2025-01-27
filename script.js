const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const retryButton = document.getElementById('retryButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const finalScoreDisplay = document.getElementById('finalScore');
const instructions = document.getElementById('instructions');
const backgroundMusic = document.getElementById('backgroundMusic');

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
const powerUps = [];
const jungleLayers = [
    { x: 0, y: 0, speed: 1, image: new Image() },
    { x: 0, y: 0, speed: 2, image: new Image() },
];

jungleLayers[0].image.src = 'jungle_layer1.png';
jungleLayers[1].image.src = 'jungle_layer2.png';

const gravity = 1;
let obstacleSpeed = 5;
const obstacleY = canvas.height - 150;
let gameRunning = true;
let score = 0;
let obstaclesCleared = 0;

function playBackgroundMusic() {
    backgroundMusic.play();
}

function drawJungle() {
    jungleLayers.forEach((layer) => {
        layer.x -= layer.speed;
        if (layer.x <= -canvas.width) {
            layer.x = 0;
        }
        ctx.drawImage(layer.image, layer.x, 0, canvas.width, canvas.height);
        ctx.drawImage(layer.image, layer.x + canvas.width, 0, canvas.width, canvas.height);
    });
}

function createObstacle() {
    const types = ['rock', 'stump', 'vine'];
    const type = types[Math.floor(Math.random() * types.length)];
    const obstacle = {
        x: canvas.width,
        y: obstacleY,
        width: 50,
        height: type === 'vine' ? 100 : 50,
        type,
        color: type === 'rock' ? 'gray' : type === 'stump' ? 'brown' : 'green',
        scored: false
    };
    obstacles.push(obstacle);

    setTimeout(createObstacle, Math.random() * 1000 + 1500);
}

function createPowerUp() {
    const powerUp = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 200),
        width: 30,
        height: 30,
        type: 'invincibility',
        color: 'gold',
        collected: false
    };
    powerUps.push(powerUp);

    setTimeout(createPowerUp, Math.random() * 5000 + 10000);
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        if (!obstacles[i].scored && obstacles[i].x + obstacles[i].width < character.x) {
            score++;
            obstaclesCleared++;
            obstacles[i].scored = true;
            scoreDisplay.textContent = `Score: ${score}`;

            if (obstaclesCleared % 5 === 0) {
                obstacleSpeed += 1; // Increase speed every 5 obstacles
            }
        }
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].x -= obstacleSpeed;
        if (
            character.x < powerUps[i].x + powerUps[i].width &&
            character.x + character.width > powerUps[i].x &&
            character.y < powerUps[i].y + powerUps[i].height &&
            character.y + character.height > powerUps[i].y
        ) {
            powerUps[i].collected = true;
            obstacleSpeed *= 0.5; // Temporary slow-down effect
            setTimeout(() => {
                obstacleSpeed *= 2; // Restore speed
            }, 5000);
        }
        if (powerUps[i].x + powerUps[i].width < 0 || powerUps[i].collected) {
            powerUps.splice(i, 1);
        }
    }
}

function drawObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = obstacle.color;
        if (obstacle.type === 'vine') {
            ctx.fillRect(obstacle.x, obstacle.y - obstacle.height, obstacle.width, obstacle.height);
        } else {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}

function drawPowerUps() {
    powerUps.forEach((powerUp) => {
        if (!powerUp.collected) {
            ctx.fillStyle = powerUp.color;
            ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        }
    });
}

function gameLoop() {
    if (!gameRunning) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawJungle();
    updateObstacles();
    updatePowerUps();

    drawObstacles();
    drawPowerUps();
    requestAnimationFrame(gameLoop);
}

retryButton.addEventListener('click', () => {
    gameRunning = true;
    obstacles.length = 0;
    powerUps.length = 0;
    score = 0;
    obstacleSpeed = 5;
    scoreDisplay.textContent = `Score: ${score}`;
    gameLoop();
});

playBackgroundMusic();
createObstacle();
createPowerUp();
gameLoop();

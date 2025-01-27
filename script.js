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
const jungleLayers = [
    { x: 0, y: 0, speed: 1, image: new Image() },
    { x: 0, y: 0, speed: 2, image: new Image() }
];

jungleLayers[0].image.src = 'jungle_layer1.png'; // Placeholder path for layer 1
jungleLayers[1].image.src = 'jungle_layer2.png'; // Placeholder path for layer 2

const gravity = 1;
let obstacleSpeed = 5;
const obstacleY = canvas.height - 100;
let gameRunning = true; // Start game immediately
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
    const spacing = 300 + Math.random() * 200; // Random spacing
    const obstacle = {
        x: canvas.width + spacing,
        y: obstacleY,
        width: 50,
        height: 50,
        color: 'brown',
        scored: false
    };
    obstacles.push(obstacle);

    setTimeout(createObstacle, Math.random() * 2000 + 1500); // Randomize next obstacle
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        if (!obstacles[i].scored && obstacles[i].x + obstacles[i].width < character.x) {
            if (character.y + character.height <= obstacleY) {
                score++;
                obstacles[i].scored = true;
                scoreDisplay.textContent = `Score: ${score}`;

                if (++obstaclesCleared % 5 === 0) {
                    obstacleSpeed += 1; // Increase speed every 5 obstacles
                }
            }
        }
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
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

function drawCharacter() {
    ctx.fillStyle = 'black'; // Body
    ctx.fillRect(character.x, character.y, character.width, character.height);

    ctx.fillStyle = 'gray'; // Head
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 20, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black'; // Arms
    ctx.fillRect(character.x - 10, character.y + 10, 10, 30); // Left arm
    ctx.fillRect(character.x + character.width, character.y + 10, 10, 30); // Right arm
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

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!character.jumping) {
            character.jumping = true;
            character.dy = -16; // Jump up
        }
        instructions.style.display = 'none'; // Hide instructions
    }
});

function gameOver() {
    gameRunning = false;
    finalScoreDisplay.textContent = `Your final score: ${score}`;
    finalScoreDisplay.style.position = 'absolute';
    finalScoreDisplay.style.top = '45%';
    finalScoreDisplay.style.left = '50%';
    finalScoreDisplay.style.transform = 'translate(-50%, -50%)';
    retryButton.style.display = 'block';
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawJungle();
    updateCharacter();
    updateObstacles();
    detectCollision();

    drawCharacter();
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 10); // Grass

    requestAnimationFrame(gameLoop);
}

retryButton.addEventListener('click', () => {
    gameRunning = true;
    obstacles.length = 0;
    score = 0;
    obstacleSpeed = 5;
    scoreDisplay.textContent = `Score: ${score}`;
    finalScoreDisplay.textContent = '';
    retryButton.style.display = 'none';
    gameLoop();
});

playBackgroundMusic();
createObstacle();
gameLoop();

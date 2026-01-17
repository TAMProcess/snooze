const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const retryButton = document.getElementById('retryButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const finalScoreDisplay = document.getElementById('finalScore');
const instructions = document.getElementById('instructions');
// const backgroundMusic = document.getElementById('backgroundMusic');

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
let difficulty = 1;
let comboCounter = 0;

function playBackgroundMusic() {
    // Placeholder for future background music implementation
    // backgroundMusic.play();
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
    const spacing = Math.max(200, 400 - difficulty * 20) + Math.random() * 150;
    const obstacle = {
        x: canvas.width + spacing,
        y: obstacleY,
        width: 50,
        height: 50,
        color: '#FF4444',
        scored: false,
        passedOver: false
    };
    obstacles.push(obstacle);

    setTimeout(createObstacle, Math.max(1000, 2500 - difficulty * 150) + Math.random() * 1000);
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        
        // Check if character passed over the obstacle (not hit it)
        if (!obstacles[i].scored && obstacles[i].x + obstacles[i].width < character.x) {
            // Only score if character was above the obstacle when passing
            if (character.y + character.height <= obstacleY - 10) {
                score++;
                comboCounter++;
                obstacles[i].scored = true;
                scoreDisplay.textContent = `Score: ${score} | Combo: ${comboCounter}`;

                if (++obstaclesCleared % 3 === 0) {
                    obstacleSpeed += 1;
                    difficulty++;
                }
            }
        }
        
        // Check if obstacle passed character without being cleared
        if (!obstacles[i].scored && obstacles[i].x < character.x && obstacles[i].x + obstacles[i].width > character.x && obstacles[i].y + obstacles[i].height >= character.y + character.height - 10) {
            obstacles[i].scored = true; // Mark as scored to avoid double penalty
            comboCounter = 0; // Break combo on failed jump
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
    // Draw body with gradient effect
    ctx.fillStyle = 'black';
    ctx.fillRect(character.x, character.y, character.width, character.height);
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(character.x + 8, character.y + 10, 10, 10);
    ctx.fillRect(character.x + 32, character.y + 10, 10, 10);
    ctx.fillStyle = 'black';
    ctx.fillRect(character.x + 10, character.y + 12, 6, 6);
    ctx.fillRect(character.x + 34, character.y + 12, 6, 6);

    // Draw head (stylized)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 15, 18, 0, Math.PI * 2);
    ctx.fill();

    // Draw arms
    ctx.fillStyle = '#555';
    ctx.fillRect(character.x - 8, character.y + 8, 8, 28);
    ctx.fillRect(character.x + character.width, character.y + 8, 8, 28);
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
    const finalMessage = `Your final score: ${score}\nCombo: ${comboCounter}\nLevel reached: ${difficulty}`;
    finalScoreDisplay.textContent = finalMessage;
    finalScoreDisplay.style.position = 'absolute';
    finalScoreDisplay.style.top = '45%';
    finalScoreDisplay.style.left = '50%';
    finalScoreDisplay.style.transform = 'translate(-50%, -50%)';
    finalScoreDisplay.style.color = 'white';
    finalScoreDisplay.style.fontSize = '28px';
    finalScoreDisplay.style.textAlign = 'center';
    finalScoreDisplay.style.whiteSpace = 'pre-line';
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
        // Draw obstacle with gradient
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Add shading
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 10);
    });

    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 10); // Grass
    
    // Draw difficulty indicator
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Level: ${difficulty}`, 20, 40);
    ctx.fillText(`Speed: ${obstacleSpeed}`, 20, 65);

    requestAnimationFrame(gameLoop);
}

retryButton.addEventListener('click', () => {
    gameRunning = true;
    obstacles.length = 0;
    score = 0;
    comboCounter = 0;
    obstacleSpeed = 5;
    difficulty = 1;
    character.x = 100;
    character.y = canvas.height - 150;
    character.dy = 0;
    character.jumping = false;
    scoreDisplay.textContent = `Score: ${score} | Combo: 0`;
    finalScoreDisplay.textContent = '';
    retryButton.style.display = 'none';
    instructions.style.display = 'none';
    gameLoop();
});

playBackgroundMusic();
createObstacle();
gameLoop();

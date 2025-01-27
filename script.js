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
const obstacleSpeed = 5 * 1.265; // Increased speed by 15%
const obstacleY = canvas.height - 150; // Same level as the resting character

let gameRunning = true;
let nextObstacleDelay = 2000;
let score = 0;

function createCloud() {
    const cloud = {
        x: canvas.width,
        y: Math.random() * (canvas.height / 2), // Clouds appear in the upper half of the canvas
        width: 150 + Math.random() * 50, // Wider clouds
        height: 50 + Math.random() * 20, // Random height for clouds
        speed: obstacleSpeed / 2 // Clouds move slower than obstacles
    };
    clouds.push(cloud);

    // Create another cloud after a delay
    setTimeout(createCloud, Math.random() * 3000 + 2000);
}

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        color: null,
        shape: Math.random() > 0.5 ? 'barrel' : 'spike', // Randomly decide between barrels and spikes
        scored: false
    };
    obstacle.color = obstacle.shape === 'barrel' ? 'darkbrown' : 'gray';
    obstacles.push(obstacle);

    // Randomize the time for the next obstacle, between 1500ms and 2500ms
    nextObstacleDelay = Math.random() * 1000 + 1500;
    setTimeout(createObstacle, nextObstacleDelay);

    // Create a coin above or between obstacles
    if (Math.random() > 0.5) {
        const coin = {
            x: obstacle.x + obstacle.width + Math.random() * 100,
            y: obstacleY - 50 - Math.random() * 50, // Place coin above obstacle
            radius: 15, // Increased radius
            color: 'yellow',
            collected: false
        };
        coins.push(coin);
    }
}

function updateClouds() {
    for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].x -= clouds[i].speed;
        if (clouds[i].x + clouds[i].width < 0) {
            clouds.splice(i, 1);
        }
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        if (!obstacles[i].scored && obstacles[i].x + obstacles[i].width < character.x) {
            if (obstacles[i].shape === 'spike') {
                score += 2; // Spike is worth 2 points
            } else {
                score++; // Barrel is worth 1 point
            }
            obstacles[i].scored = true;
            scoreDisplay.textContent = `Score: ${score}`;
        }
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function updateCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].x -= obstacleSpeed;
        if (!coins[i].collected &&
            character.x < coins[i].x + coins[i].radius &&
            character.x + character.width > coins[i].x - coins[i].radius &&
            character.y < coins[i].y + coins[i].radius &&
            character.y + character.height > coins[i].y - coins[i].radius) {
            score++;
            coins[i].collected = true;
            scoreDisplay.textContent = `Score: ${score}`;
        }
        if (coins[i].x + coins[i].radius < 0) {
            coins.splice(i, 1);
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
    // Draw the ape's body
    ctx.fillStyle = "black";
    ctx.fillRect(character.x, character.y, character.width, character.height);

    // Draw the ape's head
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 20, 15, 0, Math.PI * 2); // Circular head
    ctx.fill();

    // Draw the ape's arms
    ctx.fillStyle = "black";
    ctx.fillRect(character.x - 10, character.y + 10, 10, 30); // Left arm
    ctx.fillRect(character.x + character.width, character.y + 10, 10, 30); // Right arm

    // Draw the axe in the right hand
    ctx.fillStyle = "red"; // Axe blade
    ctx.fillRect(character.x + character.width + 10, character.y + 20, 20, 5);
    ctx.fillStyle = "brown"; // Axe handle
    ctx.fillRect(character.x + character.width + 5, character.y + 15, 5, 30);
}

function drawClouds() {
    ctx.fillStyle = 'lightgray';
    for (const cloud of clouds) {
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        if (obstacle.shape === 'barrel') {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.shape === 'spike') {
            const halfWidth = obstacle.width / 2;
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x + halfWidth / 2, obstacle.y);
            ctx.lineTo(obstacle.x + halfWidth, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(obstacle.x + halfWidth, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x + 1.5 * halfWidth, obstacle.y);
            ctx.lineTo(obstacle.x + 2 * halfWidth, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();
        }
    }
}

function drawCoins() {
    for (const coin of coins) {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
            ctx.fillStyle = coin.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke(); // Add black outline to coins
            ctx.closePath();

            // Draw the "1" on the coin
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('1', coin.x, coin.y);
        }
    }
}

function drawFloor() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 10); // Draw a line to represent the floor
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
    coins.length = 0;
    clouds.length = 0;
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
    updateCoins();
    updateClouds();
    detectCollision();

    drawClouds();
    drawCharacter();
    drawObstacles();
    drawCoins();
    drawFloor();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!character.jumping) {
            character.jumping = true;
            character.dy = -16.5; // Increased jump height by 10%
        }
        instructions.style.display = 'none';
    }
});

retryButton.addEventListener('click', resetGame);

setTimeout(createObstacle, nextObstacleDelay);
setTimeout(createCloud, 1000);

gameLoop();

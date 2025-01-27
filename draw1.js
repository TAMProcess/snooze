// Updated draw.js file for more detailed character rendering
function drawCharacter(ctx, character) {
    // Draw the character using an image
    if (character.image.complete) {
        ctx.drawImage(character.image, character.x, character.y, character.width, character.height);
    } else {
        // Fallback rectangle if the image fails to load
        ctx.fillStyle = 'black';
        ctx.fillRect(character.x, character.y, character.width, character.height);
    }

    // Draw the axe
    ctx.fillStyle = 'silver';
    ctx.fillRect(character.x + character.width - 10, character.y + 20, 15, 5); // Axe blade
    ctx.fillStyle = 'brown';
    ctx.fillRect(character.x + character.width - 15, character.y + 20, 5, 30); // Axe handle
}

function drawClouds(ctx, clouds) {
    ctx.fillStyle = 'lightgray';
    for (const cloud of clouds) {
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawObstacles(ctx, obstacles) {
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

function drawCoins(ctx, coins) {
    for (const coin of coins) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fillStyle = coin.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1', coin.x, coin.y);
    }
}

function drawFloor(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 10);
}

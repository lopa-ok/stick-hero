const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let player = { x: 50, y: 500, width: 20, height: 20 };
let stick = { x: player.x + player.width, y: player.y, width: 5, height: 0, extending: false, rotating: false, angle: 0 };
let platforms = [
    { x: 0, y: 520, width: 100, height: 80 },
    { x: 300, y: 520, width: 100, height: 80 }
];
let score = 0;
let targetPlatformIndex = 1;
let cameraOffset = 0;
let targetCameraOffset = 0;
let playerMoving = false;
let playerMoveDistance = 0;
let playerMoveTargetX = 0;
let gameOver = false;

function drawPlayer() {
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x - cameraOffset, player.y, player.width, player.height);
}

function drawStick() {
    ctx.save();
    ctx.translate(stick.x - cameraOffset, stick.y);
    ctx.rotate(stick.angle * Math.PI / 180);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, -stick.height, stick.width, stick.height);
    ctx.restore();
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x - cameraOffset, platform.y, platform.width, platform.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.font = '18px Arial';
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
}

function extendStick() {
    if (stick.extending) {
        stick.height += 5;
        if (stick.height > canvas.height) {
            stick.height = canvas.height;
        }
    }
}

function rotateStick() {
    if (stick.rotating) {
        stick.angle += 5;
        if (stick.angle >= 90) {
            stick.angle = 90;
            stick.rotating = false;
            // Check if the stick is long enough to reach the next platform
            let targetPlatform = platforms[targetPlatformIndex];
            if (player.x + stick.height >= targetPlatform.x && player.x + stick.height <= targetPlatform.x + targetPlatform.width) {
                // Prepare to move player to the next platform
                playerMoveDistance = stick.height;
                playerMoveTargetX = player.x + playerMoveDistance;
                playerMoving = true;
            } else {
                // Player falls and the game is over
                gameOver = true;
            }
        }
    }
}

function movePlayer() {
    if (playerMoving) {
        player.x += 5;
        if (player.x >= playerMoveTargetX) {
            playerMoving = false;
            // Move player to the next platform
            let targetPlatform = platforms[targetPlatformIndex];
            player.x = targetPlatform.x;
            stick.x = player.x + player.width;
            stick.height = 0;
            stick.angle = 0;
            targetCameraOffset = player.x - canvas.width / 2 + player.width / 2;
            targetPlatformIndex++;
            score++;
            // Add a new platform
            let newPlatform = {
                x: platforms[platforms.length - 1].x + 200 + Math.random() * 100,
                y: 520,
                width: 100,
                height: 80
            };
            platforms.push(newPlatform);
        }
    }
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameOver) {
        drawGameOver();
    } else {
        drawPlatforms();
        drawPlayer();
        drawStick();
        drawScore();
        extendStick();
        rotateStick();
        movePlayer();
        cameraOffset = lerp(cameraOffset, targetCameraOffset, 0.1);
    }
    requestAnimationFrame(update);
}

function restartGame() {
    player = { x: 50, y: 500, width: 20, height: 20 };
    stick = { x: player.x + player.width, y: player.y, width: 5, height: 0, extending: false, rotating: false, angle: 0 };
    platforms = [
        { x: 0, y: 520, width: 100, height: 80 },
        { x: 300, y: 520, width: 100, height: 80 }
    ];
    score = 0;
    targetPlatformIndex = 1;
    cameraOffset = 0;
    targetCameraOffset = 0;
    playerMoving = false;
    playerMoveDistance = 0;
    playerMoveTargetX = 0;
    gameOver = false;
}

canvas.addEventListener('mousedown', (e) => {
    if (gameOver) {
        restartGame();
    } else if (!stick.rotating && !playerMoving) {
        stick.extending = true;
    }
});

canvas.addEventListener('mouseup', () => {
    if (stick.extending) {
        stick.extending = false;
        stick.rotating = true;
    }
});

update();

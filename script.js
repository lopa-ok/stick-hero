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

function drawPlayer() {
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawStick() {
    ctx.save();
    ctx.translate(stick.x, stick.y);
    ctx.rotate(stick.angle * Math.PI / 180);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, -stick.height, stick.width, stick.height);
    ctx.restore();
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
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
                // Move player to the next platform
                player.x = targetPlatform.x;
                stick.x = player.x + player.width;
                stick.height = 0;
                stick.angle = 0;
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
            } else {
                // Player falls and the game is over
                alert("Game Over! Your score is " + score);
                document.location.reload();
            }
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
    drawStick();
    drawScore();
    extendStick();
    rotateStick();
    requestAnimationFrame(update);
}

canvas.addEventListener('mousedown', () => {
    if (!stick.rotating) {
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

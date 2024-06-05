const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 50;
const playerHeight = 30;
const playerSpeed = 5;

let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;

let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

let bullets = [];
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    }
    else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
    else if(e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    }
    else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
    else if(e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = false;
    }
}

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.beginPath();
        ctx.rect(bullet.x, bullet.y, bulletWidth, bulletHeight);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
        bullet.y -= bulletSpeed;

        // Remove bullet if it goes off screen
        if (bullet.y + bulletHeight < 0) {
            bullets.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    requestAnimationFrame(draw);

    if(rightPressed && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
    else if(leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }

    if(spacePressed) {
        bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
        spacePressed = false; // Prevent continuous shooting
    }
}

draw();
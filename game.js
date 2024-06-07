const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 50;
const playerHeight = 30;
const playerSpeed = 5;
const groundHeight = 10;
const baseWidth = 60;
const baseHeight = 30;
const basePadding = 20;
const baseCount = 4;

let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - groundHeight - 10;
let score = 0;
let lives = 3;
let gameOver = false;

let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

let bullets = [];
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;

let bombs = [];
const bombWidth = 5;
const bombHeight = 10;
const bombSpeed = 4;

let bases = [];

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = false;
    }
}

// Alien settings
const alienRows = 5;
const alienCols = 11;
const alienWidth = 40;
const alienHeight = 30;
const alienPadding = 10;
const alienOffsetTop = 30;
const alienOffsetLeft = 30;
let alienSpeed = 1;
let alienDirection = 1;

let aliens = [];

function initAliens() {
    for (let r = 0; r < alienRows; r++) {
        aliens[r] = [];
        for (let c = 0; c < alienCols; c++) {
            let alienX = c * (alienWidth + alienPadding) + alienOffsetLeft;
            let alienY = r * (alienHeight + alienPadding) + alienOffsetTop;
            aliens[r][c] = { x: alienX, y: alienY, status: 1 };
        }
    }
}

function drawAliens() {
    for (let r = 0; r < alienRows; r++) {
        for (let c = 0; c < alienCols; c++) {
            if (aliens[r][c].status == 1) {
                let alienX = aliens[r][c].x;
                let alienY = aliens[r][c].y;
                ctx.beginPath();
                ctx.rect(alienX, alienY, alienWidth, alienHeight);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function updateAliens() {
    let edge = false;
    for (let r = 0; r < alienRows; r++) {
        for (let c = 0; c < alienCols; c++) {
            if (aliens[r][c].status == 1) {
                aliens[r][c].x += alienSpeed * alienDirection;
                if (aliens[r][c].x + alienWidth > canvas.width || aliens[r][c].x < 0) {
                    edge = true;
                }
                // Check if aliens reach the bottom
                if (aliens[r][c].y + alienHeight > canvas.height - groundHeight) {
                    gameOver = true;
                }
            }
        }
    }
    if (edge) {
        alienDirection *= -1;
        for (let r = 0; r < alienRows; r++) {
            for (let c = 0; c < alienCols; c++) {
                aliens[r][c].y += alienHeight;
            }
        }
        alienSpeed += 0.2; // Increase alien speed each time they step down
    }
}

function detectCollisions() {
    // Detect bullet-alien collisions
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        for (let r = 0; r < alienRows; r++) {
            for (let c = 0; c < alienCols; c++) {
                let alien = aliens[r][c];
                if (alien.status == 1) {
                    if (bullet.x > alien.x && bullet.x < alien.x + alienWidth &&
                        bullet.y > alien.y && bullet.y < alien.y + alienHeight) {
                        alien.status = 0;
                        bullets.splice(i, 1);
                        i--;
                        score += 10; // Increase score for each alien hit
                        break;
                    }
                }
            }
        }
    }

    // Detect bomb-player collisions
    for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i];
        if (bomb.x > playerX && bomb.x < playerX + playerWidth &&
            bomb.y > playerY && bomb.y < playerY + playerHeight) {
            bombs.splice(i, 1);
            lives--;
            if (lives === 0) {
                gameOver = true;
            }
            break;
        }
    }

    // Detect bomb-base collisions
    for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i];
        for (let j = 0; j < bases.length; j++) {
            let base = bases[j];
            if (bomb.x > base.x && bomb.x < base.x + base.width &&
                bomb.y > base.y && bomb.y < base.y + base.height) {
                bombs.splice(i, 1);
                bases.splice(j, 1);
                break;
            }
        }
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

function drawInfo() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 8, 20);
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawGround() {
    ctx.beginPath();
    ctx.rect(0, canvas.height - groundHeight, canvas.width, groundHeight);
    ctx.fillStyle = 'brown';
    ctx.fill();
    ctx.closePath();
}

function initBases() {
    for (let i = 0; i < baseCount; i++) {
        let baseX = i * (baseWidth + basePadding) + basePadding;
        let baseY = canvas.height - groundHeight - playerHeight - baseHeight - 10;
        bases.push({ x: baseX, y: baseY, width: baseWidth, height: baseHeight });
    }
}

function drawBases() {
    bases.forEach(base => {
        ctx.beginPath();
        ctx.rect(base.x, base.y, base.width, base.height);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
    });
}

function drawBombs() {
    bombs.forEach((bomb, index) => {
        ctx.beginPath();
        ctx.rect(bomb.x, bomb.y, bombWidth, bombHeight);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
        bomb.y += bombSpeed;

        // Remove bomb if it goes off screen
        if (bomb.y > canvas.height) {
            bombs.splice(index, 1);
        }
    });
}

function draw() {
    if (gameOver) {
        showGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawInfo();
    drawPlayer();
    drawBullets();
    drawAliens();
    drawGround();
    drawBases();
    drawBombs();
    detectCollisions();
    updateAliens();
    requestAnimationFrame(draw);

    if (rightPressed && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    } else if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }

    if (spacePressed) {
        bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
        spacePressed = false; // Prevent continuous shooting
    }

    // Randomly drop bombs from aliens
    if (Math.random() < 0.01) {
        let r = Math.floor(Math.random() * alienRows);
        let c = Math.floor(Math.random() * alienCols);
        if (aliens[r][c].status === 1) {
            bombs.push({ x: aliens[r][c].x + alienWidth / 2 - bombWidth / 2, y: aliens[r][c].y + alienHeight });
        }
    }
}

function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, canvas.width / 2 - 40, canvas.height / 2 + 20);

    // Draw restart button
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 30);
    ctx.fillStyle = "black";
    ctx.fillText("Restart", canvas.width / 2 - 30, canvas.height / 2 + 70);

    // Add event listener for restart button
    canvas.addEventListener('click', restartGame);
}

function restartGame(e) {
    let mouseX = e.clientX - canvas.offsetLeft;
    let mouseY = e.clientY - canvas.offsetTop;

    if (mouseX > canvas.width / 2 - 50 && mouseX < canvas.width / 2 + 50 &&
        mouseY > canvas.height / 2 + 50 && mouseY < canvas.height / 2 + 80) {
        
        // Reset game variables
        score = 0;
        lives = 3;
        gameOver = false;
        rightPressed = false;
        leftPressed = false;
        spacePressed = false;
        bullets = [];
        bombs = [];
        bases = [];
        alienSpeed = 1;
        alienDirection = 1;

        // Reinitialize aliens and bases
        initAliens();
        initBases();

        // Remove event listener to prevent multiple triggers
        canvas.removeEventListener('click', restartGame);

        // Restart the game loop
        draw();
    }
}


initAliens();
initBases();
draw();

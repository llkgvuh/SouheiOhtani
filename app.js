const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');

let playerScore = 0;
let playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
let appleSpeed = 2; // 初期りんご落下速度
let appleInterval = 1500; // 初期りんご生成間隔 (ms)
let appleCountMultiplier = 1; // りんごの数にかける倍率
let gameRunning = false;
let appleGenerationInterval;

const playerWidth = player.offsetWidth;
const playerHeight = player.offsetHeight;

function startGame() {
    playerScore = 0;
    appleSpeed = 2;
    appleInterval = 1500;
    appleCountMultiplier = 1;
    gameRunning = true;
    scoreDisplay.textContent = `スコア: ${playerScore}`;
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');

    // 既存のリンゴをすべて削除
    document.querySelectorAll('.apple').forEach(apple => apple.remove());

    // プレイヤーの位置をリセット
    playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
    player.style.left = `${playerX}px`;

    appleGenerationInterval = setInterval(createApple, appleInterval);
    gameLoop();
}

function createApple() {
    const numberOfApples = Math.floor(1 * appleCountMultiplier);
    for (let i = 0; i < numberOfApples; i++) {
        const apple = document.createElement('div');
        apple.classList.add('apple');
        apple.style.left = `${Math.random() * (gameArea.offsetWidth - 40)}px`; // 40はリンゴの幅
        gameArea.appendChild(apple);
        moveApple(apple);
    }
}

function moveApple(apple) {
    let appleY = 0;
    const fallSpeed = appleSpeed * (0.8 + Math.random() * 0.4); // 個体差をつける
    
    function animateApple() {
        if (!gameRunning) return;

        appleY += fallSpeed;
        apple.style.top = `${appleY}px`;

        // 衝突判定
        if (checkCollision(apple, player)) {
            gameOver();
            return;
        }

        // 画面下部に到達したら削除してスコア加算
        if (appleY > gameArea.offsetHeight) {
            apple.remove();
            playerScore++;
            scoreDisplay.textContent = `スコア: ${playerScore}`;
            updateDifficulty();
            return; // ループを抜ける
        }
        requestAnimationFrame(animateApple);
    }
    requestAnimationFrame(animateApple);
}

function checkCollision(apple, player) {
    const appleRect = apple.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    return !(
        appleRect.bottom < playerRect.top ||
        appleRect.top > playerRect.bottom ||
        appleRect.right < playerRect.left ||
        appleRect.left > playerRect.right
    );
}

function updateDifficulty() {
    appleSpeed *= 1.05; // 速度アップ
    appleCountMultiplier *= 1.05; // 出現数アップ

    // リンゴの生成間隔を短くする (難易度に応じて調整)
    clearInterval(appleGenerationInterval);
    appleInterval = Math.max(500, appleInterval * 0.95); // 最低500ms
    appleGenerationInterval = setInterval(createApple, appleInterval);
}

function gameOver() {
    gameRunning = false;
    clearInterval(appleGenerationInterval);
    gameOverScreen.classList.remove('hidden');
}

function gameLoop() {
    if (!gameRunning) return;

    requestAnimationFrame(gameLoop);
}

// キーボード操作 (PC)
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    const playerSpeed = 15;
    if (e.key === 'ArrowLeft') {
        playerX = Math.max(0, playerX - playerSpeed);
    } else if (e.key === 'ArrowRight') {
        playerX = Math.min(gameArea.offsetWidth - playerWidth, playerX + playerSpeed);
    }
    player.style.left = `${playerX}px`;
});

// タッチ操作 (スマートフォン)
let isDragging = false;
player.addEventListener('touchstart', (e) => {
    if (!gameRunning) return;
    isDragging = true;
    player.style.cursor = 'grabbing';
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging || !gameRunning) return;
    e.preventDefault(); // スクロール防止

    const touch = e.touches[0];
    const gameAreaRect = gameArea.getBoundingClientRect();
    let newX = touch.clientX - gameAreaRect.left - playerWidth / 2;

    playerX = Math.max(0, Math.min(gameArea.offsetWidth - playerWidth, newX));
    player.style.left = `${playerX}px`;
});

document.addEventListener('touchend', () => {
    isDragging = false;
    player.style.cursor = 'grab';
});

// マウス操作 (PC - ドラッグ)
player.addEventListener('mousedown', (e) => {
    if (!gameRunning) return;
    isDragging = true;
    player.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging || !gameRunning) return;
    
    const gameAreaRect = gameArea.getBoundingClientRect();
    let newX = e.clientX - gameAreaRect.left - playerWidth / 2;

    playerX = Math.max(0, Math.min(gameArea.offsetWidth - playerWidth, newX));
    player.style.left = `${playerX}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    player.style.cursor = 'grab';
});


// イベントリスナーの追加
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

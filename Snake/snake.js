let playBoard = document.querySelector(".play-board");
let scoreElement = document.querySelector(".score");
let highScoreElement = document.querySelector(".high-score");

let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let foodX, foodY;
let chickenX, chickenY;
let chickenVisible = false;
let gameInterval;
let speed = 150;

// High score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30);
    foodY = Math.floor(Math.random() * 30);

    // Random chance for chicken to spawn (1 in 7)
    if (!chickenVisible && Math.random() < 1 / 7) {
        chickenX = Math.floor(Math.random() * 30);
        chickenY = Math.floor(Math.random() * 30);
        chickenVisible = true;
        
        // Despawn chicken after 10 seconds
        setTimeout(() => {
            chickenVisible = false;
        }, 10000);
    }
};

const handleGameOver = () => {
    clearInterval(gameInterval);
    alert("Game Over! Press OK to restart.");
    location.reload();
};

const updateGame = () => {
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        scoreElement.innerText = `Score: ${snakeBody.length}`;
        if (snakeBody.length > highScore) {
            localStorage.setItem("high-score", snakeBody.length);
            highScoreElement.innerText = `High Score: ${snakeBody.length}`;
        }
    }

    if (chickenVisible && snakeX === chickenX && snakeY === chickenY) {
        chickenVisible = false;
        snakeBody.push([chickenX, chickenY]);
        snakeBody.push([chickenX, chickenY]);
        snakeBody.push([chickenX, chickenY]);
        snakeBody.push([chickenX, chickenY]);
        scoreElement.innerText = `Score: ${snakeBody.length}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX < 0 || snakeX >= 30 || snakeY < 0 || snakeY >= 30) {
        handleGameOver();
    }

    snakeBody.unshift([snakeX, snakeY]);
    if (snakeBody.length > 1) {
        snakeBody.pop();
    }

    let html = `<div class='food' style='grid-area: ${foodY + 1} / ${foodX + 1};'></div>`;

    if (chickenVisible) {
        html += `<div class='chicken' style='grid-area: ${chickenY + 1} / ${chickenX + 1};'></div>`;
    }

    snakeBody.forEach((part, index) => {
        if (index === 0) {
            html += `<div class='head' style='grid-area: ${part[1] + 1} / ${part[0] + 1};'></div>`;
        } else {
            html += `<div class='body' style='grid-area: ${part[1] + 1} / ${part[0] + 1};'></div>`;
        }
    });    

    playBoard.innerHTML = html;
};

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX === 0) {
        velocityX = 1;
        velocityY = 0;
    }
});

gameInterval = setInterval(updateGame, speed);
changeFoodPosition();

(function () {
    const GRID_SIZE = 30;
    let score = 0;
    let SNAKE_SPEED = 7; //mvoe per second
    const snakeReset = [{ x: 10, y: 10 }]
    let snake = [...snakeReset];
    let food = randomPosition();
    let direction = { x: 1, y: 0 };
    let expandSnake = false;
    let gameRunning = false;
    const DIRECTIONS = {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        up: 'ArrowUp',
        down: 'ArrowDown'
    }
    let currentDirection = DIRECTIONS.down;
    const boardEle = document.getElementById('board');
    const scoreEle = document.getElementById('score');
    let gameRef = null;
    function drawSnake() {
        snake.forEach((segment, i) => {
            let snakeEle = document.createElement('div');
            snakeEle.style.gridRowStart = segment.x;
            snakeEle.style.gridColumnStart = segment.y;
            snakeEle.classList.add('snake');
            if (i === 0) {
                snakeEle.classList.add('head');
            }
            boardEle.appendChild(snakeEle);
        })
    }

    function moveSnake() {
        let snakeHead = snake[0];
        if (!expandSnake) {
            snake.pop();
        }

        let posX = checkOutsideGrid(snakeHead.x + direction.x);
        let posY = checkOutsideGrid(snakeHead.y + direction.y);
        snake.unshift({
            x: posX,
            y: posY
        })
        expandSnake = false;
    }

    function checkOutsideGrid(pos) {
        if (pos > GRID_SIZE) {
            pos = 1;
        }
        if (pos < 1) {
            pos = GRID_SIZE;
        }
        return pos;
    }
    function moveFood() {
        if (onSnake(food)) {
            food = randomPosition();
            score += 10;
            printScore();
            if (score % 100 === 0) {
                SNAKE_SPEED++;
                startMovement();
            }
            expandSnake = true;
        }
    }
    function printScore() {
        scoreEle.innerHTML = score;
    };
    function drawFood() {
        let foodEle = document.createElement('div');
        foodEle.style.gridRowStart = food.x;
        foodEle.style.gridColumnStart = food.y;
        foodEle.classList.add('apple');
        boardEle.appendChild(foodEle);
    }

    function onSnake(pos, skipHead = false) {
        if (!pos) return false;
        return snake.some((segment, i) => {
            if (skipHead && i === 0) return false;
            return (segment.x === pos.x && segment.y === pos.y);
        })
    }

    function randomPosition() {
        let pos = null;
        while (pos === null || onSnake(pos)) {
            pos = {
                x: Math.floor(Math.random() * GRID_SIZE) + 1,
                y: Math.floor(Math.random() * GRID_SIZE) + 1
            }
        }
        return pos;
    }
    function startGame() {
        setEventListners();
        printScore();
        startMovement();
    }
    function startMovement() {
        if (gameRef) {
            clearInterval(gameRef);
        }
        gameRunning = true;
        gameRef = setInterval(() => {
            boardEle.innerHTML = '';
            moveFood();
            drawFood();
            moveSnake();
            drawSnake();
            checkDeath();
        }, 1000 / SNAKE_SPEED);
    }
    function checkDeath() {
        const snakeHead = snake[0];
        if (onSnake(snakeHead, true)) {
            if (gameRef) {
                clearInterval(gameRef);
            }
            gameRunning = false;
            alert(`Game Over, your score is ${score}`);
            snake = [...snakeReset];
            score = 0;
        }
    }
    function setEventListners() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case DIRECTIONS.left:
                    if (currentDirection === DIRECTIONS.left || currentDirection === DIRECTIONS.right) {
                        break;
                    }
                    direction = {
                        x: 0, y: -1
                    }
                    currentDirection = e.key;
                    break;
                case DIRECTIONS.right:
                    if (currentDirection === DIRECTIONS.left || currentDirection === DIRECTIONS.right) {
                        break;
                    }
                    direction = {
                        x: 0, y: 1
                    }
                    currentDirection = e.key;
                    break;
                case DIRECTIONS.up:
                    if (currentDirection === DIRECTIONS.up || currentDirection === DIRECTIONS.down) {
                        break;
                    }
                    direction = {
                        x: -1, y: 0
                    }
                    currentDirection = e.key;
                    break;
                case DIRECTIONS.down:
                    if (currentDirection === DIRECTIONS.up || currentDirection === DIRECTIONS.down) {
                        break;
                    }
                    direction = {
                        x: 1, y: 0
                    }
                    currentDirection = e.key;
                    break;
            }
            if (e.keyCode === 32) {
                if (gameRunning) {
                    gameRunning = false;
                    if (gameRef) {
                        clearInterval(gameRef);
                    }
                } else {
                    startMovement();
                }
            }
        })
    }

    startGame();
})();
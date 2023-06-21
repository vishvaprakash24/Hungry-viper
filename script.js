const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");


let gameOver=false;
let foodX, foodY;
let snakeX = 5, snakeY=10;
let snakeBody = [];
let velocityX = 0, velocityY = 0
let setIntervalId;
let score = 0;

// getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`

const changeFoodPosition = ()=>{ 
    foodX = Math.floor(Math.random()*30)+1;
    foodY = Math.floor(Math.random()* 30)+1;
}

const handleGameOver = () =>{
    // clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! press ok to replay....")
    location.reload();
}
const changeDirection = (e) => {
    // console.log(e);
    // changing velocity value based on key press
    if((e.key === "ArrowUp" || e.key === "w") && velocityY!==1){
        velocityX=0;
        velocityY=-1;
    }else if((e.key === "ArrowLeft" || e.key === "a") && velocityX!==1){
        velocityX = -1;
        velocityY =  0;
    } else if((e.key==="ArrowDown" || e.key === "s") && velocityY!==-1){
        velocityX = 0;
        velocityY = 1;
    } else if((e.key === "ArrowRight" || e.key === "d") && velocityX!==-1){
        velocityX=1;
        velocityY=0;
    }
    // initGame();
}
controls.forEach(key=>{
    // calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})
const initGame = ()=>{
    if(gameOver===true){
        return handleGameOver();
    }
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    // checking if the snake hit the food
    if(snakeX === foodX && snakeY===foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //pushing food position to snake body array
        // console.log(snakeBody);
        score+=5 //inrement score by 5
        highScore = score>=highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);

        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for(let i=snakeBody.length - 1; i>0; i--){
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0] = [snakeX, snakeY]; // setting first element of snake body to current snake position

    // updating the snake's head position based on the current velocity
    snakeX+=velocityX;
    snakeY+=velocityY;

    // checking if the snake's head position is out of wall? if so setting gameOver to true
    if(snakeX<=0 || snakeX>30 || snakeY<=0 || snakeY>30){
        // console.log("GameOver")
        gameOver=true;
    }
    
    for(let i=0; i<snakeBody.length; i++){
        // adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // checking if snake head hit the body, if so set gameOver to true
        if(i!==0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0]===snakeBody[i][0]){
            gameOver=true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
// initGame();
setIntervalId = setInterval(initGame, 80);
document.addEventListener("keydown",changeDirection);

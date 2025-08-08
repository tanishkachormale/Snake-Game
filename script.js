const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
highScoreElement.textContent = highScore;

function setup() {
  snake = new Snake();
  fruit = randomPosition();
  score = 0;
  scoreElement.textContent = score;
}

setup();

window.setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.update();
  snake.draw();

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(fruit.x + scale / 2, fruit.y + scale / 2, scale / 2, 0, Math.PI * 2);
  ctx.fill();

  if (snake.eat(fruit)) {
    fruit = randomPosition();
    score++;
    scoreElement.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreElement.textContent = highScore;
    }
  }

  if (snake.checkCollision()) {
    alert("Game Over! Try Again?");
    setup();
  }
}, 150);

function randomPosition() {
  return {
    x: Math.floor(Math.random() * columns) * scale,
    y: Math.floor(Math.random() * rows) * scale
  };
}

document.getElementById("resetBtn").addEventListener("click", () => {
  snake = new Snake();
  fruit = randomPosition();
  score = 0;
  updateScore();
});

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];

  this.draw = function () {
    ctx.fillStyle = "lime";
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    ctx.fillRect(this.x, this.y, scale, scale);

    ctx.fillStyle = "black";
    let eyeSize = 4;
    let offset = 4;

    if (this.xSpeed > 0) { 
      drawEye(this.x + scale - offset - eyeSize, this.y + offset);
      drawEye(this.x + scale - offset - eyeSize, this.y + scale - offset - eyeSize);
    } else if (this.xSpeed < 0) { 
      drawEye(this.x + offset, this.y + offset);
      drawEye(this.x + offset, this.y + scale - offset - eyeSize);
    } else if (this.ySpeed > 0) { 
      drawEye(this.x + offset, this.y + scale - offset - eyeSize);
      drawEye(this.x + scale - offset - eyeSize, this.y + scale - offset - eyeSize);
    } else if (this.ySpeed < 0) { 
      drawEye(this.x + offset, this.y + offset);
      drawEye(this.x + scale - offset - eyeSize, this.y + offset);
    }
  };

  function drawEye(x, y) {
    ctx.fillRect(x, y, 4, 4);
  }

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    if (this.total >= 1) {
      this.tail[this.total - 1] = { x: this.x, y: this.y };
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x >= canvas.width) this.x = 0;
    if (this.y >= canvas.height) this.y = 0;
    if (this.x < 0) this.x = canvas.width - scale;
    if (this.y < 0) this.y = canvas.height - scale;
  };

  this.changeDirection = function (direction) {
    switch (direction) {
      case 'Up':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale;
        }
        break;
      case 'Down':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale;
        }
        break;
      case 'Left':
        if (this.xSpeed === 0) {
          this.xSpeed = -scale;
          this.ySpeed = 0;
        }
        break;
      case 'Right':
        if (this.xSpeed === 0) {
          this.xSpeed = scale;
          this.ySpeed = 0;
        }
        break;
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      return true;
    }
    return false;
  };

  this.checkCollision = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        return true;
      }
    }
    return false;
  };
}

window.addEventListener('keydown', e => {
  const direction = e.key.replace('Arrow', '');
  snake.changeDirection(direction);
});

function handleDirection(dir) {
  snake.changeDirection(dir);
}

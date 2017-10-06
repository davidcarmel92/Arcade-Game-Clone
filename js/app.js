"use strict";

let gameActive = false;
let startOfGame = true;

function startLevel(){
  /*
  Start of game.
  */
  if(startOfGame===true){
    $('#startModal').show();
  }
  $('#input_button').click(function(){
    startOfGame=false;
    gameActive=true;
    $('#startModal').hide();
  });
  $('#loseModal').hide();
  $('#winModal').hide();
  $('#level').html("Level: "+player.level);
  $('.lives').html("Lives: "+player.lives);
  checkLevel();
}

function checkLevel(){
  /*
  This function check the game level and
  adjusts the game accordingly.
  */
  if(player.level===1){
    initiateGame();
  }
  if(player.level===4){
    level4();
  }
  if(player.level===7){
    level7();
  }
  if(player.level===10){
    level10();
  }
  if(player.level===11){
    $('#level').hide();
    gameActive=false;
    $('#winModal').show();
  }
}

// Variables for enemies on game start
let enemyStart = -120;
let possibleSpeed;

function initiateGame(){
  /*
  creates the enemy bugs at the start of the first level.
  */
  possibleSpeed = [85,155,175,215,275];
  bug = new Enemy(enemyStart,startingY(),randomSpeed());
  bug1 = new Enemy(enemyStart,startingY(),randomSpeed());
  bug2 = new Enemy(enemyStart,startingY(),randomSpeed());
  bug3 = new Enemy(enemyStart,startingY(),randomSpeed());
  allEnemies.push(bug,bug1,bug2,bug3);
}

function level4(){
  /*
  adds enemy bug and changes enemy speed for increased difficulty.
  */
  possibleSpeed = [185,235,295,375];
  bug4 = new Enemy(enemyStart,startingY(),randomSpeed());
  allEnemies.push(bug4);
}

function level7(){
  possibleSpeed = [95,355,305,485];
  bug5 = new Enemy(enemyStart,startingY(),randomSpeed());
  allEnemies.push(bug5);
}

function level10(){
  possibleSpeed = [95,375,495,515];
  bug6 = new Enemy(enemyStart,startingY(),randomSpeed());
  allEnemies.push(bug6);
}

function randomSpeed() {
  /*
  randomly selects the speed of each enemy.
  */
  let startingSpeed = Math.floor(Math.random()*possibleSpeed.length);
  return possibleSpeed[startingSpeed];
}

function startingY(){
  /*
  randomly selects the starting Y position
  of each enemy.
  */
  const possibleY = [55,138,221];
  let position = Math.floor(Math.random()*possibleY.length);
  return possibleY[position];
}

var Character = function(locx,locy) {
  this.x = locx;
  this.y = locy;
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//enemy variables
let bug,bug1,bug2,bug3,bug4,bug5,bug6;
let allEnemies = [];

var Enemy = function(locx,locy,bugSpeed) {
  /*
  Initiates enemies.
  */
    Character.call(this,locx,locy);
    this.speed = bugSpeed;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.constructor = Enemy;
Enemy.prototype = Object.create(Character.prototype);

Enemy.prototype.update = function(dt) {
    /*
    Updates the each enemy's position and checks collisions
    as well as calling the addnewenemy function.
    */
    this.x += dt*this.speed;
    this.checkCollisions();
    this.resetEnemy();

};

Enemy.prototype.checkCollisions = function(){
  /*
  This function compares the position of the
  player and the position of every enemy and
  calls the playerBugCollsion function if
  there is a collision.
  */
  let xDifference = Math.abs(this.x-player.x);
  let yDifference = Math.abs(this.y-player.y);
  if(yDifference<50 && xDifference<75){
    player.bugCollsion();
  }
};

Enemy.prototype.resetEnemy = function(){
  /*
  This function adds a new enemy to the game when
  a previous enemy moves off the screen.
  */
  if(this.x>510){
    this.x = -130;
    this.y = startingY();
    this.speed = randomSpeed();
  }
};

var Player = function(locx,locy) {
  /*
  Initiates player.
  */
  Character.call(this,locx,locy);
  let level = 1;
  let lives = 3;
  this.lives = lives;
  this.level = level;
  this.sprite = 'images/char-boy.png';
};

Player.prototype.constructor = Player;
Player.prototype = Object.create(Character.prototype);

Player.prototype.bugCollsion = function() {
  /*
  Resets the player and and decreases the number of lives.
  */
  this.x = 200;
  this.y = 400;
  this.lives-=1;
  $('.lives').html("Lives: "+this.lives);
  if(this.lives===0){
    gameActive=false;
    $('#loseModal').show();
  }
};

Player.prototype.handleInput = function(move) {
  /*
  handles input and moves player.
  */
    if(move==='up'){
      this.up();
    }
    if(move==='down'){
      this.down();
    }
    if(move==='right'){
      this.right();
    }
    if(move==='left'){
      this.left();
    }
};

Player.prototype.up = function() {
  /*
  Moves player up and increases level if player
  moves into water
  */
  if(this.y!=68){
    this.y -=83;
  }
  else{
    this.level+=1;
    startLevel();
    this.x = 200;
    this.y = 400;
  }
};

Player.prototype.down = function() {
  if(this.y!=400){
    this.y +=83;
  }
};

Player.prototype.right = function() {
  if(this.x!=402){
    this.x +=101;
  }
};

Player.prototype.left = function() {
  if(this.x!=-2){
    this.x -=101;
  }
};


// initiate player
let player = new Player(200, 400);


document.addEventListener('keyup', function(e) {
  /*
  This listens for key presses and sends the keys to the
  Player.handleInput() method.
  */
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    let move = e.keyCode;
    player.handleInput(allowedKeys[move]);
});

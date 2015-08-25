//Declare all variables that are going to be constant and hence, immutable.
var X_OFFSET = 15,
    Y_OFFSET = 83,
    PRIZE_X_ARRAY = [115, 215, 315, 415, 615, 715, 815],
    HIDE = -101,
    Y_ARRAY = [65, 148, 231, 314],
    PLAYER_X = 400,
    PLAYER_Y = 390,
    WATER_ARRAY = [-100, 0, 100, 200, 300, 500, 600, 700, 800],
    ENEMY_X_FORWARD = 115,
    ENEMY_X_REVERSE = 700,
    LIFE_NUMBER = 3;

/* Define Enemy class. All instances of the enemy class will acquire the 
   variables declared within the class.
*/
var Enemy = function() {

    this.sprite = 'images/enemy-bug.png';
    this.x = ENEMY_X_FORWARD;
    this.y = Y_ARRAY[Math.floor(Math.random() * 4)];
    this.speed = (Math.floor(Math.random() * 2) + 1) * 100;

};

/*
  This method displays the bugs and their movement across the game canvas
  @param {number} dt : Time delta for smooth animation and movement of bugs
*/
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;

    /*Once the bugs cross a particular threshold(x-coord > 705), 
	  replace their image and reverse their direction of movement.
	*/
    if (this.x > 705) {

        this.sprite = 'images/enemy-bug-left.png';
        this.x = ENEMY_X_REVERSE;
        this.speed = -(Math.floor(Math.random() * 2) + 1) * 100;

    } else if (this.x < 100) {

        this.sprite = 'images/enemy-bug.png';
        this.x = ENEMY_X_FORWARD;
        this.speed = (Math.floor(Math.random() * 2) + 1) * 100;
        this.x += this.speed * dt;
        this.y = Y_ARRAY[Math.floor(Math.random() * 4)];
    }

};

// Draw the enemy on the screen
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

/* 
Define Player class. All instances of this class will acquire the variables
declared in this class.
*/

var Player = function() {

    this.x = PLAYER_X;
    this.y = PLAYER_Y;
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.tab = 0;


};

Player.prototype.update = function(dt) {

    //When the player and enemy-bugs collide, the player is reset and a life is lost
    for (i in allEnemies) {
        if ((this.x < allEnemies[i].x + 50 && this.y < allEnemies[i].y + 50) && (this.x + 50 > allEnemies[i].x && this.y + 50 > allEnemies[i].y)) {
            life.die();
            player.reset();
        }
    }


    /*
	When the player collects a gift/prize, call function gatherPrize.
    @param {number} this.x: X Coordinate of player.
	@param {number} this.y: Y Coordinate of player.
	*/
    allPrizes.forEach(function(prize) {
        prize.gatherPrize(player.x, player.y);
    });

    //When the player object reaches the row filled with water, a life is lost and the player is reset
    if ((WATER_ARRAY.indexOf(this.x) > 0) && (this.y === -25)) {

        life.die();
        player.reset();

    }

};


//Display image of the player and score

Player.prototype.render = function() {


    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = '18px Georgia';
    ctx.fillText('Score: ' + this.score, 700, 30);

    //Display image of the key when player collects all the prizes
    if (this.tab === 7) {
        ctx.drawImage(Resources.get("images/Key-Small.png"), this.x + 30, this.y + 90);
    }

};

//Function to reset the player upon losing a life/collision with the enemy bug/reaching water blocks
Player.prototype.reset = function() {

    this.x = PLAYER_X;
    this.y = PLAYER_Y;

};


//Function for player's movement upon keypress
Player.prototype.handleInput = function(key) {

    switch (key) {
        case 'left':
            if (this.x > 0)
                this.x -= 100;
            break;
        case 'up':
            if (this.y > 0)
                this.y -= 83;
            break;
        case 'right':
            if (this.x < 800)
                this.x += 100;
            break;
        case 'down':
            if (this.y < 383)
                this.y += 83;
            break;
            /*
		  Upon pressing spacebar, game is reset.
          Therefore, score, tab and life number are reset 
          to their original values.		  
		*/
        case 'spacebar':
            life.number = 3;
            player.score = 0;
            player.tab = 0;
            player.reset();
            break;
        default:
            return;
    }
};

//Life class. Displays and tracks number of hearts/lives
var Life = function() {

    this.number = LIFE_NUMBER;
};

//Draw the 3 hearts
Life.prototype.render = function() {

    for (x = 0; x < this.number; x++) {
        ctx.drawImage(Resources.get('images/Heart.png'), x * 45, 0, 50, 50);
    }

};

/*
Decrease heart/life number every time the player collides 
with an enemy bug or reaches the row with water blocks

*/

Life.prototype.die = function() {


    if (this.number > 0) {
        this.number--;
        player.reset();
    }
};



/*
  Prize class. This class displays the prizes and 
  keeps tab on the score achieved by the player.
  @param {image} image: Image of the prize
  @param {number} x: X Coordinate of the prize
  @param {number} y: Y Coordinate of the prize
*/
var Prize = function(image, x, y) {

    this.sprite = image;
    this.x = x;
    this.y = y;

};

//Draw the prizes on the canvas
Prize.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};


/* When player collects each gift/prize, vanish the image of the prize
   by setting it's coordinates to -101, increase the score and the tab.
*/
Prize.prototype.gatherPrize = function(playerX, playerY) {

    /*
	The offset values are used to adjust the image of the prizes in accordance
	with the dimensions of the player image as both the image's height and
	width vary.
	*/
    if (((playerX + X_OFFSET) === this.x) && ((playerY + Y_OFFSET) === this.y)) {
        this.x = HIDE;
        this.y = HIDE;
        player.score++;
        player.tab++;

    }

};


//Function to end the game when the number of hearts is 0.
var gameOver = function() {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.font = 'Bold 35px Verdana';
    ctx.fillStyle = '#000000';
    ctx.fillText('Game Over :(', 100, 250);
    ctx.font = 'Bold 35px Verdana';
    ctx.fillText('Score: 0', 100, 350);
	ctx.fillText('Press space to play again',100,450);
};

//Function to finish the game and display congrats message
var gameFinish = function() {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.font = 'Bold 30px Verdana';
    ctx.fillStyle = '#000000';
    ctx.fillText('Congrats, You are now a front end ninja', 100, 250);
    ctx.font = 'Bold 30px Verdana';
    ctx.fillText('Score: 0' + player.score, 100, 350);
	ctx.fillText('Press space to play again',100,450);

};






// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();

var allEnemies = [enemy1, enemy2, enemy3];
var player = new Player();
var life = new Life();
var prize = new Prize();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

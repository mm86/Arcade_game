// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    
	//Set the location and speed for the bugs in 3 rows
  
    this.x = -50;
    this.row = Math.floor(Math.random() * 3) + 1;                
    this.y = 83 * this.row - 18; 
    this.speed = [30,100,170,250,320];
}

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed[Math.round(Math.random()*4)]*dt;
    //restart the bug movement once they go beyond the width of the canvas
    if(this.x > 500) {
        this.x = -50;
        this.row = Math.floor(Math.random() * 3) + 1;  
        this.y = 83 * this.row - 18; 
    }
}
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 420;
	this.score = 0;
}

Player.prototype.update = function(dt) {
    this.x*dt;
    this.y*dt;
	
	//If player collides with bugs, reset player position.


    for(var i in allEnemies) {
      if((player.x - allEnemies[i].x < 50 && player.y - allEnemies[i].y < 50) && (player.x - allEnemies[i].x > -50 && player.y - allEnemies[i].y > -50)) {
        player.reset();
        }
	}
	
	//If player touches a gem, increment score and make the gem disappear
	if(player.x === 200 && player.y === 150){
	player.scores();
	}
	
	if(player.x === 200 && player.y === 100){
	player.reset();
	}
	

}
Player.prototype.handleInput = function (num) {
    //if statements prevent our player from falling off the game board.
    switch(num) {
        case 'left':
            if(this.x > 15)
            this.x-=100;
            break;
        case 'up':
            if(this.y > -5)
            this.y-=90;
            break;
        case 'right':
            if(this.x < 400)
            this.x+=100;
            break;
        case 'down':
            if(this.y < 375)
            this.y+=90;
            break;
        default:
            return;
    }
}
Player.prototype.reset = function() {
    this.x = 100;
    this.y = 420;
}

Player.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "Bold 20px Georgia";
    ctx.fillText("Score: " + this.score, 200, 25);	
}

Player.prototype.scores = function() {

    if (prize.visible){
	
    this.score++;
	prize.disappear();

	
	}
	
}

//Prizes in the form of diamonds as of now. Will later change to projects 1-6

var Prize = function() {

    this.sprite = 'images/Gem Blue.png';
    this.visible = true;
	//Set the location for the gems
    
    this.x = 200;
    this.y = 150;
	
	
	
}

// Parameter: dt, a time delta between ticks
Prize.prototype.update = function(dt) {
   
}

// Draw the enemy on the screen, required method for game
Prize.prototype.render = function() {
   if(this.visible) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	
}

Prize.prototype.disappear = function () {

    this.visible = false;
    
};





// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var enemy5 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
var player = new Player();
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

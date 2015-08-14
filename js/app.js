// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
	
	//set the speed and locations for the bugs
	this.x = -101;  
    this.y = [65,148,231][Math.floor(Math.random() * 3)];
	//speed will increment as the player reaches higher levels to make the game more challenging
    this.speed = (Math.floor(Math.random() * 2) + 1) * 100;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	this.x += this.speed*dt;
    //restart the bug movement once they go beyond the width of the canvas
    if(this.x > 500) { 
		this.x = -101;       
        this.y = [65,148,231][Math.floor(Math.random() * 3)];

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
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
	
    
	this.x = 0;
	this.y = 397;
	
	this.score = 0;
	
	
}

// Update the players position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	
	
	this.sprite = window.myAvatar;
	
	//check for collision with enemies
    for(i in allEnemies) {
        if((player.x - allEnemies[i].x < 50 && player.y - allEnemies[i].y < 50) && (player.x - allEnemies[i].x > - 40 && player.y - allEnemies[i].y > - 40)) {
            life.die();                                 
        }
    }
	
	//check for acquring gems and projects
	
	if((player.x === prize.OrangeX && player.y === prize.OrangeY)||(player.x === prize.GreenX && player.y === prize.GreenY)||(player.x === prize.BlueX && player.y === prize.BlueY)){
	
	  
	  prize.die(player.x,player.y);
	  
	}
	
	
	//gameover when hit the water
	
        if(player.y === -18) {
         
           player.reset();
        }
		
     
	
	
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    
	if (life.number >0){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	ctx.font = '18px Georgia';
    ctx.fillText('Score: ' + this.score, 300, 30);
	}
	else if(life.number <= 0){
	
	  console.log(this.number);
	  ctx.clearRect(0, 0, 300, 30);
      ctx.font = 'Bold 16px Verdana';
      ctx.fillText('Game Over. Score: ' + this.score, 300, 30);
	  
	}
	
	
}

Player.prototype.reset = function() {
    
	this.x = 0;
	this.y = 397;
	
}



Player.prototype.handleInput = function(num) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	
	//switch and if statements to ensure player does not fall off the game
    switch(num) {
        case 'left':
            if(this.x > 0)
            this.x-=100;
            break;
        case 'up':
            if(this.y > 0)
            this.y-=83;
            break;
        case 'right':
            if(this.x < 400)
            this.x+=100;
            break;
        case 'down':
            if(this.y < 400)
            this.y+=83;
            break;
        default:
            return;
    }
}


//Life class to track number of hearts
var Life = function() {
    
    this.number = 3;
}

//draws the hearts for each life.
Life.prototype.render = function() {
   
    for(x = 0; x < this.number; x++) {
        ctx.drawImage(Resources.get('images/Heart.png'), x * 45, 5, 50, 50);
        
    }
   
}

Life.prototype.die = function () {
    
	if(this.number > 0) {
	
	this.number--;
	player.reset();
	
	}
	
	
	
	
}


//Prize class for finished projects, gems etc


var Prize = function() {
    
    this.GreenX = [0,100,200,300,400][Math.floor(Math.random() * 5)];
	this.GreenY = 65;
	
	
	this.BlueX = [0,100,200,300,400][Math.floor(Math.random() * 5)];
	this.BlueY = 148; 
 
    this.OrangeX = [0,100,200,300,400][Math.floor(Math.random() * 5)];
	this.OrangeY = 231; 
	this.destroyed = false;

}


Prize.prototype.render = function() {
   
   
    ctx.drawImage(Resources.get('images/Gem Green.png'), this.GreenX, this.GreenY);
	ctx.drawImage(Resources.get('images/Gem Blue.png'), this.BlueX, this.BlueY);
	ctx.drawImage(Resources.get('images/Gem Orange.png'), this.OrangeX, this.OrangeY);
	
        
    
   
}

Prize.prototype.die = function(x,y) {

    this.destroyed = true;
	
	if (x===this.OrangeX && y===this.OrangeY){
	this.OrangeX = -101;
	this.OrangeY = -101;
	player.score++;
	}
	else if(x===this.GreenX && y===this.GreenY){
	this.GreenX = -101;
	this.GreenY = -101;
	player.score++;
	}
	else{
	this.BlueX = -101;
	this.BlueY = -101;
	player.score++;
    }
}






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

//variables
var player, playerImageRight, playerImageLeft, playerDeadRightImage, playerDeadLeftImage;
var zombieRightImage, zombieLeftImage;
var zombiesGroup;
var backgroundImage;
var zombiesGroup = [];
var bulletsGroup = [];

var INTRO = 3
var WON = 2;
var PLAY = 1;
var END = 0;
var playP = true;
var game2On = true
var LEVEL2 = 4
var bullet

var playerFaceingRight = true;
var LEVEL2INTRO = 5
var WAITFORUSERINPUTENTER = 6;
var QUESTION1 = 7;
var QUESTION2 = 8;
var QUESTION3 = 9;
var COMPLETEDTHEGAME = 10;
var MAINMENU = 12
var STORY = 11;
var score = 0;
var totalScore = 0
var question1NotAnswered = true;
var question1AnsweredCorrectly;
var question2NotAnswered = true;
var question2AnsweredCorrectly;
var question3NotAnswered = true;
var question3AnsweredCorrectly;
var bulletsRemaining = 800;
var gameStateLocal;
var pressedEnterInTheEnd = false
var game2class;
var gunSound
var gameState = MAINMENU;

var StartButton;
//loading the images
function preload()
{
	playerImageLeft = loadImage('./flip/player.png');
	playerImageRight = loadImage("./player.png");

	zombieLeftImage = loadAnimation("./flip/1.png", "./flip/2.png", "./flip/3.png", "./flip/4.png", "./flip/5.png", "./flip/6.png");
	zombieRightImage = loadAnimation("./1.png", "./2.png", "./3.png", "./4.png", "./5.png", "./6.png");

	backgroundImage = loadImage("spookyNight.jpg");
	backgroundImage2 = loadImage("spookyNight2.jpg");

	playerDeadRightImage = loadImage("playerDead.png");
	playerDeadLeftImage = loadImage("flip/playerDead.png");

	gunSound = loadSound("GunSound.mp3");
}
//creating canvas and creating the player
function setup() {
	createCanvas(800, 500);

	player = createSprite(400, 450);
	player.addImage(playerImageRight);
	player.scale = 0.25;  
	console.log(document.cookie)


}


function draw() {
  rectMode(CENTER);
  background(backgroundImage);
 //calling the playerControl function to control the player movements and actions when in PLAY state 
  if(gameState === PLAY){
	  playerControl();
	  
  }
  //calling deathWhenTouched function
  deathWhenTouched();
  //getting a random number 1 or 2 and storing it in choise variable
 choise = Math.round(random(1,2));
 
 //for things to happen in different states and needs to be done before caling drawSprites function
 if(gameState === PLAY || gameState === END){
	if(frameCount%10 === 0 && score <= 100){
		
		if(choise === 1){
			spawnZombiesFromRight();
		}else{
			spawnZombiesFromLeft();
		}
	}else if(score === 25){
		gameState = WON
		saveHighScore();
	}
 }


 //calling drawSprites to draw all the sprites on the screen 
 drawSprites();
 
 //things tohappen in different states and needs to be done after calling drawSprites function
 if(gameState === END){
	 totalScore = score+bulletsRemaining/2
	if(document.cookie < totalScore){
		saveHighScore();
	}
	fill("white");
	text("Game Over", 365, 200);
	text("Score: "+totalScore, 365, 210);
 }else if(gameState === WON){
	 totalScore = score+Math.round(bulletsRemaining/2);
	 fill("white");
	 text("You Won", 350, 200);
	 for(var i = 0; i < zombiesGroup.length; i++){
		 zombiesGroup[i].destroyZombie();
	 }
	 text("press enter to continue...", 5, 400);
	 if(keyDown("enter")){
		 gameState = LEVEL2;
	 }
 }else if(gameState === PLAY){
	 fill("white");
	 text("Score: " + score+" + "+Math.round(bulletsRemaining/2), 5, 15);
	 text("Bullets Remaining: "+bulletsRemaining, 5, 25)
	 if(document.cookie){
		 text("High Score: "+ document.cookie, 5, 35)
	 }
 }else if(gameState === INTRO){
	 background("white");
	 intro()
 }else if(gameState === LEVEL2){
	 secondGame();
 }else if(gameState === LEVEL2INTRO){
	 level2Intro();
 }else if(gameState === WAITFORUSERINPUTENTER){
	waitforuserinputenter(gameStateLocal);
 }else if(gameState === QUESTION1){
	 question1();
 }else if(gameState === QUESTION2){
	 question2()
 }else if(gameState === QUESTION3){
	 question3();
 }else if(gameState === COMPLETEDTHEGAME){
	 gameEnd();
 }else if(gameState === STORY){
	 storyIntro();
 }else if(gameState === MAINMENU){
	 menu();
 }
 
}

//to spawn zombies from right facing the player
function spawnZombiesFromRight(){
	var zombie = new Zombie(zombieRightImage, true);
	zombiesGroup.push(zombie);
}

//to spawn zombies from left facing the player
function spawnZombiesFromLeft(){
	var zombie = new Zombie(zombieLeftImage, false);
	zombiesGroup.push(zombie);
}
//to make the player die when the zombie touch him and to make the zombies die when the bullet collides with them
function deathWhenTouched(){
	for(var i = 0;i < zombiesGroup.length; i++){
		if(zombiesGroup[i].isCollidedWithPlayer()){
			player.addImage(playerDeadLeftImage);
			gameState = END;
		}
	}
	for(var i = 0; i < bulletsGroup.length; i++){
		if(bulletsGroup[i].checkCollisionWithZombies()){
			score++;
		}
	}
}
//for attacking the zombies
function bulletAttackToRight(){
	var bullet = new Bullet(true, [player.x, player.y]);
	bulletsGroup.push(bullet);
}
function bulletAttackToLeft(){
	var bullet = new Bullet(false, [player.x, player.y]);
	bulletsGroup.push(bullet)
}

//for controlling the movements and actions of the player
function playerControl(){
	if(keyDown("right") && player.x < 501){
		player.x+=2;
		player.addImage(playerImageRight);
		playerFaceingRight = true;
	}else if(keyDown("left") && player.x > 299){
		player.x-=2;
		player.addImage(playerImageLeft);
		playerFaceingRight = false;
	}else if(keyDown("up") && player.y > 369){
		player.y-=2;
	}else if(keyDown("down") && player.y < 450){
		player.y+=2;
	}
	if(keyWentDown("space") && bulletsRemaining > 0){
		bulletsRemaining-=1;
		gunSound.play();
		if(playerFaceingRight === true){
			bulletAttackToRight();
		}else{
			bulletAttackToLeft();
		}
	}
	if(bulletsRemaining === 0){
		gameState = END;
	}
}

//for saving the highscore of the player by using cookies
function saveHighScore(){
	document.cookie = score+Math.round(bulletsRemaining/2);
}

//to give the introdunction to the game
function intro(){
	fill("red");
	textSize(15);
	text("Game Features", 5, 15);
	fill("red");
	textSize(10);
	fill("Green")
	text("> This game uses cookies to save high score.", 5, 30);
	text("> The zombie hit by an bullet will only die, leaving others alive. Made possible by using arrays and custom classes for zombies", 5, 40);
	text("> Spawns zombies from both the sides", 5, 50);
	text("> Player can move up, down, right, left.", 5, 60);
	text("> The zombies Spawn even after the player loses in order to maintain the logic that the player dead but zombies are still alive. If Zombies stop spawning it would be like the ", 5, 70);
	text("   zombies are dead because the player is dead", 5, 80);
	text("> Need to add animations and make the story continue after the player killed all the zombies, which is to find and use the cure to make things right.", 5, 90)
	text("> Has Bullets Limit. The Game gets over when the bullets are fully used.", 5, 100)
	text("> The total score = score + round(bullets remaining / 2)", 5, 110);
	text("*This is the part 1 of the game. The next part(the last one) is being developed.", 5, 120)
	text("*These notes above are for development purpose", 5, 130)
	textSize(15);
	fill("Blue")
	text("Press arrow keys to move", 5, 150);
	text("Press Space to shoot", 5, 165);
	text("Press Enter to start",5, 180);
	if(keyDown("enter")){
		gameState = PLAY;
	}


}
function game2(){
	secondGame();
}
function secondGame(){
	background("black")
	fill("red");
	textSize(15);
	text("You killed all the zombies on your way.",5, 15);
	text("Go ahead and solve the mysterious puzzle and unlock the crate having the cure.", 5, 35);
	text("Press Enter to continue...", 5, 70);
	if(keyWentDown("enter")){
		gameState = LEVEL2INTRO;
	}
}
function level2Intro(){
	background("black")
	text("To get the crate you have to answer three questions.", 5, 15);
	text("press enter to continue or press backspace to previous menu...", 5, 30);
	if(keyWentDown("enter")){
		gameState = QUESTION1
	}else if(keyWentDown("backspace")){
		gameState = LEVEL2;
	}
}

function question1(){
	background("grey");
	textSize(20);
	fill("black");
	text("Who is the bodygaurd of the owner of the chemical factory \"Tom Genetics Laboratory\"?", 5, 25);
	textSize(20);
	fill("violet");
	text("1) Charles", 5, 50);
	text("2) Tom Hardy", 5, 70);
	text("3) Robert", 5, 90);
	text("4) None of the above", 5, 110);
	if(question1NotAnswered){
		if(keyWentDown("1") || keyWentDown("2") || keyWentDown("4")){
			text("Incorrect answer. You failed to save the peope", 5, 140);
			question1AnsweredCorrectly = false
			question1NotAnswered = false;
		}else if(keyWentDown("3")){

			question1AnsweredCorrectly = true
			question1NotAnswered = false;

		}
	}
	if(question1AnsweredCorrectly === false){
		text("Incorrect answer. You failed to save the peope", 5, 140);

	}
	if(question1AnsweredCorrectly){
		text("Correct Answer. You may proceed.", 5, 140)
		text("Press enter to continue", 5, 160);
		if(keyWentDown("enter")){
			gameState = QUESTION2;
		}
	}

}

function question2(){
	background("grey");
	textSize(25);
	fill("black");
	text("What is the name of the new virus they created?", 5, 25);
	textSize(20);
	fill("violet");
	text("1) Corona Virus", 5, 50);
	text("2) Influenza virus", 5, 70);
	text("3) Curaelium Aginatora virus", 5, 90);
	text("4) Zombieizo Nitroid virus", 5, 110);
	if(question2NotAnswered){
		if(keyWentDown("1") || keyWentDown("2") || keyWentDown("4")){
			question2AnsweredCorrectly = false
			question2NotAnswered = false;
		}else if(keyWentDown("3")){

			question2AnsweredCorrectly = true
			question2NotAnswered = false;

		}
	}
	if(question2AnsweredCorrectly === false){
		text("Incorrect answer. You failed to save the peope", 5, 140);

	}
	if(question2AnsweredCorrectly){
		text("Correct Answer. You may proceed.", 5, 140)
		text("Press enter to continue", 5, 160);
		if(keyWentDown("enter")){
			gameState = QUESTION3;
		}
	}
}

function question3(){
	background("grey");
	textSize(25);
	fill("black");
	text("Because of what reason he created this virus", 5, 25);
	textSize(20);
	fill("violet");
	text("1) For killing people who hate him", 5, 50);
	text("2) For is son who wanted to kill people who were not his friends", 5, 70);
	text("3) Just for research", 5, 90);
	text("4) None of the above", 5, 110);
	if(question3NotAnswered){
		if(keyWentDown("1") || keyWentDown("3") || keyWentDown("4")){
			text("Incorrect answer. You failed to save the peope", 5, 140);
			question3AnsweredCorrectly = false
			question3NotAnswered = false;
		}else if(keyWentDown("2")){

			question3AnsweredCorrectly = true
			question3NotAnswered = false;

		}
	}
	if(question3AnsweredCorrectly === false){
		text("Incorrect answer. You failed to save the peope", 5, 140);

	}
	if(question3AnsweredCorrectly){
		text("Correct Answer. You may proceed.", 5, 140)
		text("Press enter to continue", 5, 160);
		if(keyWentDown("enter")){
			gameState = COMPLETEDTHEGAME;
		}
	}
}

function gameEnd(){
	if(pressedEnterInTheEnd === false){
		background("black");
		text("You won the puzzle and saved the people", 5, 15);
		text("Press enter to continue", 5, 30);
		if(keyWentDown("enter")){
			pressedEnterInTheEnd = true
			gameCredits();
		}
	}
	else{
		gameCredits();
	}
	}

function gameCredits(){
	background("white");
	fill("red");
	textSize(35);
	text("This game is created by Sudharsan S.", 30, 200);
	text("Thank you for playing my game!!!", 30, 250);
	text("You may close this tab to exit this game", 70, 300)
}

function storyIntro(){
	background(backgroundImage2);
	fill("white")
	textSize(20);
	text("Story", 5, 20);
	fill("Yellow");
	textSize(10);
	text("The city is affected by a dangerous virus and it turned people into zombies\nIt was created by the chemical factory \"Tom Genetics Laboratory\"\nThe owner of the company is so selfish that he gives a small amount sallary to his bodygaurd \"Robert\".\nThe owner of the company's son was so evil that he ordered the employees of the company to create \nthis virus to kill people using this virus who humilated him. But unfortunately the creation of the virus was a failure and it turned all the hosts kept\nfor testing in the company become a zombie.\nSo the company tried to dispose it.\n They disposed in a dirt pond where a dog licked it and became a zombie too.\nIt bite all the animals and people who it saw on its way.\nThe people of the whole city got affected and become zombies.\nThe virus spreaded all over the city over the night itself.\nYou were the one who escaped from getting affected by the virus. There is a cure for the virus that the researchers created.\nTo get the cure you need to kill all the zombies on your way.\n\n\n\n\nPress enter to fight with zombies. Press arrow keys to move and space to shoot.\n\n\n\n\n\nPress A to show advanced features about the game", 5, 40);
	if(keyWentDown("Enter")){
		gameState = PLAY;
	}if(keyWentDown("A")){
		window.open("https://sudharsansaravanan9122008.github.io/Rapid-Survival-Info/")
	}
}

function menu(){
	background(backgroundImage2);
	fill("Yellow");
	textSize(30);
	text("Rapid Survival", 300, 45);
	text("Press Enter to start the game", 225, 80)
	if(keyWentDown("Enter")){
		gameState = STORY
	}
}

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var pipesGroup, pipesImage;
var goombasGroup, goombaImage;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running =   loadAnimation("Mario.png","Mario copy 2.png","Mario copy 3.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  pipesImage = loadImage("Warp_pipe.png");

  goombaImage = loadImage("Goomba.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1200, 800);
  
  mario = createSprite(50,180,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;
  
  ground = createSprite(600,700,1200,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(600,710,1200,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  pipesGroup = new Group();
  goombasGroup = new Group();
  
  score = 0;
}

function draw() {
  //mario.debug = true;
  background(0);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && mario.y >= 159) {
      mario.velocityY = -12;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(invisibleGround);
    spawnClouds();
    spawnpipes();
    spawnGoombas();
  
    if(pipesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    pipesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the mario animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    pipesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnpipes() {
  if(frameCount % 120 === 0) {
    var pipe = createSprite(600,650,10,40);
    pipe.addImage(pipesImage);
    //pipe.debug = true;
    pipe.velocityX = -(6 + 3*score/100);
    
    //generate random pipes
    //assign scale and lifetime to the pipe           
    pipe.scale = 0.1;
    pipe.lifetime = 300;
    //add each pipe to the group
    pipesGroup.add(pipe);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  pipesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
function spawnGoombas() {
  if(frameCount % 240 === 0) {
    var goomba = createSprite(600,650,10,40);
    goomba.addImage(goombaImage);
    //pipe.debug = true;
    goomba.velocityX = -(6 + 3*score/100);
    
    //generate random pipes
    //assign scale and lifetime to the pipe           
    goomba.scale = 0.1;
    goomba.lifetime = 300;
    //add each pipe to the group
    goombasGroup.add(goomba);
  }
}
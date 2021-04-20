/***********************************************************************************
  Little Red
  by An Duong

  Uses the p5.2DAdventure.js class and collision map. 

  This is a project focusing on the gender violence women face daily. It is recreated through a modern retelling of Little Red Riding Hood as a metaphor of being preyed upon (unknowingly). 
  
------------------------------------------------------------------------------------
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;


var catRingCollected;
var taserCollected;
var phoneCollected;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

// Setup the adventure manager
function setup() {
  createCanvas(windowWidth, windowHeight);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  batSprite = createSprite(width/3 + 650, height/2);
  batSprite.addAnimation('regular', loadAnimation('assets/bat.png'));

  bunnySprite = createSprite(width/3 + 300, height/2 + 150);
  bunnySprite.addAnimation('regular', loadAnimation('assets/bunny.png'));

  owlSprite = createSprite(width/3 + 50, height/2 - 50);
  owlSprite.addAnimation('regular', loadAnimation('assets/owl.png'));

  clockSprite = createSprite(width/2 + 500, height/2);
  clockSprite.addAnimation('regular', loadAnimation('assets/clockOut.png'));

  catRingSprite = createSprite(width/2, height/2 + 40);
  catRingSprite.addAnimation('regular', loadAnimation('assets/catRing.png'));

  phoneSprite = createSprite(width/2 + 350, height/2 + 40);
  phoneSprite.addAnimation('regular', loadAnimation('assets/phone.png'));

  taserSprite = createSprite(width/2 - 350, height/2 + 40);
  taserSprite.addAnimation('regular', loadAnimation('assets/taser.png'));

  wolfSprite = createSprite(width/2, height/2+ 150, 80, 80);

  wolfSprite.addAnimation('moving', loadAnimation('assets/avatars/man1.png', 'assets/avatars/man2.png', 'assets/avatars/man3.png', 'assets/avatars/man4.png'));
  wolfSprite.velocity.x = 3;

  // create a sprite and add the 3 animations
  playerSprite = createSprite(width/2, height/2 + 200, 80, 80);

  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter
  playerSprite.addAnimation('regular', loadAnimation('assets/avatars/littleRed1.png', 'assets/avatars/littleRed3.png', 'assets/avatars/littleRed4.png', 'assets/avatars/littleRed5.png', 'assets/avatars/littleRed1.png'));
  playerSprite.addAnimation('still', loadAnimation('assets/avatars/littleRed6.png'));
  playerSprite.addAnimation('upDown', loadAnimation('assets/avatars/littleRed6.png'));

  text1 = loadImage('assets/text1.png');
  text2 = loadImage('assets/text2.png');
  text3 = loadImage('assets/text3.png');
  text4 = loadImage('assets/text4.png');
  text5 = loadImage('assets/text5.png');
  text6 = loadImage('assets/text6.png');
  text7 = loadImage('assets/text7.png');
  text8 = loadImage('assets/text8.png');
  text9 = loadImage('assets/text9.png');

  werewolf = loadImage('assets/werewolf.png');

  taserCollected = false;
  catRingCollected = false;
  phoneCollected = false;

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" &&
      adventureManager.getStateName() !== "Village" &&
      adventureManager.getStateName() !== "Bakery2" &&
      adventureManager.getStateName() !== "Forest1" ) {
      
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  // move side to side
  //walk to the right
  if(keyIsDown(RIGHT_ARROW)) {
    playerSprite.changeAnimation('regular');
    //flip to go right
    playerSprite.mirrorX(1);
    playerSprite.velocity.x = 10;
  }
  //walk to the left
  else if(keyIsDown(LEFT_ARROW)) {
    playerSprite.changeAnimation('regular');
    //flip to go left
    playerSprite.mirrorX(-1);
    playerSprite.velocity.x = -10;
  }
  //move up and down
  //going down
  else if(keyIsDown(DOWN_ARROW)) {
    playerSprite.changeAnimation('upDown');
    playerSprite.velocity.y = 10;
  }
  //walk to the left
  else if(keyIsDown(UP_ARROW)) {
    playerSprite.changeAnimation('upDown');
    playerSprite.velocity.y = -10;
  }
  else {
    playerSprite.changeAnimation('still');
    playerSprite.velocity.x = 0; 
    playerSprite.velocity.y = 0; 
  }
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#FFFFFF";
  this.noTint = false;
  this.tint = "#D7CCFF";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#D7CCFF";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}


function clockCollision() {
  image(text1, width/2 - 400, height/2 - 300);
}

function phoneCollision() {
  phoneCollected = true;
}

function text2Collision() {
  image(text3, width/2 - 400, height/2 - 250);
}

function catRingCollision() {
  catRingCollected = true;
}

function text3Collision() {
  image(text4, width/2 - 400, height/2 - 250);
}

function taserCollision() {
  taserCollected = true;
}
function text4Collision() {
  image(text2, width/2 - 400, height/2 - 250);
}

function batCollision() {
  image(text5, width/2 - 300, height/2 - 250)
}

function bunnyCollision() {
  image(text6, width/2 - 300, height/2 - 250)
}

function owlCollision() {
  image(text7, width/2 - 100, height/2 - 250)
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//


// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "You are Little Red Hiding Hood – now as a young woman trying to walk home after a shift at the local bakery in the village. The sun is about to set and it will only get darker. Remember to be aware of your surroundings .... and especially any strangers.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}

class Bakery extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*2;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    // this.instructionsText = "Time to clock out for the night. It's 5PM and the sun is beginning to set. Hurry home before it gets too dark outside.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();

    drawSprite(clockSprite);
    playerSprite.overlap(clockSprite,clockCollision);
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    // Draw text in a box
    text(this.instructionsText, width/3, height/2 - 100, this.textBoxWidth, this.textBoxHeight );
  }
}

class Shop extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*2;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    // this.instructionsText = "Time to clock out for the night. It's 5PM and the sun is beginning to set. Hurry home before it gets too dark outside.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();


    if (phoneCollected === false) {
      drawSprite(phoneSprite);
      playerSprite.overlap(phoneSprite, phoneCollision);
    }

     if (catRingCollected === false) {
      drawSprite(catRingSprite);
      playerSprite.overlap(catRingSprite, catRingCollision);
    }

     if (taserCollected === false) {
      drawSprite(taserSprite);
      playerSprite.overlap(taserSprite, taserCollision);
    }

    playerSprite.overlap(catRingSprite, text3Collision);
    playerSprite.overlap(phoneSprite, text2Collision);
    playerSprite.overlap(taserSprite, text4Collision);

  }
}

class Town extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
 }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
      }
}

class Forest extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {

  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();

    drawSprite(batSprite);
    playerSprite.overlap(batSprite,batCollision);
   
   }
}

class Forest2 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();

    drawSprite(bunnySprite);
    playerSprite.overlap(bunnySprite,bunnyCollision);

  }
}

class Forest3 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();

    drawSprite(owlSprite);
    playerSprite.overlap(owlSprite,owlCollision);

  }
}

class Forest4 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();

    drawSprite(wolfSprite);


  if(wolfSprite.position.x > width)
    wolfSprite.position.x = 0;

  }
}

class Forest5 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
    image(text9, width/2 - 350, height/2 - 300);
  }
}

class Home extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
    image(werewolf,width/2, 400);
    image(text8, width/2 - 450, height/2 - 150);
  }
}

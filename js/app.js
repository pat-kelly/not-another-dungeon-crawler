/*
Started 12.01.2022
By: Patrick Kelly

TODOO - Everything, duh.
  * character class (includes player and monsters)
    - to include player, npcs?, monsters, etc.
    - Stats:
      - Health
      - Magic
      - str, dex, etc. (might be too much)
    - Inventory
      - Money, items, etc.
    - status(es)
    - location & facing
  * Location classes
    - internal/external
    - if external, basic structure.
      - walls, hallway entrances
      - 
    - what direction the door faces in the overworld
  * Map and where everything is.
    - Maybe each character/room/event/thing has a 'location' value? ie: tavern is at [5][3]
    - 2d array? and keep everything set in a grid.
    - [0][0] [1][0] [2][0]
    - [0][1] [1][1] [2][1]  <-- This kind of thing
    - [0][2] [1][2] [2][2]
    ? keep a log of where the player has been, and use that as a viewable 'map'?
  *moar to come.

*/

/*------------ Imports ------------*/
import { Monster, monsterList } from "../data/monsters.js";
import { checkValid, path, MapTile } from "../data/map.js"
import { Character } from "../data/char.js";

/*------------ Constants ------------*/
const player = new Character(100, 0, 0);
// const curPlayerTile = MapTile.find(player.location);


/*---- Cached Element References ----*/
const navBox = document.getElementById('nav');
const gameLog = document.getElementById('text-log');


/*--------- Event Listeners ---------*/
navBox.addEventListener('click', navCheck);

/*------------ Game Setup ------------*/

/*------------ Functions ------------*/
function navCheck(evt){
  if(evt.target.className !== 'nav-btn') return;
  
  const dirClicked = evt.target.id.replace('nav-move-', '');
  
  switch(dirClicked){
    case 'forward':
      playerMove(player, 2);
      break;
    case 'left':
      playerMove(player, 1);
      break;
    case 'right':
      playerMove(player, 3);
      break;
    case 'back':
      playerMove(player, 0);
      break;
  }
  /* 
  switch(dirClicked){
    case 'forward':
      playerMove(player, player.facing);
      break;
    case 'left':
      playerMove(player, player.getDirection(dirClicked));
      break;
    case 'right':
      playerMove(player, player.getDirection(dirClicked));
      break;
    case 'back':
      playerMove(player, player.directions[2]);
      break;
  } */

}//end navCheck

function playerMove(char, direction){
  //direction : 0 is back, 1 is left, 2 is forward, 3 is right.

  let curTile = char.location;
  let dest = path[curTile].getDest(direction);
  // if(path[curTile].exits)
  writeToGameLog(`exit num: ${direction}, destTile: ${dest}`);
  console.log('curtile',player.location,path[player.location]);
  if(dest) char.location = dest;
  console.log('newTile',player.location, path[player.location])

}

/* function playerMove(char, direction){
  // playerMove takes a Character and the direction they're trying to move.
  //   it should pull the current location from the player, and then check the next tile
  //   in 'direction' in the map object. if its a valid move, change the player location to that.

  const newLoc = new Array(char.location[0], char.location[1]);
  
  switch(direction.toLowerCase()){
    case 'n': 
      newLoc[1] +=1;
      break;
    case 'e':
      newLoc[0] +=1;
      break;
    case 's':
      newLoc[1] -=1;
      break;
    case 'w':
      newLoc[0] -=1;
      break;
  }

  
  if(checkValid(char.location, newLoc, direction)){ 
    writeToGameLog(`You walked through the ${curPlayerTile.getEdge(direction)} to the ${direction.toUpperCase()}`);
    if(MapTile.find(newLoc).getNotes()){
      writeToGameLog(MapTile.find(newLoc).getNotes())
    }
    char.location = newLoc;
  }else {
    writeToGameLog(`You can't move that direction. There's a ${curPlayerTile.getEdge(direction)} in the way.`);
    // writeToGameLog(getWall(char.location, direction));
  }
  writeToGameLog('===============================================');
} */

function writeToGameLog(strToAdd){
  gameLog.innerText += `\n`;
  gameLog.innerText += strToAdd;
  gameLog.scrollTop = gameLog.scrollHeight;
}


const gobbo = new Monster('goblin');
const slime = new Monster('slime');
const eliteGobbo = new  Monster('goblin', true);
// console.log(gobbo, slime, eliteGobbo);

const npc1 = new Character(1, 0, [0,1])

// console.log(player, npc1);

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
import { checkValid, map, MapTile } from "../data/map.js"
import { Character } from "../data/char.js";

/*------------ Constants ------------*/

const player = new Character(100, 0, [0,0]);


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
  }

}//end navCheck

player.l

function playerMove(char, direction){
  /* playerMove takes a Character and the direction they're trying to move.
    it should pull the current location from the player, and then check the next tile
    in 'direction' in the map object. if its a valid move, change the player location to that.*/

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
  writeToGameLog(`player location: ${(char.location)}`)
  writeToGameLog(`new location: ${(newLoc)}`);
  writeToGameLog(`direction of travel: ${direction}`);
  if(checkValid(char.location, newLoc, direction)){ 
    writeToGameLog(`You moved from ${char.location} to ${newLoc}`);
    //!REPLACE WITH SOMETHING BETTER #mvp
    char.location = newLoc;
    writeToGameLog(`test if char.location changed: ${char.location}`);
  }else {
    writeToGameLog(`You can't move that direction. There's a ${MapTile.find(char.location).getEdge(direction)} in the way.`);
    // writeToGameLog(getWall(char.location, direction));
  }
  writeToGameLog('===============================================');
}

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

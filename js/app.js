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

//doors
const leftDoor = document.getElementById('left-door');
const backDoor = document.getElementById('back-door');
const rightDoor = document.getElementById('right-door');
//tile objects
const lTorch = document.getElementById('torch-left');
const rTorch = document.getElementById('torch-right');

/*--------- Event Listeners ---------*/
navBox.addEventListener('click', navCheck);


init();
/*------------ Game Setup ------------*/
function init(){
  leftDoor.style.display = 'none';
  rightDoor.style.display = 'none';
  backDoor.style.display = 'none';
  // lTorch.style.display = 'none';
  // rTorch.style.display = 'none';
  render();
}
/*------------ Functions ------------*/
function navCheck(evt){
  if(evt.target.className !== 'nav-btn') return;
  
  const dirClicked = evt.target.id.replace('nav-move-', '');
  
  switch(dirClicked){
    case 'forward':
      playerMove(2);
      break;
    case 'left':
      playerMove(1);
      break;
    case 'right':
      playerMove(3);
      break;
    case 'back':
      playerMove(0);
      break;
  }
}//end navCheck

function playerMove(direction){
  //direction : 0 is back, 1 is left, 2 is forward, 3 is right.

  
  let dest = path[player.location].getDest(direction);
  // if(path[curTile].exits)
  writeToGameLog(`exit num: ${direction}, destTile: ${dest}`);
  console.log('curtile',player.location,path[player.location]);

  if(direction === 0){
    let curTile = player.location;
    player.location = player.lastLocation;
    player.lastLocation = curTile;
  }else if(dest) {
    player.lastLocation = player.location;
    player.location = dest;
  }

  console.log('newTile',player.location, path[player.location])

  render();

}

function render(){
  leftDoor.style.display = 'none';
  rightDoor.style.display = 'none';
  backDoor.style.display = 'none';

  path[player.location].exits.forEach(exit => {
    writeToGameLog(exit);
    switch(exit){
      case 1:
        console.log('case1')
        leftDoor.style.display = '';
        break;
      case 2:
        backDoor.style.display = '';
        break;
      case 3:
        rightDoor.style.display = '';
        break;
    }
  });
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

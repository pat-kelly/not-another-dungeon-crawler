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

/*------------ Constants ------------*/
// import "../data/monsters.js";
import { Monster, monsterList } from "../data/monsters.js";
import { map, checkValid } from "../data/map.js"
import { Character } from "../data/char.js";

/*------------ Variables ------------*/



/*---- Cached Element References ----*/



/*--------- Event Listeners ---------*/



/*------------ Functions ------------*/
function playerMove(char, direction){
  /* playerMove takes a Character and the direction they're trying to move.
    it should pull the current location from the player, and then check the next tile
    in 'direction' in the map object. if its a valid move, change the player location to that.
   */

    const newLoc = new Array(char.location[0], char.location[1]);
    let valid = false;

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

    console.log('char',char.location, 'newLoc',newLoc)
    valid = checkValid(char.location, newLoc, direction);
    console.log(valid);
    if(valid) char.location = newLoc;
}


const gobbo = new Monster('goblin');
const slime = new Monster('slime');
const eliteGobbo = new  Monster('goblin', true);
console.log(gobbo, slime, eliteGobbo);

const player = new Character(100, 0, [0,0]);
console.log(player.location);

playerMove(player, 'e');
console.log(player.location);
playerMove(player, 'n')
console.log(player.location)
playerMove(player, 'n')
console.log(player.location)
playerMove(player, 'w')
console.log(player.location)
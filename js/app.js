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
import "../data/monsters.js";
import {Monster,goblinSpecs,slimeSpecs} from "../data/monsters.js";

/*------------ Variables ------------*/


/*---- Cached Element References ----*/




/*--------- Event Listeners ---------*/



/*------------ Functions ------------*/

const gobbo1 = new Monster(3, 1, 'goblinoid', 1)
const gobbo2 = Monster.createMonster(goblinSpecs)

console.log(gobbo1.printMonster());
console.log(gobbo2.printMonster());
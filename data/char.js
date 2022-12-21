// import { MapTile } from "./map.js";

class Character{

  constructor(hp, mp, location, invObj={gold:0}){

    this.hp = hp;
    this.mp = mp;
    this.dmg = 1;
    this.location = location;
    this.locationHistory = [];
    this.inventory = invObj;
    // this.directions = ['n','e','s','w'];
    // this.facing = this.directions[0];
  }


}

export{Character}
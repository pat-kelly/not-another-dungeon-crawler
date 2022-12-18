// import { MapTile } from "./map.js";

class Character{

  constructor(hp, mp, location, invObj={}){

    this.hp = hp;
    this.mp = mp;
    this.location = location;
    this.locationHistory = [];
    this.inventory = invObj;
    // this.directions = ['n','e','s','w'];
    // this.facing = this.directions[0];
  }


}

export{Character}

class Character{
  constructor(hp, mp, location, invObj={gold:0}){

    this.hp = hp;
    this.mp = mp;
    this.location = location;
    this.locationHistory = [];
    this.inventory = invObj;
  }

  getDmg(){
    //TODO - once I have an inventory, adjust this based off equipped stuff.
    //TODO - Work hit chances in
    return(Math.floor(Math.random() * 4)+1);
  }
}

export{Character}
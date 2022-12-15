class Character{

  constructor(hp, mp, location=[], invObj={}){

    this.hp = hp;
    this.mp = mp;
    this.location = location;
    this.inventory = invObj;
    this.directions = ['n','e','s','w'];
    this.facing = this.directions[0];
  }

  getDirection(dir){

    if(!dir) return this.facing;

    switch(dir){
      case 'left': return this.directions[3];
      case 'right': return this.directions[1];
    }
  }

}

export{Character}
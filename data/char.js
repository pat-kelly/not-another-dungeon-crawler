class Character{
  constructor(hp, mp, location=[], invObj={}){

    this.hp = hp;
    this.mp = mp;
    this.location = location;
    this.inventory = invObj;

  }
}

export{Character}
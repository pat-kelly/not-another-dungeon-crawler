const slimeSpecs = [5,1,'Slime',1];
const goblinSpecs = [8,2,'Goblinoid',2];

class Monster{

  constructor(hp, dph, type, diff){
    this.hp = hp;
    this.dph = dph;
    this.type = type;
    this.diff = diff;
  }
  static createMonster(statsArray){
    if(statsArray.length !== 4) return;
    return new Monster(statsArray[0],statsArray[1],
        statsArray[2],statsArray[3],)
  }
  static dupeMonster(monster){
    if(!(monster instanceof Monster)) return;
    
    return new Monster(monster.hp, monster.dph, monster.type, monster.diff)
  }
  //put functions here when you figure out what's needed.
}
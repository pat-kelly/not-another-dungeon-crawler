class Monster{

  constructor(nameStr, elite=false){
    const baseStats = this.getBaseStats(nameStr);
    if(!baseStats) return;
    
    this.hp = elite ? baseStats.hp * 2 : baseStats.hp;
    this.dph = elite ? baseStats.dph * 2 : baseStats.dph;
    this.type = elite ? baseStats.name + ` - Elite` : baseStats.name;
    this.diff = elite ? baseStats.diff * 2 : baseStats.diff;
  }

  static dupeMonster(monster){
    if(!(monster instanceof Monster)) return;
  
    return new Monster(monster.name)
  }

  printMonster(){
    return `This is a ${this.name}, with ${this.hp} hp and hits for ${this.dph}.`
  }

  getBaseStats(nameStr){
    return monsterList.find(mon => mon.name.toLowerCase() === nameStr.toLowerCase())
  }

}

const monsterList = [
  {hp: 5, dph: 1, name: 'Slime', diff: 1},
  {hp: 8, dph: 2, name: 'Goblin', diff: 2}
]



export {
  Monster,
  monsterList
};
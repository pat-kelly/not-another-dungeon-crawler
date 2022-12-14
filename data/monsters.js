class Monster{

  constructor(nameStr, elite=false){
    const baseStats = this.getBaseStats(nameStr);
    if(!baseStats) return;
    
    this.hp = elite ? baseStats.hp : baseStats.hp * 2;
    this.dph = elite ? baseStats.dph : baseStats.dph * 2;
    this.type = elite ? baseStats.type : baseStats.type + ` - Elite`;
    this.diff = elite ? baseStats.diff : baseStats.diff * 2;
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
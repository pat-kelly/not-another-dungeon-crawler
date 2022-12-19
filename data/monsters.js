class Monster{

  constructor(nameStr, elite=false, location){
    const baseStats = this.getBaseStats(nameStr);
    if(!baseStats) return;
    
    this.hp = elite ? baseStats.hp * 2 : baseStats.hp;
    this.dph = elite ? baseStats.dph * 2 : baseStats.dph;
    this.type = elite ? baseStats.name + ` - Elite` : baseStats.name;
    this.diff = elite ? baseStats.diff * 2 : baseStats.diff;
    this.location = location
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

function generateMonster(diffLvl=1){
  const curMonsterList = monsterList.filter((mon) => mon.diff === diffLvl);
  console.log(curMonsterList);
  if(curMonsterList.length === 0) return;
  return new Monster( curMonsterList[Math.floor((Math.random() * curMonsterList.length))].name, false);
}

const monsterList = [
  {hp: 3, dph: 1, name: 'Slime', diff: 1},
  {hp: 7, dph: 2, name: 'Goblin', diff: 1},
  {hp: 5, dph: 2, name: 'Kobold', diff: 1},
  {hp: 5, dph: 3, name: 'Zombie', diff: 2},
  {hp: 13, dph: 4, name: 'HobGoblin', diff:2},
  {hp: 10, dph: 3, name: 'Skeleton', diff: 2}
]



export {
  Monster,
  generateMonster
};
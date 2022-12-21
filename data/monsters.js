import { MapTile } from "./map.js";

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
    console.log(nameStr);
    return monsterList.find(mon => mon.name.toLowerCase() === nameStr.toLowerCase())
  }

}

function generateMonster(tile = new MapTile){
  console.log('generateMon', tile);
  const curMonsterList = monsterList.filter((mon) => mon.diff <= tile.difficulty);
  console.log('curList',curMonsterList);
  if(curMonsterList.length === 0) return; //*don't think i need this anymore.

/*   let eliteChance = (Math.random() * 100)+1;
  let elite = false;
  console.log(eliteChance);
  if(eliteChance > 50 && eliteChance < 52) elite = true;
  console.log(elite); */

  console.log('roomtype',tile.roomType);

  if(tile.roomType === 4){
    return new Monster('Mimic', false);
  }else{
    return new Monster( curMonsterList[Math.floor((Math.random() * curMonsterList.length))].name, false);
  }
}

const monsterList = [
  {hp: 3, dph: 1, name: 'Goblin', diff: 1} ,
  {hp: 7, dph: 2, name: 'Mushroom', diff: 1},
  {hp: 10, dph: 3, name: 'Skeleton', diff: 2},
  {hp: 50, dph: 10, name: 'Mimic', diff: 25}/*,
  {hp: 5, dph: 3, name: 'Zombie', diff: 2},
  {hp: 13, dph: 4, name: 'HobGoblin', diff:2},
  {hp: 10, dph: 3, name: 'Skeleton', diff: 2} */
]



export {
  Monster,
  generateMonster
};
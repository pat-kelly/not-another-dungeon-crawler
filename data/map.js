//!var diff controls overall game difficulty.
var diff = 1, numMimics=0, pathLength =10;
const path = [];

class MapTile{
  constructor(roomType=0, exits=[], dest=[]){
    this.exits = exits;
    this.dest = dest;
    this.roomType = roomType; //0 is path, 1 is monster room, 2 is treasure, 3 is boss, 4 is mimic. -1 is for deadends that have been cleared.
    this.flavorText = '';
    this.difficulty = 0;
    this.monsters = [];
    this.treasureClaimed = false;
  }

  getMonsters(){
    return this.monsters.reduce((acc, mon)=>{
      acc[mon.type] = acc[mon.type] ? acc[mon.type] +1 : 1;
      return acc;
    },{})
  }

  getDest(exitNum){
    return this.dest[this.exits.indexOf(exitNum)]
  }

  getDescription(){
    let retStr = `You have entered a room with `;
    retStr += (this.exits.length === 1 ? `1 door. ` : `${this.exits.length} doors. `)
    
    retStr += `You may go `
    switch(this.exits.length){  //*#TODO - when I change where the doors can be, i'll need to adjust this as well.
      case 1: retStr += `left. `; break;
      case 2: retStr += `left, or straight. `; break;
      case 3: retStr += `left, straight, or right. `; break;
    }

    if(this.flavorText){
      retStr += `\n${this.flavorText}. `
    }
    return retStr;
  }

  checkAliveMonsters(){
    let alive = false;
    this.monsters.forEach(mon=>{
      if(mon.hp > 0) alive=true;
    })
    return alive;
  }

  getMonsterDiff(){
    return this.monsters.reduce((acc,mon)=>{
      acc += mon.diff;
      return acc;
    },0);
  }
}


function createDeadEnd(inheritedDiff =0){
//0 is deadend, 1 is monster room, 2 is treasure, 3 is boss, 4 is mimic.
  let roomType = Math.floor((Math.random() * 100)+1);
  const curTile = new MapTile();
  
  if(roomType < 65){ //!65
    curTile.roomType = 1;
    curTile.difficulty = diff+inheritedDiff;
    diff++;
    return curTile;
  }
  if(roomType < 80){ //!80
    curTile.roomType = 2;
    curTile.difficulty = diff+inheritedDiff;
    diff++;
    return curTile;    
  }
  if(roomType < 95){ //!95
    return new MapTile(); 
  }
  if(pathLength/10 > numMimics){
    curTile.roomType = 4;
    curTile.difficulty = 100;
    return curTile;
  }
}

//* levelUp - make it so 1 and 2 door rooms are random. #TODO

function generatePath(){

  while(path.length){
    path.pop();
  }

  let lastDest = 0;
  for(let i=0; i< pathLength; i++){
    let numExits = Math.floor((Math.random() * 3)+1);
  
    const curTile = new MapTile();
    curTile.difficulty = i+1;
    
    let idx = Math.floor((Math.random() * (numExits))+1);
    
    //This stops the game from taking the same exit twice.
    //UNLESS the room being generated only has 1 exit. see above todo.
    while(idx === lastDest){
      idx = Math.floor((Math.random() * (numExits))+1);
      idx === lastDest ? idx === lastDest : lastDest=idx;
    }
  
    if(i !== pathLength-1){
      for(let j=1; j<=numExits; j++){
        curTile.exits.push(j);
        if(numExits === 1){
          curTile.dest.push(i+1)
        }else{
          if(j === idx){
            curTile.dest.push(i+1);
          }else{
            curTile.dest.push(createDeadEnd(i));
          } 
        }
      }
    }else{
      const bossRoom = new MapTile();
      bossRoom.roomType = 3;
      bossRoom.difficulty = 100;
      curTile.exits.push(1, 2)
      curTile.roomType = 3;
      curTile.dest.push(undefined,bossRoom);
    } 
  
    path.push(curTile);
  
  }
}



export{MapTile, path, generatePath}


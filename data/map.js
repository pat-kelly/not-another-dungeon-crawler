class MapTile{
  constructor(exits=[], dest=[]){
    this.exits = exits;
    this.dest = dest;
    this.roomType = 0; //0 is path, 1 is monster room, 2 is treasure, 3 is boss.
    this.flavorText = '';
  }

  getDest(exitNum){
    return this.dest[this.exits.indexOf(exitNum)]
  }

  getDescription(){
    let retStr = `You have entered a room with `;
    retStr += (this.exits.length === 1 ? `1 door. ` : `${this.exits.length} doors. `)

    retStr += `You may go `

    switch(this.exits.length){
      case 1: retStr += `left. `; break;
      case 2: retStr += `left, or straight. `; break;
      case 3: retStr += `left, straight, or right. `; break;
    }

    if(this.flavorText){
      retStr += `\n${this.flavorText}. `
    }
    return retStr;
  }
}


const path = [];
const deadEnds = [];

//* levelUp - make it so 1 and 2 door rooms are random.

for(let i=0; i< 10; i++){
  let numExits = Math.floor((Math.random() * 3)+1);
  const exits = [];
  const dest = [];

  const curTile = new MapTile();

  // console.log(numExits);
  let idx = Math.floor((Math.random() * (numExits))+1);
  // console.log(idx);
  if(i !== 9){
    for(let j=1; j<=numExits; j++){
      curTile.exits.push(j);
      if(numExits === 1){
        curTile.dest.push(i+1)
      }else{
      if(j === idx){
        curTile.dest.push(i+1);
      }else curTile.dest.push(undefined);
      // console.log(`cell ${i}'s exit is ${idx}`);
      }
    }
  }else curTile.roomType = 3;

  path.push(curTile);

}

export{MapTile, path}


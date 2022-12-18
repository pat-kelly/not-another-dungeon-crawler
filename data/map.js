class MapTile{
  constructor(exits=[], dest=[]){
    this.exits = exits;
    this.dest = dest;
  }

  getDest(exitNum){
    return this.dest[this.exits.indexOf(exitNum)]
  }

  // getNotes(){
  //   return this.notes;
  // }
}


const path = [];
const deadEnds = [];

for(let i=0; i< 10; i++){
  let numExits = Math.floor((Math.random() * 3)+1);
  const exits = [];
  const dest = [];

  // console.log(numExits);
  let idx = Math.floor((Math.random() * (numExits))+1);
  // console.log(idx);
  for(let j=1; j<=numExits; j++){
    exits.push(j);
    if(numExits === 1){
      dest.push(i+1)
    }else{
    if(j === idx){
      dest.push(i+1);
    }else dest.push(undefined);
    console.log(`cell ${i}'s exit is ${idx}`);
    }
  }

  // dest = i+1;

  path.push(new MapTile(exits, dest))
  console.log(path[i]);
}

export{MapTile, path}


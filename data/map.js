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

  console.log(numExits);

  for(let j=1; j<=numExits; j++){
    exits.push(j);
    if(dest.find(i+1)){
      dest.push(undefined);
    }else{
      //!finish me
    }
  }
  

  // dest = i+1;

  path.push(new MapTile(exits, dest))
  console.log(path[i]);
}

export{MapTile, path}


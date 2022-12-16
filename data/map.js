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
  let exits = Math.floor((Math.random() * 3)+1)
  let dest = i+1;
  path.push(new MapTile([exits], [dest]))
}

export{MapTile, checkValid, path}


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

MapTile.find = function(toFind = []){
  return map.find(tile => (JSON.stringify(tile.location) === JSON.stringify(toFind)))
}

function checkValid(locA = [], locB = [], direction =''){

  const curTile = MapTile.find(locA);
  const dest = MapTile.find(locB);
  
  console.log(map);
  console.log(curTile, dest);
  // console.log(typeof(curTile),typeof(dest));
  if(dest){

    if(curTile.getEdge(direction) !== 'door' && curTile.getEdge(direction) !== 'hallway') return false;
    if(dest.getRevEdge(direction) !== 'door' && dest.getRevEdge(direction) !== 'hallway') return false;
    return true;
  } else return false; //!return something else when the app can handle it.
}

const path = [];

for(let i=0; i< 10; i++){
  let exits = Math.floor((Math.random() * 3)+1)
  let dest = i+1;
  console.log(`idx: ${i}, exits: ${exits}, dest: ${dest}`)
  path.push(new MapTile([exits], [dest]))
}

export{MapTile, checkValid, path}


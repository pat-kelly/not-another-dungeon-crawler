class MapTile{

  constructor(tile = {}){
    
    this.location = tile.location;
    this.n = tile.n;
    this.e = tile.e;
    this.s = tile.s;
    this.w = tile.w;

    this.notes = tile.notes;
  }

  getEdge(dir=''){
    return this[dir];
  }

  getRevEdge(dir = ''){
    switch(dir){
      case 'n': return this['s'];
      case 's': return this['n'];
      case 'e': return this['w'];
      case 'w': return this['e'];
    }
  }

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



const mapData = [
  {
    location: [0,0],
    n: 'wall',
    e: 'door',
    s: 'wall',
    w: 'wall',
    notes: {flavor: 'you notice a faint sulfer smell entering this area',
            poi: 'something unique about this tile'}
  },
  {
    location: [1,0],
    n: 'hallway',
    e: 'wall',
    s: 'wall',
    w: 'door',
    notes: {flavor: '',
            poi: ''}
  },
  {
    location: [0,1],
    n: 'wall',
    e: 'ldoor',
    s: 'wall',
    w: 'wall',
    notes: {flavor: '',
            poi: ''}
  },
  {
    location: [1,1],
    n: 'wall',
    e: 'wall',
    s: 'hallway',
    w: 'ldoor',
    notes: {flavor: '',
            poi: ''}
  }

]

const map = [];

for(const tile of mapData){
  map.push( new MapTile(tile));
}

export{MapTile, checkValid, map}


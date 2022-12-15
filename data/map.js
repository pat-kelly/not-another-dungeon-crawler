const map = [
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
    e: 'door',
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
    w: 'door',
    notes: {flavor: '',
            poi: ''}
  }

]

function checkValid(locA = [], locB = [], direction =''){
  /* Valid moves are considered:
  hallway -> hallway
  hallway -> door

  [0,0] -> [0,1] moving N

  - check if at edge of map
  - find direction.
  - grab direction exit of locA
  - grab reverse of direction of locB
  - check if valid
   */
  const curTile = map.find(tile => JSON.stringify(tile.location) === JSON.stringify(locA))
  const dest = map.find(tile => JSON.stringify(tile.location) === JSON.stringify(locB))

  // console.log(curTile, dest);

  if(dest){
    // console.log('target is in map');
    switch(direction){

      case 'n':{
        if(curTile.n !== 'hallway' && curTile.n !== 'door') return false;
        if(dest.s !== 'hallway' && dest.s !== 'door') return false;
        return true;
      }
      case 'e':{
        // console.log('in E', curTile.e, dest.w);
        if(curTile.e !== 'hallway' && curTile.e !== 'door') {return false;}
        if(dest.w !== 'hallway' && dest.w !== 'door') {return false;}
        return true;
      }
      case 's':{
        if(curTile.s !== 'hallway' && curTile.s !== 'door') return false;
        if(dest.n !== 'hallway' && dest.n !== 'door') return false;
        return true;
      }
      case 'w':{
        if(curTile.w !== 'hallway' && curTile.w !== 'door') return false;
        if(dest.e !== 'hallway' && dest.e !== 'door') return false;
        return true;
      }
      default: {return true;}
    }
  } else return false; //!return something else when the app can handle it.

  
}

export{map, checkValid}
/*------------ Imports ------------*/
import { Monster,generateMonster } from "../data/monsters.js";
import { path, MapTile } from "../data/map.js"
import { Character } from "../data/char.js";

/*------------ Constants ------------*/
const player = new Character(100, 100, 0);
// const curPlayerTile = MapTile.find(player.location);
let combat = false;
//const monsters = []; //?Depreciated - moved to map tiles


/*---- Cached Element References ----*/
const navBox = document.getElementById('nav');
const gameLog = document.getElementById('text-log');
const hpEl = document.getElementById('char-hp');
const manaEl = document.getElementById('char-mana');
const displayWindowEl = document.getElementById('display-area');
const monsterContainerEl = document.getElementById('monster-container');
const attackButtonEl = document.getElementById('attack');
const monsterHealthEl = document.getElementById('monster-health-bars');


//doors
const leftDoor = document.getElementById('left-door');
const backDoor = document.getElementById('back-door');
const rightDoor = document.getElementById('right-door');
//tile objects
const lTorch = document.getElementById('torch-left');
const rTorch = document.getElementById('torch-right');

/*--------- Event Listeners ---------*/
navBox.addEventListener('click', navCheck);
attackButtonEl.addEventListener('click', attack);


document.onload = init();

/*------------ Game Setup ------------*/
function init(){
  leftDoor.style.display = 'none';
  rightDoor.style.display = 'none';
  backDoor.style.display = 'none';
  attackButtonEl.style.display = 'none';
  // lTorch.style.display = 'none';
  // rTorch.style.display = 'none';
  hpEl.style.width = '0';
  manaEl.style.width = '0';
  path.forEach(tile => {
    // writeToGameLog(JSON.stringify(tile));
    console.log(tile);
  });
  render();
}
/*------------ Functions ------------*/

function navCheck(evt){
  if(evt.target.className !== 'nav-btn') return;
  
  const dirClicked = evt.target.id.replace('nav-move-', '');
  
  switch(dirClicked){
    case 'forward':
      playerMove(2);
      break;
    case 'left':
      playerMove(1);
      break;
    case 'right':
      playerMove(3);
      break;
    case 'back':
      playerMove(0);
      break;
  }
}//end navCheck


function playerMove(direction){
  //direction : 0 is back, 1 is left, 2 is forward, 3 is right.
  
  let dest;

  if(typeof player.location === 'number'){
    dest = path[player.location].getDest(direction);
  }

  if(direction === 0){
    //player is going back
    if(player.locationHistory.length){
      if(combat) combat = false;
      player.location = player.locationHistory.pop();
      writeToGameLog(path[player.location].getDescription());
    }
    else writeToGameLog("The path back is blocked. The only way out is through...")
  }else if(dest instanceof MapTile){
    handleDeadEnd(dest);
    player.locationHistory.push(player.location);
    player.location = dest;
  }else if(typeof dest === 'number'){
    //player chose correct direction.
    player.locationHistory.push(player.location);
    player.location = dest;
    writeToGameLog(path[player.location].getDescription());
  }else{
    writeToGameLog("You can't go that direction!")
  }
  render();
}

function handleDeadEnd(tile = new MapTile()){
  //0 is path, 1 is monster room, 2 is treasure, 3 is boss, 4 is mimic.
  // console.log('curTile', path[player.location])
  // console.log('deads', deadEnds)
  // console.log('curDead', tile);
  // console.log(tile.roomType)

  // let percent = Math.floor((Math.random() * 100)+1);

  switch(tile.roomType){
    case 1:
      writeToGameLog('monster room!');
      generateMonsters(tile);
      combat = true;
      break;
    case 2:
      writeToGameLog('treasure!');
      break;
    case 3:
      writeToGameLog('you should never see this message');
      break;
    case 4:
      writeToGameLog('treasure?');
      break;
    default:
      writeToGameLog(`You seem to have hit a dead end.`)
      // writeToGameLog('real dead end');
      break;

  }
}

function generateMonsters(tile=new MapTile()){

  //If there are monsters at current location
  if(tile.monsters.length !== 0){
    // writeToGameLog("found a monster already at your location");
    // const monstersAtLocation = monsters.filter(mon => mon.location === player.location);

    

    

  //else no monsters at current location
  }else{
    let pathDiff = path[player.location].difficulty;
    // while(existingDiff < tile.difficulty && tile.roomType !==4){
    
    // }
    let tileDiff = 0;
    while(tileDiff <= tile.difficulty && tileDiff <6){
      tile.monsters.push(generateMonster(pathDiff))
      tileDiff = (tile.getMonsterDiff());
    }
    // console.log('deTile',tile);
    // writeToGameLog('generating new monster');
  }
  
}

function attack(){
  if(!combat) return;

  const curTarget = player.location.monsters.find(mon => mon.hp > 0);
  if(curTarget){
    curTarget.hp -= player.dmg;
  }else{
    writeToGameLog(`There's nothing to attack!`)
  }
  console.log(curTarget);

  render();

}

function render(){
  console.log(player.location.monsters);
  if(!combat){
    displayWindowEl.style.backgroundImage = 'url("../assets/images/room.png")';
    monsterContainerEl.style.display = 'none';
    attackButtonEl.style.display = 'none';
    monsterHealthEl.style.display = 'none';
  }else{
    displayWindowEl.style.backgroundImage = 'url("../assets/images/battle_room.png")'
    attackButtonEl.style.display = '';
    monsterContainerEl.style.display = '';
    monsterHealthEl.style.display = '';
    let monstersToAdd = '';
    monsterContainerEl.innerHTML = '';
    monsterHealthEl.innerHTML = '';

    player.location.monsters.forEach((monster, idx) => {
      console.log(monster, idx);
      if(monster.hp > 0){
        const monDiv = document.createElement('div');
        const monHp = document.createElement('div');
        const monLabel = document.createElement('p');

        monLabel.textContent = `${monster.type} HP`;
        monsterHealthEl.appendChild(monLabel);

        monHp.id = `${monster.type}_${idx}_hp`; //!I don't think i'm using this right now.
        monHp.classList.add('health-bar');
        monHp.style.width = `${monster.hp * 50}px`;
        monHp.style.height = '10px'
        monsterHealthEl.appendChild(monHp);

        monDiv.id = `${monster.type}_${idx}`;
        monDiv.classList.add('monster');
        monDiv.style.background = `transparent 0 0 no-repeat`;
        monDiv.style.backgroundImage = `url("../assets/images/monsters/${monster.type}_idle.png")`
        monDiv.style.height= '180px';
        monDiv.style.width= '450px';
        monsterContainerEl.appendChild(monDiv);
      }
    });

    // console.log(monstersToAdd);
  }
  leftDoor.style.display = 'none';
  rightDoor.style.display = 'none';
  backDoor.style.display = 'none';
  hpEl.textContent = player.hp;
  hpEl.style.width = `${player.hp * 2}px`;
  manaEl.textContent = player.mp;
  manaEl.style.width = `${player.mp * 2}px`;
  
  if(typeof player.location === 'number' && !combat){
    path[player.location].exits.forEach(exit => {
      // writeToGameLog(exit);
      switch(exit){
        case 1:
          // console.log('case1')
          leftDoor.style.display = '';
          break;
        case 2:
          backDoor.style.display = '';
          break;
        case 3:
          rightDoor.style.display = '';
          break;
      }
    });
  }
}

function writeToGameLog(strToAdd){
  gameLog.innerText += `\n`;
  if(strToAdd) gameLog.innerText += strToAdd;
  gameLog.scrollTop = gameLog.scrollHeight;
}


const gobbo = new Monster('goblin');
const slime = new Monster('slime');
const eliteGobbo = new  Monster('goblin', true);
// console.log(gobbo, slime, eliteGobbo);

const npc1 = new Character(1, 0, [0,1])

// console.log(player, npc1);

/*------------ Imports ------------*/
import { Monster,generateMonster } from "../data/monsters.js";
import { path, MapTile } from "../data/map.js"
import { Character } from "../data/char.js";

/*------------ Constants ------------*/
const player = new Character(100, 100, 0);
let gameOver, combat, won;
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
const transitionEl = document.getElementById('transition');


//doors
const leftDoor = document.getElementById('left-door');
const backDoor = document.getElementById('back-door');
const rightDoor = document.getElementById('right-door');
//tile objects
const lTorch = document.getElementById('torch-left');
const rTorch = document.getElementById('torch-right');

/*--------- Event Listeners ---------*/
navBox.addEventListener('click', navCheck);
displayWindowEl.addEventListener('click', attack);


document.onload = init();

/*------------ Game Setup ------------*/
function init(){
  gameOver = false;
  won = false;
  combat = false;
  // transitionEl.style.display = 'none';
  leftDoor.style.display = 'none';
  rightDoor.style.display = 'none';
  backDoor.style.display = 'none';
  attackButtonEl.style.display = 'none';
  lTorch.style.display = 'none';
  rTorch.style.display = 'none';
  hpEl.style.width = '0';
  manaEl.style.width = '0';
  
  
  //!REMOVE BEFORE LAUNCH #TODO
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
    console.log(dest,'dest');
  }

  if(direction === 0){
    //player is going back
    if(player.locationHistory.length){
      if(combat) combat = false;
      player.location = player.locationHistory.pop();
      writeToGameLog(path[player.location].getDescription());
    }
    else {
      writeToGameLog("The path back is blocked. The only way out is through...")
      return;
    }
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
    return;
  }

  transitionEl.style.backgroundColor = 'black';
  for(let el of document.getElementsByClassName('monster')){
    // console.log(el);
    el.style.zIndex = '99';
  }
  setTimeout(() => {
    transitionEl.style.backgroundColor = '';
    for(let el of document.getElementsByClassName('monster')){el.style.zIndex = '101'}
    
    if(!dest){
      combat ? combatRender() : render();
      return;
    }else{
      switch(dest.roomType){
        case 4:
          treasureRender();
          break;
        case 3:
          //bossRender();
          break;
        default:
          combat ? combatRender() : render();
          break;
      }
    }

  }, 200);
}//*END playerMove

function handleDeadEnd(tile = new MapTile()){
  //0 is path, 1 is monster room, 2 is treasure, 3 is boss, 4 is mimic.
  // console.log('curTile', path[player.location])
  // console.log('deads', deadEnds)
  // console.log('curDead', tile);
  // console.log(tile.roomType)

  // let percent = Math.floor((Math.random() * 100)+1);

  switch(tile.roomType){
    case 1:
      createMonsterList(tile);
      tile.getMonsters();
      // writeToGameLog(`You walk into the room, and find`);
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
      createMonsterList(tile);
      
      break;
    default:
      writeToGameLog(`You seem to have hit a dead end.`)
      break;

  }
}

function createMonsterList(tile=new MapTile()){

  //If there are monsters at current location
  if(tile.roomType === 4 || tile.roomType === 3){
    //4 = mimic room, 3 = boss room. Both are outside the scope of path difficulty
    if(tile.roomType === 4 && !tile.monsters.length){
      tile.monsters.push(generateMonster(tile))
      console.log('createMonsterList', tile);
    }
  }else if(tile.monsters.length === 0){
    let pathDiff = path[player.location].difficulty;
    console.log(pathDiff, 'pathdiff');
    // while(existingDiff < tile.difficulty && tile.roomType !==4){
      // console.log(pathDiff,'pathdiff')
    // }
    let tileDiff = 0;
    while(tileDiff <= tile.difficulty && tileDiff <6){
      tile.monsters.push(generateMonster(tile))
      tileDiff = (tile.getMonsterDiff());
    }
    console.log('deTile',tile);
    // writeToGameLog('generating new monster');
  }
  
}

function attack(evt){
  
  if(!combat){
    if(player.location.roomType === 4 || player.location.roomType === 2){
      treasureRender(true, evt);
    }else return;
  }
  if(!(evt.target.classList.contains('monster'))) return;
  if(evt.target.classList.contains('noClick')) return;
  //<img id="Goblin_0" class="monster" src="./assets/images/monsters/Goblin_hit.gif" style="height: 300px; width: 300px;">
  let idx = evt.target.id.slice(-1);
  
  const curTarget = player.location.monsters[idx];
  const targetEl = document.getElementById(`${curTarget.type}_${idx}`);
  targetEl.classList.add('noClick');
  setTimeout(() => {
    targetEl.classList.remove('noClick');
  }, 1200);
  //adjust monster hp and animate either hit or death
  if(curTarget.hp > 0){
    curTarget.hp -= player.dmg;
    if(curTarget.hp){
      targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_hit.gif`
      setTimeout(function(){
        targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_attack.gif`
        setTimeout(function(){
          player.hp -= curTarget.dph;
          combatRender(true);
          targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_idle.gif`
        },curTarget.atkTime)//* atk timeout
      },curTarget.hitTime) //*hit timeout
  }else{
    targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_hit.gif`
    // targetEl.classList.remove('monster');
    setTimeout(()=>{
      targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_death.gif`
      setTimeout(()=>{
        targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_corpse.png`
      },curTarget.dieTime)//*death timeout
    }, curTarget.hitTime)//*hit timeout
  }
  }else{
    writeToGameLog(`Why are you stabbing the dead ${curTarget.type}?`)
  }
  combatRender(true);
}

function treasureRender(openChest, evt){
  hideDoorsUpdateHP();
  if(typeof player.location === 'number') return; //*if the player's location is a number, we shouldn't be here.
  displayWindowEl.style.backgroundImage = 'url("../assets/images/battle_room.png")'
  // attackButtonEl.style.display = '';
  monsterContainerEl.style.display = '';
  monsterHealthEl.style.display = '';
  monsterHealthEl.innerHTML = '';

  if(openChest){
    if(player.location.roomType === 4){
      spawnMimic();
    }else if(player.location.roomType === 2){
      openTreasure();
    }
  }else{
    const chestImg = document.createElement('img');
    chestImg.id = 'Mimic_0';
    chestImg.classList.add('monster');
    chestImg.src = `./assets/images/tile_objects/Chest.png`;
    chestImg.onload= ()=>{
      chestImg.style.height= `${chestImg.naturalHeight}px`; 
      chestImg.style.width= `${chestImg.naturalWidth}px`; 
    }
    monsterContainerEl.appendChild(chestImg);
  }
}

function spawnMimic(){
  const chest = document.getElementById('Mimic_0');
  chest.src = './assets/images/monsters/Mimic/Mimic_activate.gif';
  chest.classList.add('noClick')
  setTimeout(() => {
    chest.classList.remove('noClick');
    combat = true;
    chest.src = './assets/images/monsters/Mimic/Mimic_idle.gif';
  }, 2900);
  // console.log(player.location.monsters)
}

function combatRender(atk = false){
  hideDoorsUpdateHP();
  if(typeof player.location === 'number') return; //*if the player's location is a number, we shouldn't be here.
  displayWindowEl.style.backgroundImage = 'url("../assets/images/battle_room.png")'
  // attackButtonEl.style.display = '';
  monsterContainerEl.style.display = '';
  monsterHealthEl.style.display = '';

  if(!atk) monsterContainerEl.innerHTML = ''; 
  
  monsterHealthEl.innerHTML = '';
  
  player.location.monsters.forEach((monster, idx) => {
    console.log(monster, idx);
    
    //Things that only need to render the first time.
    if(!atk){
      const monImg = document.createElement('img'); 
      monImg.id = `${monster.type}_${idx}`; 
      monImg.classList.add('monster'); 
      monImg.src = `./assets/images/monsters/${monster.type}/${monster.type}_idle.gif` 
      monImg.onload= ()=>{
        monImg.style.height= `${monImg.naturalHeight}px`; 
        monImg.style.width= `${monImg.naturalWidth}px`; 
      }
      monsterContainerEl.appendChild(monImg);
      //need to check if we've visited before, and display them dead if they're dead.
      if(monster.hp === 0){
        const monsterEl = document.getElementById(`${monster.type}_${idx}`)
        monsterEl.src = `./assets/images/monsters/${monster.type}/${monster.type}_corpse.png`
      }
    }
    //Things that will render all the time
    const monHp = document.createElement('div');
    const monLabel = document.createElement('p');
    monLabel.textContent = `${monster.type} HP`;
    monsterHealthEl.appendChild(monLabel);
    monHp.classList.add('health-bar');
    monHp.style.width = `${monster.hp * 10}px`;
    monHp.style.height = '10px'
    monsterHealthEl.appendChild(monHp);
  });
}//*END combatRender

function render(){
  displayWindowEl.style.backgroundImage = 'url("../assets/images/room.png")';
  hideDoorsUpdateHP();
  monsterContainerEl.style.display = 'none';
  attackButtonEl.style.display = 'none';
  monsterHealthEl.style.display = 'none';
  
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

function hideDoorsUpdateHP(){
  leftDoor.style.display = 'none';
  rightDoor.style.display = 'none';
  backDoor.style.display = 'none';
  if(player.hp < 1){
    writeToGameLog(`You have died! so sad.`)
    gameOverRender();
    hpEl.textContent = '0';
  }else{
    hpEl.textContent = player.hp;
    hpEl.style.width = `${player.hp * 2}px`;
    manaEl.textContent = player.mp;
    manaEl.style.width = `${player.mp * 2}px`;
  }
}

function gameOverRender(){

}

function writeToGameLog(strToAdd){
  gameLog.innerText += `\n`;
  if(strToAdd) gameLog.innerText += strToAdd;
  gameLog.scrollTop = gameLog.scrollHeight;
}
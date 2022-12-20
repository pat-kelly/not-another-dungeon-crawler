/*------------ Imports ------------*/
import { Monster,generateMonster } from "../data/monsters.js";
import { path, MapTile } from "../data/map.js"
import { Character } from "../data/char.js";

/*------------ Constants ------------*/
const player = new Character(100, 100, 0);
let gameOver = false, combat = false, won = false;
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
displayWindowEl.addEventListener('click', attack);


document.onload = init();

/*------------ Game Setup ------------*/
function init(){
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
  combat ? combatRender() : render();
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
      break;

  }
}

function generateMonsters(tile=new MapTile()){

  //If there are monsters at current location
  if(tile.monsters.length !== 0){
    // writeToGameLog("found a monster already at your location");
    // const monstersAtLocation = monsters.filter(mon => mon.location === player.location);

    
      //!Dont forget to re-visit this later #TODO
    

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

function attack(evt){
  if(!combat) return;
  if(!(evt.target.classList.contains('monster'))) return;
  //<img id="Goblin_0" class="monster" src="./assets/images/monsters/Goblin_hit.gif" style="height: 300px; width: 300px;">
  let idx = evt.target.id.slice(-1);
  
  const curTarget = player.location.monsters[idx];
  const targetEl = document.getElementById(`${curTarget.type}_${idx}`);

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
        },800)
      },400)
  }else{
    targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_hit.gif`
    // targetEl.classList.remove('monster');
    setTimeout(()=>{
      targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_death.gif`
      setTimeout(()=>{
        targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_corpse.png`
      },800)
    }, 200)
  }
  }else{
    writeToGameLog(`Why are you stabbing the dead ${curTarget.type}?`)
  }
  combatRender(true);
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
      monImg.style.height= `${monImg.naturalHeight}px`; 
      monImg.style.width= `${monImg.naturalWidth}px`; 
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
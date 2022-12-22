/*------------ Imports ------------*/
import { Monster,generateMonster } from "../data/monsters.js";
import { path, MapTile } from "../data/map.js"
import { Character } from "../data/char.js";

/*------------ Constants ------------*/
const player = new Character(100, 100, 0);
let gameOver, combat, won;

/*---- Cached Element References ----*/
const displayWindowEl = document.getElementById('display-area');
const transitionEl = document.getElementById('transition');
const monsterContainerEl = document.getElementById('monster-container');
const displayCover = document.getElementById('splash-screen');

const hpEl = document.getElementById('char-hp');
const manaEl = document.getElementById('char-mana');
const goldEl = document.getElementById('char-gold');
const monsterHealthEl = document.getElementById('monster-health-bars');

const gameLog = document.getElementById('text-log');
const navBox = document.getElementById('nav');

// const attackButtonEl = document.getElementById('attack'); #TODO -remove this.

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
  // attackButtonEl.style.display = 'none';
  leftDoor.style.display = 'none';
  rightDoor.style.display = 'none';
  backDoor.style.display = 'none';
  backDoor.style.backgroundImage = 'url("../assets/images/tile_objects/backDoor.png")'
  lTorch.style.display = 'none';
  rTorch.style.display = 'none';
  hpEl.style.width = '0';
  manaEl.style.width = '0';
  displayCover.style.display = 'none';
/*   displayCover.style.backgroundColor = 'rgb(0,0,0)';
  displayCover.style.zIndex = '101';
  // displayCover.style.display = 'none';
  const btn = document.createElement('button');
  btn.textContent = 'Enter the Dungeon';
  btn.addEventListener('click', hideSplash);
  displayCover.appendChild(btn);
  btn.id = 'title-button'; */

    

  //!REMOVE BEFORE LAUNCH #TODO
  path.forEach(tile => {
    // writeToGameLog(JSON.stringify(tile));
    console.log(tile);
  });


  render();
}
/*------------ Functions ------------*/

function hideSplash(){
  displayCover.classList.add('animate__fadeOut');
  setTimeout(() => {
    displayCover.style.zIndex = -1;
    displayCover.style.backgroundImage = '';
  }, 2000);
}

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
    console.log(path[player.location],'curPath')
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
    path[player.location].roomType === 3 ? writeToGameLog(`You see before you a set of grand doors. You hear distant laughter..`) 
      : writeToGameLog(path[player.location].getDescription());
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
          console.log('boss?')
          bossRender();
          break;
        case 2:
          treasureRender();
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
  
  switch(tile.roomType){
    case 1:
      createMonsterList(tile);
      tile.getMonsters();
      // writeToGameLog(`You walk into the room, and find`);
      combat = true;
      break;
    case 2:
      writeToGameLog('You see a treasure chest before you.');
      break;
    case 3:
      writeToGameLog('put the boss encounter msg here #TODO');
      break;
    case 4:
      writeToGameLog('You see a treasure chest before you.');
      createMonsterList(tile);exits
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
  if(!(evt.target.classList.contains('monster'))) return;
  
  if(!combat){
    if(player.location.roomType === 4 || player.location.roomType === 2){
      treasureRender(true, evt);
      return;
    }else return;
  }
  if(evt.target.classList.contains('noClick')) return;
  //<img id="Goblin_0" class="monster" src="./assets/images/monsters/Goblin_hit.gif" style="height: 300px; width: 300px;">
  let idx = evt.target.id.slice(-1);
  
  const curTarget = player.location.monsters[idx];
  const targetEl = document.getElementById(`${curTarget.type}_${idx}`);
  targetEl.classList.add('noClick');
  let noClickTime = curTarget.hitTime + curTarget.atkTime + 200;
  setTimeout(() => {
    targetEl.classList.remove('noClick');
  }, noClickTime);
  //adjust monster hp and animate either hit or death
  if(curTarget.hp > 0){
    curTarget.hp -= player.dmg;
    writeToGameLog(`You hit the ${curTarget.type} for ${player.dmg} damage!`);
    if(curTarget.hp){
      targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_hit.gif`
      setTimeout(function(){
        targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_attack.gif`
        setTimeout(function(){
          player.hp -= curTarget.dph;
          writeToGameLog(`The ${curTarget.type} hits you for ${curTarget.dph} damage!`);
          combatRender(true);
          targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_idle.gif`
        },curTarget.atkTime)//* atk timeout
      },curTarget.hitTime) //*hit timeout
    }else{
    writeToGameLog(`The ${curTarget.type} has died, and dropped ${rewardPlayer('monster',curTarget)} gold!`);
    targetEl.src = `./assets/images/monsters/${curTarget.type}/${curTarget.type}_hit.gif`
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
}//*END Attack function

function treasureRender(openChest, evt){
  hideDoorsUpdateHP();
  if(typeof player.location === 'number') return; //*if the player's location is a number, we shouldn't be here.
  displayWindowEl.style.backgroundImage = 'url("../assets/images/battle_room.png")'
  // attackButtonEl.style.display = '';
  monsterContainerEl.style.display = '';
  monsterHealthEl.style.display = '';
  monsterHealthEl.innerHTML = '';
  monsterContainerEl.innerHTML = '';

  const chestImg = document.createElement('img');
  chestImg.id = 'Mimic_0';
  chestImg.classList.add('monster');
  chestImg.onload= ()=>{
    chestImg.style.height= `${chestImg.naturalHeight}px`; 
    chestImg.style.width= `${chestImg.naturalWidth}px`; 
  }
  monsterContainerEl.appendChild(chestImg);

  if(player.location.treasureClaimed){
    chestImg.src = `./assets/images/tile_objects/Chest_empty.png`;
    chestImg.classList.remove('monster');
  }else{
    if(openChest){
      if(player.location.roomType === 4){
        spawnMimic();
      }else if(player.location.roomType === 2){
        openTreasure();
      }
    }else{
      chestImg.src = `./assets/images/tile_objects/Chest.png`;
    }
  }
}

function openTreasure(){
  const chestImg = document.getElementById('Mimic_0');
  chestImg.src = './assets/images/tile_objects/Chest_opening.gif';
  player.location.treasureClaimed = true;
  writeToGameLog(`The chest contained ${rewardPlayer('chest')} gold!\nThank goodness it wasn't a mimic....`) ;
  setTimeout(() => {
    chestImg.src = './assets/images/tile_objects/Chest_idle_gold.gif';
  }, 2000);
}

function rewardPlayer(type = '',mon){
  let diff, amount;
  typeof player.location === 'number' ? diff=player.location : diff=player.location.difficulty;
  switch(type){
    case 'chest':
      amount = Math.floor((Math.random() * diff)+1) *diff;
      player.inventory.gold += amount;
      break;
    case 'monster':
      typeof mon === 'Monster' ? amount = Math.floor((Math.random() * mon.diff)+1)
          : amount = Math.floor((Math.random())+1)
      player.inventory.gold += amount;
      break;
  }
  return amount;
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
  // attackButtonEl.style.display = 'none';
  monsterHealthEl.style.display = 'none';
  
  if(typeof player.location === 'number' && !combat){
    if(path[player.location].roomType !==3){
      path[player.location].exits.forEach(exit => {
        switch(exit){
          case 1:
            leftDoor.style.display = '';
            break;
          case 2:
            backDoor.style.display = '';
            break;
          case 3:
            rightDoor.style.display = '';
            break;
        }//*END switch
      });//*END forEach
    }else{
      backDoor.style.display = '';
      backDoor.style.backgroundImage = 'url("../assets/images/tile_objects/boss_door.png")';
    }
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
    goldEl.textContent = `Gold: ${player.inventory.gold}`
  }
}

function gameOverRender(){

}

function writeToGameLog(strToAdd){
  gameLog.innerText += `\n`;
  if(strToAdd) gameLog.innerText += strToAdd;
  gameLog.scrollTop = gameLog.scrollHeight;
}
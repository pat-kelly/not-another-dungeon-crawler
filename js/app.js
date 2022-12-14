/*------------ Imports ------------*/
import { Monster,generateMonster } from "../data/monsters.js";
import { path, MapTile, generatePath } from "../data/map.js"
import { Character } from "../data/char.js";
import * as audio from "../data/audio.js";

/*------------ Constants ------------*/
let combat, won, numSlimesKilled, player, muted=true, gameState;

/*---- Cached Element References ----*/
const displayWindowEl = document.getElementById('display-area');
const transitionEl = document.getElementById('transition');
const monsterContainerEl = document.getElementById('monster-container');
const displayCover = document.getElementById('splash-screen');
const audioToggleEl = document.getElementById('audio-toggle');

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
audioToggleEl.addEventListener('click', audioHandler);

document.onload = init();

/*------------ Game Setup ------------*/
function init(){
  generatePath();
  gameState = 'title';
  audio.defaultLoop.currentTime = 0;
  audio.titleSong.currentTime = 0;
  audio.gameOverTrack.currentTime = 0;
  audioHandler();
  player = new Character(100, 100, 0);
  gameLog.textContent = '';
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
  monsterContainerEl.style.marginTop = '250px';
  displayCover.innerHTML = '';
  displayCover.style.backgroundColor = 'rgb(0,0,0)';
  displayCover.style.zIndex = '101';
  displayCover.style.backgroundImage = 'url("./assets/images/title_screen.gif")';
  const btn = document.createElement('button');
  btn.textContent = 'Enter the Dungeon';
  btn.addEventListener('click', hideSplash);
  displayCover.appendChild(btn);
  btn.id = 'title-button';
  render();
}
/*------------ Functions ------------*/

function audioHandler(evt){
  
  if(evt) muted ? muted = false : muted = true;

  audio.off();

  switch(gameState){
    case 'title':
      muted ? audio.titleSong.pause() : audio.titleSong.play();
      break;
    case 'gameLoop':
      muted ? audio.defaultLoop.pause() : audio.defaultLoop.play();
      break;
    case 'combat':
      handleCombatAudio();
      break;
    case 'gameOver':
      muted ? audio.gameOverTrack.pause() : audio.gameOverTrack.play();
      break;
  }
  
}

function handleCombatAudio(){
  if(combat && !muted){
    if(typeof player.location === 'object'){
      if(player.location.monsters[0].type === 'Demon'){
        audio.bossLoop.play();
      }else{
        if((player.location.checkAliveMonsters())) audio.fightLoop.play()
      }
    }else{
      audio.fightLoop.play()
    }
  }
}

function hideSplash(){
  displayCover.classList.add('animate__fadeOut');
  setTimeout(() => {
    displayCover.style.zIndex = -1;
    displayCover.innerHTML = '';
    gameState = 'gameLoop';
    audioHandler();
    displayCover.classList.remove('animate__fadeOut');
    // if(!muted) audio.switchTrack('defaultLoop', .02);
  }, 1500);
}

function navCheck(evt){
  if(evt.target.className !== 'nav-btn') return;  
  const dirClicked = evt.target.id.replace('nav-move-', '');
  if(combat && dirClicked !== 'back') return;
  
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
      gameState = 'gameLoop';
      audioHandler();
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
    path[player.location].roomType === 3 ? writeToGameLog(`You see before you a set of large doors. There is laughter echoing through the halls..`) 
      : writeToGameLog(path[player.location].getDescription());
  }else{
    writeToGameLog("You can't go that direction!")
    return;
  }

  if(!muted) audio.play('move', .3);
  transitionEl.style.backgroundColor = 'black';
  for(let el of document.getElementsByClassName('monster')){
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
  // 0 is path, 1 is monster room, 2 is treasure, 3 is boss, 4 is mimic.
  
  switch(tile.roomType){
    case 1:
      createMonsterList(tile);
      let curMonsters = tile.getMonsters();
      let strToPrint = `You walk into the room to find `;
      let idx = Object.keys(curMonsters).length;
      for(let mon in curMonsters){
        if(idx === 1) strToPrint += ', and ';
        else if(idx !== Object.keys(curMonsters).length) strToPrint += ', ';

        curMonsters[mon] > 1 ? strToPrint += `${curMonsters[mon]} ${mon}s` 
          : strToPrint += `${curMonsters[mon]} ${mon}`;
        
        idx --;
      }
      writeToGameLog(strToPrint);
      combat = true;
      if(tile.checkAliveMonsters()) gameState = 'combat';
      audioHandler();
      break;
    case 2:
      writeToGameLog('You see a treasure chest before you.');
      break;
    case 3:
      writeToGameLog('The great doors swing open, and you see before you.... a Slime.');
      createMonsterList(tile);
      combat = true;
      gameState = 'combat';
      audioHandler();
      break;
    case 4:
      writeToGameLog('You see a treasure chest before you.');
      createMonsterList(tile);//exits
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
    }else if(tile.roomType === 3 && !tile.monsters.length){
      tile.monsters.push(generateMonster(tile));
    }
  }else if(tile.monsters.length === 0){
    /* let pathDiff = path[player.location].difficulty;
    while(existingDiff < tile.difficulty && tile.roomType !==4){
      console.log(pathDiff,'pathdiff')
    } */ //*#TODO
    let tileDiff = 0;
    while(tileDiff <= tile.difficulty && tileDiff < 8){
      tile.monsters.push(generateMonster(tile))
      tileDiff = (tile.getMonsterDiff());
    }
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
  let idx = evt.target.id.slice(-1);
  
  const curTarget = player.location.monsters[idx];
  const targetEl = document.getElementById(`${curTarget.type}_${idx}`);
  targetEl.classList.add('noClick');
  let noClickTime = curTarget.hitTime + curTarget.atkTime + 200;
  setTimeout(() => {
    targetEl.classList.remove('noClick');
  }, noClickTime);
  const targetPath = curTarget.type.replace(' ','_');
  //adjust monster hp and animate either hit or death
  let playerDmg = player.getDmg();
  if(curTarget.hp > 0){
    if(playerDmg > curTarget.hp) curTarget.hp = 0;
    else curTarget.hp -= playerDmg;
    writeToGameLog(`You hit the ${curTarget.type === 'Demon Slime' ? 'Slime' : curTarget.type} for ${playerDmg} damage!`);
    if(!muted && curTarget.type !== 'Mimic') audio.play(curTarget.type, .1);
    if(!muted && curTarget.type === 'Demon Slime') audio.play('Slime', .1);
    if(curTarget.hp){
      targetEl.src = `./assets/images/monsters/${targetPath}/${targetPath}_hit.gif`
      setTimeout(function(){
        targetEl.src = `./assets/images/monsters/${targetPath}/${targetPath}_attack.gif`
        if(!muted && curTarget.type === 'Mimic') audio.play(curTarget.type, .1);
        setTimeout(function(){
          player.hp -= curTarget.dph;
          writeToGameLog(`The ${curTarget.type === 'Demon Slime' ? 'Slime' : curTarget.type} hits you for ${curTarget.dph} damage!`);
          combatRender(true);
          targetEl.src = `./assets/images/monsters/${targetPath}/${targetPath}_idle.gif`
        },curTarget.atkTime)//* atk timeout
      },curTarget.hitTime) //*hit timeout
    }else{
      if(curTarget.type === 'Demon Slime'){
        bossRender(true, targetEl, curTarget);
        return;
      }
      if(curTarget.type === 'Slime') numSlimesKilled++; //*#TODO - work this into the boss difficulty
      writeToGameLog(`The ${curTarget.type} has died, and dropped ${rewardPlayer('monster',curTarget)} gold!`);
      if(curTarget.type === 'Demon'){
        writeToGameLog(`As a reward for completing the dungeon, you are awarded an extra ${rewardPlayer('flat',undefined,50)} gold!`);
        won = true;
        gameState = 'gameOver';
        audioHandler();
        gameOverRender();
      }
      targetEl.src = `./assets/images/monsters/${targetPath}/${targetPath}_hit.gif`;
      setTimeout(()=>{
        targetEl.src = `./assets/images/monsters/${targetPath}/${targetPath}_death.gif`;
        setTimeout(()=>{
          targetEl.src = `./assets/images/monsters/${targetPath}/${targetPath}_corpse.png`;
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

function bossRender(transform = false, targetEl, curTarget){
  hideDoorsUpdateHP();
  displayWindowEl.style.backgroundImage = 'url("../assets/images/battle_room.png")'
  monsterContainerEl.style.display = '';
  monsterHealthEl.style.display = '';
  monsterContainerEl.style.marginTop = '-200px';
  if(transform){
    targetEl.src = `./assets/images/monsters/${curTarget.type.replace(' ','_')}/${curTarget.type.replace(' ','_')}_hit.gif`;
    player.location.monsters.pop();
    player.location.monsters.push(new Monster('Demon'));
    audioHandler();
  }
  
  combatRender();
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

function rewardPlayer(type = '',mon, amt=0){
  let diff, amount;
  typeof player.location === 'number' ? diff=player.location : diff=player.location.difficulty;
  switch(type){
    case 'chest':
      amount = Math.floor((Math.random() * diff)+1) *diff;
      player.inventory.gold += amount;
      break;
    case 'monster':
      typeof mon === 'object' ? amount = Math.floor((Math.random() * mon.diff)+1)
          : amount = Math.floor((Math.random())+1)
      player.inventory.gold += amount;
      break;
    case 'flat':
      amount = amt;
      player.inventory.gold += amt;
      break;
  }
  return amount;
}

function spawnMimic(){
  const chest = document.getElementById('Mimic_0');
  chest.src = './assets/images/monsters/Mimic/Mimic_activate.gif';
  chest.classList.add('noClick')
  gameState = 'combat';
  combat = true;
  audioHandler();
  setTimeout(() => {
    chest.classList.remove('noClick');
    chest.src = './assets/images/monsters/Mimic/Mimic_idle.gif';
  }, 2900);
}

function combatRender(atk = false){
  hideDoorsUpdateHP();
  if(typeof player.location === 'number') return; //*if the player's location is a number, we shouldn't be here.
  displayWindowEl.style.backgroundImage = 'url("../assets/images/battle_room.png")'
  monsterContainerEl.style.display = '';
  monsterHealthEl.style.display = '';

  if(!atk) monsterContainerEl.innerHTML = ''; 
  
  monsterHealthEl.innerHTML = '';
  
  player.location.monsters.forEach((monster, idx) => {
    
    //Things that only need to render the first time.
    if(!atk){
      const monImg = document.createElement('img'); 
      monImg.id = `${monster.type}_${idx}`; 
      monImg.classList.add('monster'); 
      if(monster.type === 'Demon'){
        monImg.src = `./assets/images/monsters/Demon/Demon_spawn.gif`;
        monImg.classList.add('noClick');
        setTimeout(() => {
          monImg.classList.remove('noClick');
          monImg.src = `./assets/images/monsters/Demon/Demon_idle.gif`;
        }, 3200);
      }else{
        monImg.src = `./assets/images/monsters/${monster.type.replace(' ', '_')}/${monster.type.replace(' ', '_')}_idle.gif` 
      }
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
    const monLabel = document.createElement('p');
    monLabel.textContent = `${monster.type === 'Demon Slime' ? 'Slime' : monster.type} HP`;
    monsterHealthEl.appendChild(monLabel);

    
    let numBars = monster.hp / 30;
    let remainder = monster.hp;
    
    let curBar;
    while(numBars > 0){
      if(numBars > 1){
        curBar = 30;
      }else{
        curBar = remainder;
      }
      remainder -= curBar;
      
      const monHp = document.createElement('div');
      monHp.classList.add('health-bar');
      monHp.style.width = `${curBar * 10}px`;
      monHp.style.height = '10px';
      monsterHealthEl.appendChild(monHp);
      numBars -= 1;
    }
  });
}//*END combatRender

function render(){
  displayWindowEl.style.backgroundImage = 'url("../assets/images/room.png")';
  hideDoorsUpdateHP();
  monsterContainerEl.style.display = 'none';
  // attackButtonEl.style.display = 'none';
  monsterHealthEl.style.display = 'none';
  backDoor.style.backgroundImage = 'url("../assets/images/tile_objects/backDoor.png")'
  
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
    gameState = 'gameOver';
    audioHandler();
    gameOverRender();
    return;
  }else{
    hpEl.textContent = player.hp;
    hpEl.style.width = `${player.hp * 2}px`;
    manaEl.textContent = player.mp;
    manaEl.style.width = `${player.mp * 2}px`;
    goldEl.textContent = `Gold: ${player.inventory.gold}`
  }
}

function gameOverRender(){
  displayCover.style.zIndex = '101';
  displayCover.classList.add('animate__fadeIn');
  displayCover.innerHTML = '';
  displayCover.style.color = 'white';

displayCover.innerHTML=`
  <div id="game-over-container">
    <div class="game-over-div">${won ? `You beat the boss and escaped the dungeon!` : `The dungeon has claimed another life`}</div>
    <div class="game-over-div">You were able to make it <span class="red-text">${typeof player.location === 'number' ? player.location : player.locationHistory[player.locationHistory.length-1]}</span> rooms</div>
    <div class="game-over-div">Total Gold Collected:<span class="red-text"> ${player.inventory.gold}</span></div>
    <button id="resetBtn">Play again?</button>
  </div>
`;

document.getElementById('resetBtn').addEventListener('click', init);

}

function writeToGameLog(strToAdd){
  gameLog.innerText += `\n`;
  if(strToAdd) gameLog.innerText += strToAdd;
  gameLog.scrollTop = gameLog.scrollHeight;
}
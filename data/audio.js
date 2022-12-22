let titleSong = new Audio('../assets/audio/tracks/title_theme_loop.wav');
  titleSong.volume = .1;
  titleSong.loop = true;
let gameOverTrack = new Audio('../assets/audio/tracks/gameOver.wav');
  gameOverTrack.volume = .1;
  gameOverTrack.loop = true;
let defaultLoop = new Audio('../assets/audio/tracks/defaultLoop.wav');
  defaultLoop.volume = .05;
  defaultLoop.loop = true;
let fightLoop = new Audio('../assets/audio/tracks/fightLoop.wav');
  fightLoop.volume = .07;
  fightLoop.loop = true;
let bossLoop = new Audio('../assets/audio/tracks/bossLoop.wav');
  bossLoop.volume = .07;
  bossLoop.loop = true;


function play(fileName, volume){
  if(typeof fileName !== 'string' || typeof volume !== 'number') return;

  let curAudio = new Audio(`../assets/audio/effects/${fileName}.wav`)

  curAudio.volume = volume;
  curAudio.play();
}

const track = [];

function toggleTrack(fileName, volume){
  if(typeof fileName !== 'string' || typeof volume !== 'number') return;

  let curAudio;
  if(track.length) {
    curAudio = track.pop();
    curAudio.pause();
  }
  curAudio = new Audio(`../assets/audio/tracks/${fileName}.wav`)
  track.push(curAudio);
  curAudio.volume = volume;
  curAudio.play();
}

function off(){
  titleSong.pause();
  defaultLoop.pause();
  gameOverTrack.pause();
  bossLoop.pause();
  bossLoop.currentTime = 0;
  fightLoop.pause();
  fightLoop.currentTime =0;  
}

export{ play, off, titleSong, gameOverTrack, defaultLoop, fightLoop, bossLoop}
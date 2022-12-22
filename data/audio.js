let titleSong = new Audio('../assets/audio/tracks/title_theme_loop.wav');
  titleSong.volume = .1;
let gameOverTrack = new Audio('../assets/audio/tracks/gameOver.wav');
  gameOverTrack.volume = .1;
let defaultLoop = new Audio('../assets/audio/tracks/defaultLoop.wav');
  defaultLoop.volume = .05;
let fightIntro = new Audio('../assets/audio/tracks/fightIntro.wav');
  fightIntro.volume = .05;
let fightLoop = new Audio('../assets/audio/tracks/fightLoop.wav');
  fightLoop.volume = .07;
let bossLoop = new Audio('../assets/audio/tracks/bossLoop.wav');
  bossLoop.volume = .07;


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
  fightIntro.pause();
  fightLoop.currentTime =0;
  fightIntro.currentTime =0;
  
}

export{ play, off, titleSong, gameOverTrack, defaultLoop, fightIntro, fightLoop, bossLoop}
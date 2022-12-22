let titleSong = new Audio('../assets/audio/tracks/title_theme_loop.wav');
  titleSong.volume = .1;
let gameOverTrack = new Audio('../assets/audio/tracks/gameOver.wav');
  gameOverTrack.volume = .1;
let defaultLoop = new Audio('../assets/audio/tracks/defaultLoop.wav');
  defaultLoop.volume = .05;

function play(fileName, volume){
  if(typeof fileName !== 'string' || typeof volume !== 'number') return;

  let curAudio = new Audio(`../assets/audio/${fileName}.wav`)

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

function switchTrack(fileName, volume){
  console.log(track);
  let prevAudio = track.pop();
  prevAudio.pause;
  
  // let newAudio = new Audio(`../assets/audio/tracks/${fileName}.wav`);
  // newAudio.volume =volume;
  // newAudio.play();
}

export{ titleSong,gameOverTrack,defaultLoop,play }
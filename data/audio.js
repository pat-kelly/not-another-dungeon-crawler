
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
    return;
  }
  else curAudio = new Audio(`../assets/audio/tracks/${fileName}.wav`)
  track.push(curAudio);
  curAudio.volume = volume;
  curAudio.play();
}

export{ play, toggleTrack }
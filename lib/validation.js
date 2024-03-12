function isAnyEmpty (body) {
  let inputVals = Object.values(body);
  return inputVals.some( (val) => val.length === 0);
}
function exceedsMaxLength (body) {
  let inputVals = Object.values(body);
  return inputVals.some(val => val.length > 20);
}
function isNotUnique (val, playlist) {
  return playlist.some(song => song.videoId === val); 
}
module.exports = {isAnyEmpty, exceedsMaxLength, isNotUnique};

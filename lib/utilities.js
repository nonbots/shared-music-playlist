class Utilities {
    static incrementId(entity) {
        entity.id += 1;
    }
    static  getId(entity) {
        Utilities.incrementId(entity);
        return entity.id;
    }
    static getDuration(milli) {
      let totalSeconds = Math.floor(milli / 1000);
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds = totalSeconds - (hours * 3600);
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.ceil(totalSeconds) % 60;
      let durComps = [];
      console.log(hours, minutes, seconds, "IN GETDURATION");
      Utilities.formatDuration(hours, durComps);
      Utilities.formatDuration(minutes, durComps);
      Utilities.formatDuration(seconds, durComps);
      return durComps.join(':');
    }
    static formatDuration(durComp, durComps){
      if (durComp === 0) {
        durComps.push("00");
      } else if (durComp > 0 && durComp < 10) {
        durComps.push( "0" + durComp);
      } else {
        durComps.push(durComp);
      }
    }
}
module.exports = Utilities;

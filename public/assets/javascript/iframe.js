console.log("IFRAME IS RUNNING");
// 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  let videoIds;//"id1,id2"
  let videoId;
  let idIndex;
  let playlist;
  function getIdIndex() {
     return videoIds.indexOf(videoId);
  }

  function setNextIdIndex() {
      console.log("current INDEX", idIndex, "LENGTH OF IDS", videoIds.length);
      if (idIndex >= videoIds.length - 1) {
          idIndex = 0;
      } else {
          idIndex += 1
      }
  }
  function onYouTubeIframeAPIReady() {
    playlist = document.getElementById('playlist').value.split(",");
    videoId = document.getElementById('videoId').value;
    videoIds = document.getElementById('videoIds').value.split(",");
    console.log("THIS IS THE VIDEO ID IN IFRAME", videoId);
    console.log("THESE ARE THE IDS IN IFRAME", videoIds);
    console.log(playlist);
    idIndex = getIdIndex();
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: videoId,
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        console.log("THE SONG ENDED");
        setNextIdIndex();
        console.log("THE NEXT INDEX",idIndex);
        console.log("THESE ARE THE IDS", videoIds);
        console.log("THE NEXT SONGS IS", videoIds[idIndex]);
        player.loadVideoById(videoIds[idIndex]);
    }
  }


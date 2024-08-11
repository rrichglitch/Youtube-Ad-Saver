// console.log("content");
//initialising storage
chrome.storage.sync.get(function(stor) {if(!stor.ids) chrome.storage.sync.set({ids:[], checked:[]});});
// setting up extension side listener to update storage
//const token = chrome.runtime.id + ':' + performance.now() + ':' + Math.random();
window.addEventListener('yt_ad_up', e => {
  // console.log("heard");
  function addAd(id){
    fetch('https://www.youtube.com/get_video_info?video_id='+id)
      .then(response => response.text())
      .then((resTxt) => {
        let params = new URLSearchParams(resTxt);
        let plyr_rspn = JSON.parse(params.get('player_response'))
        // update the id list AFTER info is confirmed to keep in sync
        if(plyr_rspn != null){
          // put in the newest item
          chrome.storage.sync.set({[id]: plyr_rspn.videoDetails});
          // put in the newest id
          chrome.storage.sync.get(function(nstor) {
            chrome.storage.sync.set({ids: nstor.ids.concat([id])});
          });
        }else console.log("ad info failed to fetch");
    })
  }
  chrome.storage.sync.get(function(stor) {
    let checkArr = stor.ids.slice();
    // for each ad from injScript
    for(i in e.detail){ 
      //if its not already in the history
      if(!checkArr.includes(e.detail[i])){
        checkArr.push(e.detail[i]);
        chrome.storage.sync.set({checked: checkArr});
        // if the storage has less than 50 ad entries, else...
        if(stor.ids.length < 50){addAd(e.detail[i]);}else{
          // remove the earliest 2 items
          delete stor[stor.ids[0]];
          delete stor[stor.ids[1]];
          stor.ids = stor.ids.slice(2);
          stor.checked = stor.ids;
          chrome.storage.sync.clear();
          chrome.storage.sync.set(stor);
          addAd(e.detail[i]);
        }
    }}
  });
});
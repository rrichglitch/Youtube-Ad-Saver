// set up injection script
if(typeof adInjScript == 'undefined'){
  var adInjScript = document.createElement('script');
  var ytadtoken = 'yt_ad_up';
}
adInjScript.id="yt_ad_inj"
adInjScript.textContent = '(' + (ytadtoken => {
  // console.log("injected");
  // adding listener to update the list of ids on load
  document.getElementsByTagName('video')[0].addEventListener('loadeddata',e => {
    // console.log("loaded");
    setTimeout(function(){
        let checkAds = [];
        for(entry of ytcsi.debug){
          if(entry.timerName == ("video_to_ad"||"ad_to_ad") && entry.info.adVideoId){
            checkAds.push(entry.info.adVideoId);
        }}
        let fill = [];
        for(ad of checkAds) if(!fill.includes(ad)) fill.push(ad);
        if(fill.length >0) window.dispatchEvent(new CustomEvent(ytadtoken, {detail: fill}));
    },200);
  });
  document.body.removeChild(document.getElementById("yt_ad_inj"));
}) + `)("${ytadtoken}")`;
// inject script
document.body.appendChild(adInjScript);

function refresh(){
    chrome.storage.sync.get(function(stor){
        let keys = Object.keys(stor);
        console.log(stor);
        console.log(keys.length-2);
        if(stor.ids.length != keys.length-2){
            let dif = [];
            for(check of stor.checked) if(!keys.includes(check)) dif.push(check);
            console.log(dif);
        }
        for (var i = stor.ids.length - 1; i >= 0; i--){
            let curID = stor.ids[i];
            if(typeof stor[curID] != 'undefined'){
                let tag = document.createElement("div");
                tag.className = "vid_section";
                document.getElementById('links').appendChild(tag);
                let img = document.createElement('div');
                img.className="thumbnail";
                img.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=`+curID+`" target="_blank">
                        <img width="168px" src="https://img.youtube.com/vi/`+curID+`/mqdefault.jpg">
                        <span class="time_overlay">`+secToTime(stor[curID].lengthSeconds)+`</span>
                    </a>
                `;
                tag.appendChild(img);
                let infoBlock = document.createElement("div"); 
                infoBlock.className = "info"
                infoBlock.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=`+curID+`" target="_blank">
                        <span class="video_title">`+stor[curID].title+`</span>
                    </a>
                    <div id="secondary_info">
                        <a href="https://www.youtube.com/channel/`+stor[curID].channelId+`" target="_blank">
                            <span class="author">`+stor[curID].author+`</span>
                        </a>
                        <span class="views">`+round(stor[curID].viewCount)+` views</span>
                    </div>
                `;
                tag.appendChild(infoBlock);
        }}
});}

function clearAll(){
    chrome.storage.sync.clear();
    chrome.storage.sync.set({ids:[], checked:[]});
    document.getElementById('links').innerHTML = "";
    refresh();
}
function setFull(){
    chrome.storage.sync.get(function(stor){
        let keys = Object.keys(stor);
        if(stor.ids.length > keys.length-2){
            for(id of stor.ids){
                if(typeof stor[id] == 'undefined') {
                console.log(id);
                let save = id;
                fetch('https://www.youtube.com/get_video_info?video_id='+save)
                .then(response => response.text())
                .then((resTxt) => {
                    let params = new URLSearchParams(resTxt);
                    let plyr_rspn = JSON.parse(params.get('player_response'))
                    console.log({[save]: plyr_rspn.videoDetails});
                    chrome.storage.sync.set({[save]: plyr_rspn.videoDetails});
            })}}
        }
        if(stor.ids.length > 50 || keys.length > 52){
            let newStor = {};
            newStor.ids = stor.ids.slice(stor.ids.length-50);
            newStor.checked = newStor.ids;
            for (id of newStor.ids){ newStor[id] = stor[id]; }
            chrome.storage.sync.clear();
            chrome.storage.sync.set(newStor);
        }
    });
    // refresh();
}
function round(num){
    let snum = String(num);
    if(snum.length < 4) return snum;
    else if(snum.length < 7){
        if(snum.length == 4) return snum[0]+'.'+snum[1]+'K';
        else return snum.substring(0, snum.length-3)+"K";
    }else if(snum.length < 10){
        if(snum.length == 7) return snum[0]+'.'+snum[1]+'M';
        else return snum.substring(0, snum.length-6)+"M";
    }else if(snum.length < 13){
        if(snum.length == 10) return snum[0]+'.'+snum[1]+'B';
        else return snum.substring(0, snum.length-9)+"B";
    }else if(snum.length < 16){
        if(snum.length == 13) return snum[0]+'.'+snum[1]+'T';
        else return snum.substring(0, snum.length-12)+"T";
    }
    return "Too Many";
}

function secToTime(secs){
    let hours = Math.floor(secs/3600);
    let minutes = Math.floor((secs-(hours*3600))/60);
    let seconds = secs%60;
    let out = ""+minutes+":"
    if(seconds <= 9) out+="0"+seconds;
    else out+=seconds;
    if(hours >= 1){
        if(minutes <= 9)
            return String(hours)+":0"+out;
        else return String(hours)+":"+out;
    }
    return out;
}

refresh();
document.getElementById('clear_button').addEventListener('click',clearAll,false);
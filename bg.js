chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading') {
      // if(tab.url != undefined)
      if(tab.url.substring(0,32) == 'https://www.youtube.com/watch?v='){
          chrome.tabs.executeScript(tabId, {file: 'injector.js'});
      }
  }
});
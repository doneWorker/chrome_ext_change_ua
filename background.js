// predefined list of UA's
const userAgents = [
    {
      name: "ie8",
      value: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)"
    },
    {
      name: "ie9",
      value: "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)"
    },
    {
      name: "Samsung Galaxy S9",
      value: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36"
    },
    {
      name: "Chromecast",
      value: "Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36"
    }
  ];

// do no change user agent if "default"
let currentUA = "default";

chrome.runtime.onMessage.addListener(function(msg) {
  if(msg === 'updateua') {
      chrome.storage.local.get(['currentUA'], function(data) {
        currentUA = data.currentUA;
      });
  }
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({ualist: userAgents});

  // change User Agent
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if(currentUA !== "default") {
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name.toLowerCase() === 'user-agent') {
          details.requestHeaders[i].value = currentUA;
          break;
        }
      }
  }
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders", "extraHeaders"]
);
});
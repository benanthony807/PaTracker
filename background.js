// array denoting items that have had their prices decrease
let priceChanged = [];

// create an alarm that goes of every periodInMinutes
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('refresh', { periodInMinutes: 10000.2 });
});

// listen for alarm (this listens for all alarms, but the only one is 'refresh')
// when alarm goes of checkForUpdates
chrome.alarms.onAlarm.addListener((alarm) => {
  checkForUpdates();
});

// check for any price changes
function checkForUpdates() {
  // fetch the things currently being tracked from memory
  chrome.storage.sync.get("key", function(items) {
    let tracked = items.key;
    let promises = [];
    // put all of the async price fetches into an array called promises
    for (let i = 0; i < tracked.length; i++) {
      promises.push(getNewPrice(tracked[i]));
    }
    Promise.all(promises)
      .then((newPrices) => {
        for (let i = 0; i < tracked.length; i++) {
          let curr = tracked[i];
          // if a price has dropped add it to the priceChanged arr
          if (curr.price > newPrices[i]) {
            priceChanged.push({curr: curr, newPrice: newPrices[i]});
          }
          for (let change of priceChanged) {
            chrome.notifications.create(change.curr.url,  {
                                                           type: "basic", 
                                                           title: `Price drop on ${change.curr.colour} ${change.curr.name} from ${change.curr.price} to ${change.newPrice}`, 
                                                           iconUrl: "128.png",
                                                           message: "Click to see!"
                                                           });
          }
          // wipe the items we've just notified user about from the list of things to notify user about
          priceChanged = []; 
          chrome.notifications.create("url",  {
                                               type: "basic", 
                                               title: "Price drop on this item from x to y", 
                                               iconUrl: "128.png",
                                               message: "Click to see!"
                                             });
          console.log("got here!!!");
        }
      });  
  });
}

// when the notification is clicked open a new tab with the url of the item whose price dropped
chrome.notifications.onClicked.addListener((notificationId) => {
  // open the url of the decreased price, notificationId is url
  let url = notificationId;
  chrome.tabs.create({url: "https://developer.chrome.com/extensions/tabs#method-create"});
});


function getNewPrice(item) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    // make an http request to get the DOM of the url we want to check
    let newPrices = [];
    xhr.open("GET", item.url, true);
    // makes the response type a document obj
    xhr.responseType = 'document';
    // once loaded do:
    xhr.onload = function(e) {
      try {
        DOM = xhr.response;
        // grab information from correct colour
        let span = DOM.querySelector(`div[data-caption='${item.colour}']`);
        let newPrice = span.querySelector("span.sales").textContent.trim().substring(3); // prices are in the form C$ 123, just want number
        console.log(newPrice);
        resolve(newPrice);
      // if we can't find what we're looking for just return a large number so we can still resolve and promises.all doesn't reject
      } catch (e) {
          resolve(Number.MAX_SAFE_INTEGER);
      }
    }
    // sends the get request
    xhr.send();
  });
}

// go to url, click on the appropriate colour, grab price, compare with price
// if newprice equals price then add this to the list of things to alert about

// if list of things to alert about is not empty, alert user with a popup
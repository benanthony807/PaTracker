// array denoting items that have had their prices decrease
let priceChanged = [];

// create an alarm that goes of every periodInMinutes
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('refresh', { periodInMinutes: 30 });
});

// listen for alarm (this listens for all alarms, but the only one is 'refresh')
// when alarm goes of checkForUpdates
chrome.alarms.onAlarm.addListener((alarm) => {
  checkForUpdates();
});

// check for any price changes
function checkForUpdates() {
  // fetch the things currently being tracked from memory
  chrome.storage.local.get("key", function(items) {
    let tracked = items.key;
    let promises = [];
    // put all of the async price fetches into an array called promises
    for (let i = 0; i < tracked.length; i++) {
      promises.push(getNewPrice(i, tracked));
    }
    Promise.all(promises)
      .then((newPrices) => {
        checkForPriceDrops(tracked, newPrices);
        // notify user of each item whose price dropped, does nothing if no prices drop
        notifyUser();
        // once an item's price drops remove it from tracked so user doesn't continue to get notified about it
        removeDroppedItems(priceChanged, tracked);
        // wipe the items we've just notified user about from the list of things to notify user about
        priceChanged = []; 
      });  
  });
}

// when the notification is clicked open a new tab with the url of the item whose price dropped
chrome.notifications.onClicked.addListener((notificationId) => {
  // open the url of the decreased price, notificationId is url
  let url = notificationId;
  chrome.tabs.create({url: url});
});

function checkForPriceDrops(tracked, newPrices) {
  for (let i = 0; i < tracked.length; i++) {
    let curr = tracked[i];
    // if a price has dropped add it to the priceChanged arr
    if (curr.price > newPrices[i]) {
      priceChanged.push({curr: curr, newPrice: newPrices[i]});
    }
  }
}

function notifyUser() {
  for (let change of priceChanged) {
    chrome.notifications.create(change.curr.url,  {
                                                   type: "basic", 
                                                   title: `Price drop on ${change.curr.colour} ${change.curr.name} from ${change.curr.price} to ${change.newPrice}`, 
                                                   iconUrl: "images/pat19.png",
                                                   message: "Click to see!"
                                                   });
  }
}

function removeDroppedItems(priceChanged, tracked) {
  for (let item of priceChanged) {
    let curr = item.curr;
    tracked.splice(tracked.indexOf(curr, 1));
  }
}

function getNewPrice(i, tracked) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    // make an http request to get the DOM of the url we want to check
    let newPrices = [];
    let item = tracked[i];
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
          // remove the problematic item from tracked 
          tracked.splice(i, 1);        
          resolve(Number.MAX_SAFE_INTEGER);
      }
    }
    // sends the get request
    xhr.send();
  });
}
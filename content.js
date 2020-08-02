chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // find price and other identifiers in dom
  let span = document.getElementsByClassName("js-buy-config-select-color buy-config-select-color")[0];
  let price = document.querySelector("span.value").textContent.trim().substring(3); // prices are in the form C$ 123, just want number
  let colour = span.textContent.trim();
  let url = window.location.toString();
  let name = document.querySelector("h1").textContent.trim();
  chrome.storage.local.get("key", function(items) {
    // all of the items currently be tracked
    let tracked = items.key;
    // prevents errors when list is uninitialized and length property gets called
    if (tracked === null || tracked === undefined) 
      tracked = [];
    // prospective item to track/untrack
    let curr = {url:url, price:price, colour:colour, name:name};
    handleRequest(request, curr, tracked);
    console.log(tracked);
  });
});

function handleRequest(request, curr, tracked) {
  if (request === 1) {        // track this thing
    trackItem(tracked, curr);
  } else if (request === 2) { // untrack this thing 
    untrackItem(tracked, curr);
  } else if (request === 3) { // untrack everything
    tracked = [];
    alert("All items removed")
  } 
  // store the altered tracked array into chrome storage
  chrome.storage.local.set({key: tracked}); 
}

function trackItem(tracked, curr) {
  for (let i = 0; i < tracked.length; i++) {
    let item = tracked[i];
    if (item.price === curr.price && item.url === curr.url && item.colour === curr.colour) {
      alert("Item is already being tracked!");
      return;
    }
  }
  tracked.push(curr);
  alert(`Tracking ${curr.colour} ${curr.name}`);
}


function untrackItem(tracked, curr) {
  for (let i = 0; i < tracked.length; i++) {
    let item = tracked[i];
    if (item.price === curr.price && item.url === curr.url && item.colour === curr.colour) {
      tracked.splice(i, 1);
      alert(`Removed ${curr.colour} ${curr.name}`);
      return;
    }
  }
    alert("This item was not previously being tracked");
}

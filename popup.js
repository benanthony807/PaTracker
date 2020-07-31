document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button.track').addEventListener('click', onclick1, false)
  function onclick1() {
    chrome.tabs.query({currentWindow: true, active: true},
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 1)
    });
  }
  document.querySelector('button.untrack').addEventListener('click', onclick2, false)
  function onclick2() {
    chrome.tabs.query({currentWindow: true, active: true},
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 2)
    });
  }
  document.querySelector('button.untrackall').addEventListener('click', onclick3, false)
  function onclick3() {
    chrome.tabs.query({currentWindow: true, active: true},
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 3)
    });
  }
  document.querySelector('button.viewall').addEventListener('click', onclick4, false)
  function onclick4() {
    chrome.tabs.create({url: "viewall.html"});
  }
}, false)
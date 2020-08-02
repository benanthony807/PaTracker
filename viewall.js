chrome.storage.local.get("key", function(items) {
  // all of the items currently be tracked
  let tracked = items.key;
  const table = document.getElementById("trackedItems");
  // populate the table with items in storage
  for (let item of tracked) {
    let row = table.insertRow();
    let name = row.insertCell(0);
    name.innerHTML = item.name;
    let colour = row.insertCell(1);
    colour.innerHTML = item.colour;
    let price = row.insertCell(2);
    price.innerHTML = item.price;
    let url = row.insertCell(3);
    url.outerHTML = `<a href='${item.url}' target='_blank'>Click to go to page</a>`;
    url.href = item.url;    
  }
});

chrome.storage.local.get("key", function(items) {
  // all of the items currently be tracked
  let tracked = items.key;
  const table = document.getElementById("trackedItems");
  // populate the table with items in storage
  for (let item of tracked) {
    let row = table.insertRow();
    let img = row.insertCell();
    img.outerHTML = `<img src='${item.img}' width='100' height='100'>`;
    let name = row.insertCell();
    name.innerHTML = item.name;
    let colour = row.insertCell();
    colour.innerHTML = item.colour;
    let price = row.insertCell();
    price.innerHTML = item.price;
    let url = row.insertCell();
    url.outerHTML = `<td><a href='${item.url}' target='_blank'>Click to go to page</a></td>`;
    url.href = item.url;    
  }
});

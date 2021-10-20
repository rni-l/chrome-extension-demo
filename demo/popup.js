const btn = document.querySelector('#show')

function log(txt) {
  document.querySelector('.log')
      .appendChild(document.createElement('div'))
      .innerText = "> " + txt;
}

btn.addEventListener('click', () => {
  document.querySelector('.log').innerHTML = ''
  chrome.storage.sync.get(['data'], function(result) {
    (result.data || []).forEach(({ name }) => {
      log(name)
    })
  })  
})

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg)
})

// setInterval(() => {
//   // // 发送给 popup
//   // chrome.runtime.sendMessage('ok')
//   // 发送给 content_scripts
//   chrome.tabs.query({}, function(tabs){
//     const tab = tabs.find(v => v.url.includes('list.html'))
//     if (!tab) return
//     chrome.tabs.sendMessage(tab.id, 'popup')
//   });
// }, 1000);

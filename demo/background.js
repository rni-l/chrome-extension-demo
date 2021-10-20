
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg)
  if (msg.close) {
    chrome.tabs.remove(sender.tab.id)
  }
  if (msg.data) {
    chrome.storage.sync.get(['data'], function(result) {
      chrome.storage.sync.set({ data: [...(result.data || []), msg.data] }, function() {
        console.log('设置数据成功')
      });
    });
  }
})


setInterval(() => {
  // 发送给 popup
  chrome.runtime.sendMessage('ok')
  // 发送给 content_scripts
  chrome.tabs.query({}, function(tabs){
    const tab = tabs.find(v => v.url.includes('list.html'))
    if (!tab) return
    chrome.tabs.sendMessage(tab.id, 'ok')
  });
}, 1000);

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg === 'list send') {
    chrome.tabs.query({}, function(tabs){
      const tab = tabs.find(v => v.url.includes('detail.html'))
      if (!tab) return
      chrome.tabs.sendMessage(tab.id, 'to detail')
    });
  }
})

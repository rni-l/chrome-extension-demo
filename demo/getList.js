function getData() {
  const items = document.querySelectorAll('.item')
  items.forEach(item => {
    item.querySelector('.item-id').click()
  })
}
checkData('.item', 0, getData)

chrome.runtime.sendMessage('list send')
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg)
})
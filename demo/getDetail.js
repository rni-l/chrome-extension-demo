function getData() {
  const name = $('.name').text()
  const id = $('.id').text()
  chrome.runtime.sendMessage({ data: { name, id }, close: true })
}

checkData('.id', 0, getData)

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg)
})

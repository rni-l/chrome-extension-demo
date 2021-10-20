function checkData(checkDomTxt, executeNum, callback, maxNum = 10) {
  if (executeNum >= maxNum) {
    console.log('100秒过去了，但没有检查到内容')
    return
  }
  setTimeout(() => {
    if (!!document.querySelector(checkDomTxt)) {
      callback()
    } else {
      checkData(checkDomTxt, executeNum + 1, callback, maxNum)
    }
  }, 1000);
}
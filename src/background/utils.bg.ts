/*
 * @Author: Lu
 * @Date: 2025-03-17 22:49:09
 * @LastEditTime: 2025-03-22 22:33:27
 * @LastEditors: Lu
 * @Description:
 */
import { injectRequest } from './injectCaptureRequest'
import { asyncWait } from '~/utils'

const targetDomains = [
  'https://www.baidu.com/*',
]
const checkDomains = [
  'https://www.baidu.com',
]
function injectInterceptRequestBg() {
  injectRequest(['./dist/background/interceptRequest.mjs'], targetDomains)
}
export function checkAndInjectDomain(cacheTabInject: Record<string, boolean>, tabId: number, url?: string) {
  if (cacheTabInject[tabId])
    return
  if (checkDomains.some(v => (url || '').includes(v))) {
    cacheTabInject[tabId] = true
    injectInterceptRequestBg()
  }
}

export async function getCurrentTab() {
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query({
    active: true,
  })
  return tab
}


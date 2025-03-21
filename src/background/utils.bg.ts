/*
 * @Author: Lu
 * @Date: 2025-03-17 22:49:09
 * @LastEditTime: 2025-03-18 23:53:06
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

export async function checkTabStatus(tabId: number): Promise<boolean> {
  const result = await new Promise<boolean>((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        resolve(true)
        return
      }

      if (!tab) {
        resolve(true)
        return
      }

      const isLoaded = tab.status === 'complete'
      resolve(isLoaded)
    })
  })
  if (!result) {
    await asyncWait(200)
    return checkTabStatus(tabId)
  }
  return result
}

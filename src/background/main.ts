import type { Tabs } from 'webextension-polyfill'
import { CetDestination, getCurrentTab, initBGMsgListener, initBackground, onMsgInBG, sendMsgByBG } from 'chrome-extension-tools'
import { checkAndInjectDomain } from './utils.bg'
import {
  EVENT_CHANGE_CURRENT_TAB_BY_BG,
  EVENT_INJECT_INTERCEPT_SCRIPT_SP2BG,
} from '~/constants'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

// remove or turn this off if you don't use side panel
const USE_SIDE_PANEL = true
// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  // @ts-expect-error missing types
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))
}

let previousTabId = 0
let curTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async (tab) => {
  const { tabId } = tab
  if (!previousTabId) {
    previousTabId = tabId
    return
  }
  curTabId = tabId

  let tmp: Tabs.Tab

  try {
    tmp = await browser.tabs.get(curTabId)
    previousTabId = tabId
  }
  catch {
    return
  }
  sendMsgByBG(EVENT_CHANGE_CURRENT_TAB_BY_BG, tmp, { destination: CetDestination.SP, tabId })
})

const cacheTabInject: Record<string, boolean> = {}

/**
 * tab 事件
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  curTabId = tabId
  // 检查页面是否完成加载
  if (changeInfo.status === 'complete') {
    sendMsgByBG(EVENT_CHANGE_CURRENT_TAB_BY_BG, tab, { destination: CetDestination.SP, tabId })
  }
})

chrome.tabs.onCreated.addListener((tab) => {
  curTabId = tab.id || 0
})
chrome.tabs.onRemoved.addListener((tabId) => {
  delete cacheTabInject[tabId]
})
chrome.tabs.onReplaced.addListener((newTabId, oldTabId) => {
  curTabId = newTabId
  delete cacheTabInject[oldTabId]
})
// 初始化消息通知
initBGMsgListener()
// 初始化基本的消息事件
initBackground()

/**
 * 自定义事件
 */
// sp 通知 bg 注入拦截脚本
onMsgInBG(EVENT_INJECT_INTERCEPT_SCRIPT_SP2BG, async () => {
  const tab = await getCurrentTab()
  if (!tab)
    return false
  checkAndInjectDomain(cacheTabInject, tab.id || 0, tab?.url)
  return true
})

;(async () => {
  const tab = await getCurrentTab()
  curTabId = tab.id || 0
})()

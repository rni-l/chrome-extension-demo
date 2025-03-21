/*
 * @Author: Lu
 * @Date: 2025-03-17 22:48:19
 * @LastEditTime: 2025-03-18 23:53:34
 * @LastEditors: Lu
 * @Description:
 */
export function injectRequest(js: string[], match: string[]) {
  chrome.scripting.registerContentScripts([
    {
      id: 'dddd',
      js,
      // runAt: 'document_idle',
      world: 'MAIN',
      persistAcrossSessions: false,

      matches: match,
    },
  ])
}

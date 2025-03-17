/*
 * @Author: Lu
 * @Date: 2025-03-17 22:48:19
 * @LastEditTime: 2025-03-17 22:48:39
 * @LastEditors: Lu
 * @Description:
 */
export function injectRequest() {
  chrome.scripting.registerContentScripts([
    {
      id: 'dddd',
      js: ['./dist/background/intercept-request.mjs'],
      // runAt: 'document_idle',
      world: 'MAIN',
      persistAcrossSessions: false,

      matches: [
        'https://www.baidu.com/*',
      ],
    },
  ])
}

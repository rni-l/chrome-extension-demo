/*
 * @Author: Lu
 * @Date: 2025-03-17 23:25:20
 * @LastEditTime: 2025-03-17 23:34:20
 * @LastEditors: Lu
 * @Description:
 */
import type { CetWorkFlowConfigure } from 'chrome-extension-tools'
import {
  CetDestination,
  CetLogLevel,
  CetLogger,
  loopCheck,
  sendMsgBySP,
} from 'chrome-extension-tools'
import { EVENT_CHECK_TAB_STATUS_SP2BG, EVENT_OPEN_URL_SP2BG } from '~/constants'

export const logger = new CetLogger({
  level: CetLogLevel.INFO,
})

export enum TaskNames {
  open = '打开网页',
  check = '检查网页',
  input = '输入内容',
  click = '点击按钮',
  close = '关闭网页',
}

export function getTasks(): CetWorkFlowConfigure[] {
  return [
    {
      name: TaskNames.open,
      csFn: async () => {
        sendMsgBySP(EVENT_OPEN_URL_SP2BG, 'https://www.baidu.com', { destination: CetDestination.BG })
        return {
          next: true,
        }
      },
      spAfterFn: async (params) => {
        const result = await sendMsgBySP<{ tabId?: number }, boolean>(
          EVENT_CHECK_TAB_STATUS_SP2BG,
          { tabId: params.tabId },
          { destination: CetDestination.BG },
        )
        return {
          next: !!result.data,
        }
      },
    },
    {
      name: TaskNames.check,
      csFn: async () => {
        const next = await loopCheck(async () => {
          const dom = document.querySelector<HTMLElement>('#s_lg_img_new')
          return !!dom
        })
        return {
          next,
        }
      },
    },
  ]
}

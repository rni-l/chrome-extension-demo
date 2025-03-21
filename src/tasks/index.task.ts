/*
 * @Author: Lu
 * @Date: 2025-03-17 23:25:20
 * @LastEditTime: 2025-03-18 23:50:05
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
import { EVENT_CHECK_TAB_STATUS_SP2BG, EVENT_INJECT_INTERCEPT_SCRIPT_SP2BG, EVENT_OPEN_URL_SP2BG, EVENT_RELOAD_SP2BG, EVENT_REMOVE_TAB_SP2BG } from '~/constants'

export const logger = new CetLogger({
  level: CetLogLevel.INFO,
})

export enum TaskNames {
  open = '打开网页',
  check = '检查网页',
  intercept = '拦截请求',
  input = '输入内容',
  click = '点击按钮',
  close = '关闭网页',
}

export function getTasks(): CetWorkFlowConfigure[] {
  return [
    {
      name: TaskNames.open,
      spBeforeFn: async () => {
        sendMsgBySP(EVENT_OPEN_URL_SP2BG, { url: 'https://www.baidu.com' }, { destination: CetDestination.BG })
        return {
          next: true,
        }
      },
    },
    {
      name: TaskNames.check,
      spBeforeFn: async (params) => {
        const result = await sendMsgBySP<{ tabId?: number }, boolean>(
          EVENT_CHECK_TAB_STATUS_SP2BG,
          { tabId: params.tabId },
          { destination: CetDestination.BG },
        )
        return {
          next: !!result.data,
        }
      },
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
    {
      name: TaskNames.intercept,
      spBeforeFn: async () => {
        await sendMsgBySP(EVENT_INJECT_INTERCEPT_SCRIPT_SP2BG, {}, { destination: CetDestination.BG })
        await sendMsgBySP(EVENT_RELOAD_SP2BG, {}, { destination: CetDestination.BG })
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
      name: TaskNames.input,
      csFn: async () => {
        const next = await loopCheck(async () => {
          const dom = document.querySelector<HTMLInputElement>('.new-pmd input')
          if (!dom)
            return false
          dom.value = 'test'
          return true
        })
        return {
          next,
        }
      },
    },
    {
      name: TaskNames.click,
      csFn: async () => {
        const next = await loopCheck(async () => {
          const dom = document.querySelector<HTMLElement>('.s_btn_wr input')
          if (!dom)
            return false
          dom.click()
          return true
        })
        return {
          next,
        }
      },
    },
    {
      name: TaskNames.close,
      csFn: async () => {
        const text: string[] = []
        const next = await loopCheck(async () => {
          const list = document.querySelectorAll<HTMLElement>('.result')
          if (!list || list.length === 0)
            return false
          Array.from(list).forEach((item) => {
            text.push(item.textContent || '')
          })
          return true
        })
        return {
          next,
          data: text,
        }
      },
      spAfterFn: async (params) => {
        sendMsgBySP(EVENT_REMOVE_TAB_SP2BG, { tabId: params.tabId }, { destination: CetDestination.BG })
        logger.info(params.csFnResult.data)
        return {
          next: true,
        }
      },
    },
  ]
}

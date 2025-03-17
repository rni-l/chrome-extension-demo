/*
 * @Author: Lu
 * @Date: 2024-11-19 17:51:46
 * @LastEditTime: 2025-03-17 23:12:33
 * @LastEditors: Lu
 * @Description:
 */
import { handleResponseData } from 'chrome-extension-tools'
import { MAX_CHECK_NUMBER } from '~/constants'

export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

export function generateTenDigitRandom(max = 9999999999, min = 1000000000) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function asyncWait(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export interface TLoopCheckOptions {
  matchNumber: number
  spaceTime: number
}

export async function loopCheck(checkFn: (number: number) => Promise<boolean>, params: TLoopCheckOptions = {
  matchNumber: MAX_CHECK_NUMBER,
  spaceTime: 1000,
}) {
  let matchNumber = 0
  while (true) {
    matchNumber += 1
    const next = await checkFn(matchNumber)
    if (next) {
      return true
    }
    if (matchNumber >= params.matchNumber) {
      return false
    }
    await asyncWait(params.spaceTime)
  }
}

export function stringObject(obj: any) {
  try {
    return JSON.stringify(obj, undefined, ' ')
  }
  catch (e) {
    console.log(e)
    return obj.toString()
  }
}

export function transformInterface(data: any) {
  return {
    url: data.url || '',
    response: handleResponseData(data?.response),
    data: handleResponseData(data?.data),
    body: handleResponseData(data?.body),
    headers: handleResponseData(data?.headers),
    id: data.id,
  }
}

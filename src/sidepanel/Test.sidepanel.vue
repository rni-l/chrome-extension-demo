<!--
 * @Author: Lu
 * @Date: 2025-03-17 23:35:23
 * @LastEditTime: 2025-03-18 22:49:20
 * @LastEditors: Lu
 * @Description:
-->
<script setup lang="ts">
import type { CetLogEntry } from 'chrome-extension-tools'
import { CetActuator, CetDestination, EVENTS, sendMsgBySP } from 'chrome-extension-tools'
import ActionLog from '../components/ActionLog.vue'
import { getTasks, logger } from '~/tasks/index.task'

const logList = shallowRef<CetLogEntry[]>([])
logger.logChange = (logs: CetLogEntry[]) => {
  console.log('logs', logs)
  logList.value = logs.map(v => v)
}

const shotLogList = computed(() => {
  return logList.value.map(v => v.formattedMessage)
})

async function getTab() {
  const { data } = await sendMsgBySP<undefined, chrome.tabs.Tab>(EVENTS.SP2BG_GET_CURRENT_TAB, undefined, { destination: CetDestination.BG })
  return data
}

async function start() {
  logger.info('开始执行')
  // const ins = new CetActuator(getTest1(), {
  const ins = new CetActuator(getTasks(), {
    // @ts-ignore
    getTabId: async () => {
      const tab = await getTab()
      console.log('tab', tab?.id)
      return tab ? tab.id : undefined
    },
    taskBeforeCb: (task) => {
      logger.info(`${task.name} 开始执行`)
    },
    taskAfterCb: (task, result) => {
      logger.info(`${task.name} 执行结束 ${result ? '成功' : '失败'}`)
    },
  })
  const result = await ins.run()
  console.log(result)
  logger.info('全流程结束')
}
function handleClick() {
  start()
}
function clearLog() {
  logger.clearLogs()
}
</script>

<template>
  <div>
    <div class="top">
      <button class="btn mt-2" @click="handleClick">
        开始任务
      </button>
      <button class="btn mt-2" @click="clearLog">
        清空日志
      </button>
    </div>
    <div class="wrap">
      <ActionLog :list="shotLogList" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

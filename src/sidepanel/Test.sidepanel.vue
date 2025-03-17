<!--
 * @Author: Lu
 * @Date: 2025-03-17 23:35:23
 * @LastEditTime: 2025-03-17 23:36:31
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

async function start() {
  logger.info('开始执行')
  logger.info('检查标签页')
  const { data } = await sendMsgBySP<undefined, chrome.tabs.Tab>(EVENTS.SP2BG_GET_CURRENT_TAB, undefined, { destination: CetDestination.BG })
  if (!data?.id) {
    logger.error('标签页不存在')
    return
  }
  logger.info(`当前标签页：${data.id} ${data.url}`)
  // const ins = new CetActuator(getTest1(), {
  const ins = new CetActuator(getTasks(), {
    getTabId: async () => {
      return data.id as number
    },
    taskBeforeCb: (task) => {
      logger.info(`${task.name} 开始执行`)
    },
    taskAfterCb: (task, result) => {
      // logger.info(serializeJSON(logItem))
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

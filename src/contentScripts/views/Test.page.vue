<!--
 * @Author: Lu
 * @Date: 2025-03-17 23:24:08
 * @LastEditTime: 2025-03-17 23:34:47
 * @LastEditors: Lu
 * @Description:
-->
<script setup lang="ts">
import { initContentScriptRequest, initContentScriptTask } from 'chrome-extension-tools'
import { getTasks } from '~/tasks/index.task'

initContentScriptRequest()
initContentScriptTask(getTasks())
</script>

<template>
  <div />
</template>

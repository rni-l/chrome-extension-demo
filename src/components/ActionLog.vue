<!--
 * @Author: Lu
 * @Date: 2025-03-17 23:36:44
 * @LastEditTime: 2025-03-17 23:36:44
 * @LastEditors: Lu
 * @Description:
-->
<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
  list: {
    type: Array as PropType<string[]>,
    default: () => ([]),
  },
})
</script>

<template>
  <div
    class="c-log mt-12px"
  >
    <div>日志：{{ list.length }}</div>
    <div
      class="c-log-wrap
    p-12px
    text-12px
    mt-12px b-solid b-coolGray-3 rounded-12px h-500px overflow-y-auto"
    >
      <div v-for="(v, i) in props.list" :key="i" class="item pb-6px">
        {{ v }}
      </div>
    </div>
  </div>
</template>

<template>
  <div>
    <VueDatePicker
      v-model="date"
      range
      placeholder="Select start and end date"
      @update:model-value="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const emits = defineEmits(['changed'])
const date = ref(new Date())

const startDate = ref(new Date())
startDate.value.setFullYear(startDate.value.getFullYear() - 1)

const endDate = new Date()
date.value = [startDate, endDate]

const handleChange = (value: Date[]) => {
  emits('changed', {
    startDate: new Date(value[0]).toISOString(),
    endDate: new Date(value[1]).toISOString()
  })
}
</script>

<style scoped></style>

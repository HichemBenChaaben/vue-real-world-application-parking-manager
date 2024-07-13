<template>
  <Doughnut :data="props.data" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

export interface Data {
  readonly labels: string[]
  readonly datasets: DataSet[]
}

interface DataSet {
  readonly backgroundColor: string[]
  readonly data: number[]
}

interface Options {
  responsive: boolean
  maintainAspectRatio: boolean
}

interface Props {
  readonly data: Data
}
const props = defineProps<Props>()

const options = ref<Options>({
  responsive: true,
  maintainAspectRatio: true
})

ChartJS.register(ArcElement, Tooltip, Legend)
</script>

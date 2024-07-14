<template>
  <Bar :data="data" :options="options" />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  type ChartData,
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js' // package name not a file

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
}

interface Props {
  dataSets: object | ChartData<'bar'>
}
const props = defineProps<Props>()
const data = ref<ChartData<'bar'>>(props.dataSets as ChartData<'bar'>)

onMounted(() => {
  setTimeout(() => {
    data.value = props.dataSets as ChartData<'bar'>
  }, 1000)
})

watch(
  () => props.dataSets,
  () => {
    data.value = props.dataSets as ChartData<'bar'>
  }
)
</script>

<template>
  <div class="flex flex-row">
    <div>
      <div class="flex justify-between gap-1 mx-1 flex-col">
        <div
          v-for="(day, index) in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :key="index"
          class="flex flex-col h-[18px] relative"
        >
          <div class="text-sm text-gray-600">{{ day }}</div>
        </div>
      </div>
    </div>
    <div>
      <div
        class="flex justify-between gap-2 mx-1 flex-row overflow-x-scroll pb-6 overflow-y-visible w-full max-w-[800px]"
      >
        <div v-for="(week, jIndex) in activityGrid" :key="jIndex" class="flex flex-col gap-1">
          <button
            :alt="day.sessions"
            v-for="(day, index) in week"
            :key="index"
            :class="day.score"
            class="relative group border border-gray-100 border-solid w-[18px] h-[18px] rounded-sm bg-gray-100 hover:bg-gray-300 cursor-pointer"
          >
            <div
              class="font-semibold absolute hidden group-hover:inline-block whitespace-nowrap px-2 mt-2 bg-white top-3 shadow-md left-0 border border-solid rounded-sm text-gray-600 z-10"
            >
              {{ day.sessions }} session{{ day.sessions > 1 ? 's' : '' }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
const rows = 90 // number of rows
const cols = 7 // number of columns

const getRandomNumber = () => Math.floor(Math.random() * 101)

const data = Array.from({ length: rows }, () => Array.from({ length: cols }, getRandomNumber))

const sessions = ref(data)
const showPopover = ref<boolean[][]>()

const activityGrid = computed(() => {
  return sessions.value.map((week) =>
    week.map((day) => {
      return {
        sessions: day,
        score: getColor(day)
      }
    })
  )
})

const getColor = (score) => {
  if (score === 0) return 'bg-gray-400 border boder-1 border-solid border-blue-800'
  if (score > 0 && score < 10) return 'bg-blue-200 border boder-1 border-solid border-blue-800'
  if (score > 10 && score < 30) return 'bg-blue-300 border boder-1 border-solid border-blue-800'
  if (score > 30 && score < 40) return 'bg-blue-400 border boder-1 border-solid border-blue-800'
  if (score > 40 && score < 60) return 'bg-blue-600 border boder-1 border-solid border-blue-800'
  if (score > 60 && score < 80) return 'bg-blue-700 border boder-1 border-solid border-blue-800'
  else {
    return 'bg-blue-800 border boder-1 border-solid border-blue-800'
  }
}
</script>

<style scoped></style>

<template>
  <tr v-for="(item, index) in props.data" :key="index">
    <td>{{ item }}</td>
  </tr>
</template>

<script lang="ts" setup>
interface Props {
  data: any[]
}
const props = defineProps<Props>()
</script>

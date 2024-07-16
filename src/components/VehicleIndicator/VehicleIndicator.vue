<template>
  <i
    :class="`text-xl fas fa-${props.vehicleType === 'CAR' ? 'car' : 'motorcycle'} text-gray-400`"
  ></i>
</template>

<script lang="ts" setup>
interface Props {
  vehicleType: 'CAR' | 'MOTORCYCLE' | string
}
const props = defineProps<Props>()
</script>

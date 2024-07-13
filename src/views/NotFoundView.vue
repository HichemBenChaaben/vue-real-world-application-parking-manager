<template>
  <div class="not-found bg-blue-100 p-4">
    <div class="flex align-center justify-center">
      <img src="@/assets/404.png" alt="404" />
    </div>
    <p>Oops! The page you are looking for does not exist.</p>
    <router-link to="/">Home</router-link>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}

p {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>

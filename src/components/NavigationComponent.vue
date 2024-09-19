<template>
  <div class="main-navigation">
    <button @click="router.push({name: 'users-list'})">Home</button>
    <button @click="router.push({name: 'registration'})">Registration</button>
  </div>
</template>


<script setup lang="ts">
import {  useRouter, Router } from 'vue-router'

const router: Router = useRouter();

</script>

<style scoped>
.main-navigation {
  margin-bottom: 60px;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  background-color: antiquewhite;
}

</style>

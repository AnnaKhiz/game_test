<template>
  <div>
    <button @click="router.push({name: 'users-list'})">Home</button>
    <button @click="router.push({name: 'registration'})">Registration</button>
  </div>
</template>


<script setup lang="ts">
import {  useRouter, Router } from 'vue-router'

const router: Router = useRouter();

</script>

<style scoped>

</style>

<template>
  <div class="main-navigation">
    <button @click="goToHomePage">Home</button>
    <button @click="isAuthorized === 'true' ? logOutUser() : logInUser() ">{{ buttonLabel }}</button>
  </div>
</template>


<script setup lang="ts">
import {computed} from 'vue';
import { useRouter, Router } from 'vue-router'
import { useLocalStorage } from '@vueuse/core';

const router: Router = useRouter();
const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
})

const logInUser = () => {
  router.push({name: 'login'})
}

const logOutUser = () => {
  isAuthorized.value = 'false';
  router.push({name: 'users-list'})
}

const buttonLabel = computed(() => isAuthorized.value === 'true' ? 'Logout' : 'Log in')

const goToHomePage = () => {
  if (router.currentRoute.value.path.match(/^\/admin/)) {
    router.push({name: 'admin-users'})
    return
  }
  if (isAuthorized.value === 'true') {
    router.push({name: 'users-list-auth'})
    return
  }
  router.push({name: 'users-list'})
}

</script>

<style scoped lang="scss">
.main-navigation {
  margin-bottom: 60px;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  background-color: antiquewhite;
  & > button {
    border: 1px solid gray
  }
}

</style>

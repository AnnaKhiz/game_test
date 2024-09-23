<template>
  <div class="container-registration">
    <h2 class="registration-label">{{ formLabel }}</h2>
    <ui-login-form v-if="router.currentRoute.value.name === 'login'"/>
    <ui-registration-form v-else/>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import uiRegistrationForm from "@/components/UI/uiRegistrationForm.vue";
import UiLoginForm from "@/components/UI/uiLoginForm.vue";
import {  useRouter, Router } from 'vue-router';

const router: Router = useRouter();

const formLabel = computed( (): string => {
  return router.currentRoute.value.name === 'login' ? 'Enter your email and password' : 'Fill the registration form below'
})

</script>

<style scoped>
.container-registration {
  text-align: center;
}
.registration-label {
  margin-bottom: 30px;
}
</style>

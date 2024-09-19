<template>
  <div class="container-registration">
    <h2 class="registration-label">Fill the registration form below</h2>
    <ui-registration-form/>
  </div>
</template>

<script setup lang="ts">

import uiRegistrationForm from "@/components/UI/uiRegistrationForm.vue";
</script>

<style scoped>
.container-registration {
  text-align: center;
}
.registration-label {
  margin-bottom: 30px;
}
</style>

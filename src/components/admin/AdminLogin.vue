<template>
  <h2 class="admin-main__title">Log in to admin page!</h2>
  <ui-login-form admin/>
</template>

<script setup lang="ts">

import UiLoginForm from "@/components/UI/uiLoginForm.vue";
</script>

<style scoped lang="scss">
.admin-main__title {
  text-align: center;
}
</style>

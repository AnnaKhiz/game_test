<template>
  <navigation-component />
  <div class="container">
    <router-view/>
  </div>
</template>

<script lang="ts" setup>
import NavigationComponent from "@/components/NavigationComponent.vue";
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: #424242;
}
body, html {
  height: 100vh;
  background-color: #e8e8e8;
}
#app {
  height: 80%
}

.container {
  height: 100%;
  margin: 20px 40px;
}

</style>

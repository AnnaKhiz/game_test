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
  background-color: #e8e8e8;
}
.container {
  margin: 20px 40px;
}

</style>

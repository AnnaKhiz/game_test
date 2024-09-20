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
}
.container {
  margin: 20px 40px;
}
button {
  display: block;
  width: 100px;
  padding: 10px 15px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}
</style>

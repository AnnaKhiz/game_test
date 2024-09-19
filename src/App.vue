<template>
  <navigation-compopnent />
  <router-view/>
</template>

<script lang="ts" setup>
import NavigationCompopnent from "@/components/NavigationCompopnent.vue";

</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

}
</style>

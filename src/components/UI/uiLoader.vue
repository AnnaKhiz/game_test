<template>
  <div class="loader-style" >
    <img
      :class="{ 'spinner' : store.getters.loading }"
      src="../../assets/loader.png"
      alt="loader icon"
    />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
const store = useStore();

</script>

<style scoped lang="scss">
.loader-style {
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;
}
</style>

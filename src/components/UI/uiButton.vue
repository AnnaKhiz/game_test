<template>
  <button
    class="custom-button"
  >
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
import type { PropsButton } from "@/interfaces";
import { defineProps } from 'vue';

const props = defineProps<PropsButton>();

</script>

<style scoped lang="scss">
.custom-button {
  display: block;
  width: 100px;
  padding: 10px 15px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background-color: #b3ccfa;
  transition: background-color 0.3s ease-in-out 0s, color 0.3s ease-in-out 0s;
  &:hover {
    background-color: bisque;
    color: cornflowerblue;
  }
}
</style>

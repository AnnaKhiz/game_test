<template>
  <button
    class="custom-button"
    :disabled="props.disabled"
    @click.prevent="emit('action')"
  >
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
import type { PropsButton } from "@/interfaces";
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['action'])

const props = defineProps<PropsButton>();

</script>

<style scoped lang="scss">
.custom-button {
  display: block;
  width: 100px;
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  color: #e8e8e8;
  outline: none;
  box-shadow: 1px 1px 6px #e8e8e8;
  background-color: #976464;
  transition: background 0.5s ease-in-out 0s, color 0.3s ease-in-out 0s;
  &:hover {
    background: #e8e8e8;
    color: #424242;
  }
  &:disabled {
    opacity: 0.3;
    cursor: none;
    pointer-events: none;
  }
}
</style>

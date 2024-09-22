<template>
  <div>
    <span
      v-for="star in props.ratingQuantity"
      :key="star"
      class="rating-stars"
      :class="[{'checked' : star <= props.rating}, { 'no-hover': props.disableHover }]"
      @click="emit('setRating', star)"
    >
    ★
    </span>
  </div>

</template>

<script setup lang="ts">
import { RatingStars } from "@/interfaces";
import { defineProps, defineEmits } from "vue";

const props: RatingStars = defineProps<RatingStars>();
const emit = defineEmits<{
  (event: 'setRating', star: number):void }
>();

</script>

<style scoped lang="scss">
.rating-stars {
  cursor: pointer;
  font-size: 1.5rem;
  &.checked {
    color: red;
    &.no-hover:hover {
      color: red;
    }
  }
  &:hover {
    color: red;
  }
  &.no-hover:hover {
    color: black;
  }
}

</style>

<template>
  <div>
    <span
      v-for="star in store.getters.ratingQuantity"
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
import {useStore} from "vuex";
const store = useStore();

const props: RatingStars = defineProps<RatingStars>();
const emit = defineEmits<{
  (event: 'setRating', star: number):void }
>();

</script>

<style scoped lang="scss">
.rating-stars {
  cursor: pointer;
  font-size: 1.2rem;
  &.checked {
    color: #ff8400;
    &.no-hover:hover {
      color: #ff8400;
    }
  }
  &:hover {
    color: #ff8400;
  }
  &.no-hover:hover {
    color: #424242;
  }
}

</style>

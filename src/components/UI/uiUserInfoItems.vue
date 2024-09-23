<template>
  <div class="user-info">
    <p><span>Name:</span> {{props.user.name}}</p>
    <p><span>Surname:</span> {{props.user.surname}}</p>
    <p><span>Email:</span> {{props.user.email}}</p>
    <p><span>Rating:</span> {{props.user.rating || 0}}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { UserRegist } from "@/interfaces";

const props = defineProps<{
  user: UserRegist
}>()
</script>

<style scoped lang="scss">
.user-info {
  width: 60%;
  overflow: hidden;
  & > p {
    margin-bottom: 5px;
    & > span {
      font-weight: 600;
    }
  }
}
</style>

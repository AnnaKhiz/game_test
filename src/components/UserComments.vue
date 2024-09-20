<template>

  <div v-if="user" class="user-item">
    <div>
      <p>Name: {{user.name}}</p>
      <p>Surname: {{user.surname}}</p>
      <p>Email: {{user.email}}</p>
      <p>Rating: {{user.rating || 0}}</p>
    </div>

    <div v-if="isAuthorized === 'true' || props.admin" class="rating-block">
      <div>
          <span
            v-for="star in ratingQuantity"
            :key="star"
            :class="{'checked' : star <= user.rating}"
            @click="setRating(star, user.id, index)"
          >
            ★
          </span>
      </div>
      <button @click="router.push({name: 'users-comments', params: { userCommentId: user.id}})">Comments</button>
    </div>
  </div>
  <button @click="router.back()">Go back</button>
</template>

<script setup lang="ts">
import {ref, defineProps, onMounted} from 'vue';
import { useRouter, Router } from 'vue-router';
import {DatabaseReference, get} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import {PropsObject, UserRegist} from "@/interfaces";
import {database} from "@/firebase";
const router: Router = useRouter();
const props: PropsObject = defineProps<PropsObject>()

const user = ref<UserRegist>()

const getAuthUserInfo = async () => {
  if (props.userCommentId) {
    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userCommentId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        user.value = snapshot.val()
      }

    } catch (error) {
      console.log(error)
    }
  }

}

onMounted(async () => {
  await getAuthUserInfo()
})

</script>

<style scoped lang="scss">

</style>

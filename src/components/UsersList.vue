<template>
  <h2 class="main__title">{{ isAuthorized === 'true' ? `Welcome ${props.admin ? 'Admin' : name}` : 'Users list' }}</h2>

<!--  <router-view v-if="!props.admin" :author="name" @updateRating="updateUsersList"/>-->
  <div >
    <div v-if="users.length" class="container-users">
      <div v-for="user in filteredUsers" :key="user.email" class="user-item">
        <div>
          <p>Name: {{user.name}}</p>
          <p>Surname: {{user.surname}}</p>
          <p>Email: {{user.email}}</p>
          <p>Rating: {{user.rating || 0}}</p>
        </div>

        <div class="rating-block">
          <div>
          <span
            v-for="star in ratingQuantity"
            :key="star"
            :class="{'checked' : star <= user.rating}"
          >
            ★
          </span>
          </div>
          {{props}}
          <button
            v-if="isAuthorized === 'true'"
            @click="props.admin ? router.push({name: 'admin-comments', params: { userCommentId: user.id}}) : router.push({name: 'users-comments', params: { userCommentId: user.id}})"
          >
            Comments
          </button>
          <button
            v-else
            @click="router.push({name: 'users-comments', params: { userCommentId: user.id, userId: 'user' }})"
          >
            Comments
          </button>
        </div>
      </div>
    </div>
    <div v-else class="container-users">
      <h3>There are no users in users list. <a href="#" @click="router.push({name: 'register'})" class="users-list-link">Sign up</a> and become first one!</h3>
    </div>
  </div>


</template>

<script lang="ts" setup>
import { ref as dbRef, get, child, DatabaseReference } from "firebase/database";
import { database } from '@/firebase.js';
import {onMounted, ref, defineProps, computed } from "vue";
import { useRouter, Router } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';
import {UserRegist, PropsObject} from '@/interfaces';

const router: Router = useRouter();
const props = defineProps<PropsObject>();

const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
})

// const isCommentsRoute = computed(() => {
//   return router.currentRoute.value.path.match(/comments/)
// })

const users = ref<UserRegist[]>([]);
const ratingQuantity = ref<number>(5);
const authUser = ref<UserRegist>()

const filteredUsers = computed(() => {
  return users.value.filter(el => !el.role)
})

const name = computed(() => {
  return authUser.value ? `${authUser.value.surname} ${authUser.value.name}!`: ''
})
const fetchUsers = async () => {
  try {
    const db = dbRef(database);
    const snapshot = await get(child(db, `users/`));
    if (snapshot.exists()) {

      snapshot.forEach(childSnapshot => {
        const userId = childSnapshot.key;
        const userData = childSnapshot.val();
        console.log(userId, userData)
        users.value.push({id: userId, ...userData} as UserRegist);
      })
    } else {
      console.log("No data");
    }
  } catch (error) {
    console.error("Error in fetch request (get users list:", error);
  }
}

const getAuthUserInfo = async () => {
  if (props.userId) {

    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        authUser.value = snapshot.val()
      }

    } catch (error) {
      console.log(error)
    }
  }

}

// const updateUsersList = (value: EmitUpdateRating) => {
//   console.log('emited object!!!!!!!!!!!!!!!!!', value)
//
//   const index = users.value.findIndex(user => user.id === value.id);
//
//   if (index === -1) return;
//
//   users.value[index].rating = value.rating;
// }

onMounted(async () => {
  await fetchUsers();
  await getAuthUserInfo();
})


</script>


<style scoped>
.main__title {
  text-align: center;
  margin-bottom: 20px;
}
.container-users {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  width: 100%;
  padding: 20px 0;
  & > h3 {
    font-weight: 400;
  }
}
.user-item {
  flex-grow: 0;
  display: flex;
  justify-content: space-between;
  width: calc(50% - 7.5px);
  padding: 10px;
  border: 1px solid black;
}
.users-list-link {
  text-decoration: none;
  color: brown;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
}

.rating-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  & > div span {
    font-size: 1.2rem;
    &.checked {
      color: red;
    }
  }
}
</style>

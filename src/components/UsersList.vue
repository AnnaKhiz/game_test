<template>
  <div class="container-users">
    <div v-for="user in users" :key="user.email" class="user-item">
      <div>
        <p>id: {{user.id}}</p>
        <p>Name: {{user.name}}</p>
        <p>Surname: {{user.surname}}</p>
        <p>Email: {{user.email}}</p>
        <p>Rating: {{user.rating || 0}}</p>
      </div>


      <div v-if="isAuthorized === 'true'">
        <button>Comments</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import type { UserRegist } from '@/interfaces';
import { ref as dbRef, get, child } from "firebase/database";
import "firebase/database";
import { database } from '@/firebase.js'
import {useLocalStorage} from "@/composables/useLocalStorage";
const users = ref<UserRegist[]>([]);

const isAuthorized = useLocalStorage<string>('authorized', 'false')

const fetchUsers = async () => {
  try {
    const db = dbRef(database);
    const snapshot = await get(child(db, `users/`));
    if (snapshot.exists()) {

      snapshot.forEach(childSnapshot => {
        const userId = childSnapshot.key;
        const userData = childSnapshot.val();
        users.value.push({id: userId, ...userData} as UserRegist);
      })
    } else {
      console.log("No data");
    }
  } catch (error) {
    console.error("Error in fetch request (get users list:", error);
  }
}

onMounted(async () => {
  await fetchUsers()
})


</script>


<style scoped>
.container-users {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  width: 100%;
  padding: 20px 0;
}
.user-item {
  flex-grow: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: calc(50% - 7.5px);
  padding: 10px;
  border: 1px solid black;
}
</style>
